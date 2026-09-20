import { notify } from '@affine/component';
import { DocsService } from '@affine/core/modules/doc';
import { FavoriteService } from '@affine/core/modules/favorite';
import { OrganizeService } from '@affine/core/modules/organize';
import { GuardService } from '@affine/core/modules/permissions';
import { TagService } from '@affine/core/modules/tag';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import { useService } from '@toeverything/infra';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  UndoableActionReceipt,
  type UndoableChange,
} from '../../undoable-action/receipt';

export type SelectionAction =
  | { type: 'tag'; id?: string; name: string }
  | { type: 'folder'; id: string; name: string }
  | { type: 'favorite' };

export function useSelectionActions() {
  const t = useI18n();
  const docs = useService(DocsService).list;
  const tags = useService(TagService);
  const favorites = useService(FavoriteService).favoriteList;
  const folders = useService(OrganizeService).folderTree;
  const guard = useService(GuardService);
  const workspace = useService(WorkspaceService).workspace;
  const working = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const clearMessage = useCallback(() => setMessage(''), []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clearMessage, 4000);
    return () => clearTimeout(timer);
  }, [clearMessage, message]);

  const run = async (action: SelectionAction, selected: string[]) => {
    if (working.current || workspace.openOptions.isSharedMode) return;
    const ids = [...new Set(selected)];
    if (!ids.length) return;
    working.current = true;
    setBusy(true);
    setMessage('');
    const changes: UndoableChange[] = [];
    let skipped = 0;
    let existing = 0;
    try {
      // Resolve permissions before applying the snapshot of this selection.
      // A later click on another row never changes the in-flight batch.
      const allowed = await Promise.all(
        ids.map(async id => {
          try {
            return action.type !== 'tag' || (await guard.can('Doc_Update', id));
          } catch {
            return false;
          }
        })
      );
      let tagId = action.type === 'tag' ? action.id : undefined;
      if (action.type === 'tag' && !tagId) {
        // Reuse a tag created while the picker was open instead of duplicating it.
        tagId = tags.tagList.tagMetas$.value.find(
          tag =>
            tag.name.trim().toLocaleLowerCase() ===
            action.name.trim().toLocaleLowerCase()
        )?.id;
        if (!tagId) {
          const canCreate = await guard.can('Workspace_Properties_Update');
          if (
            !canCreate ||
            !ids.some(
              (id, i) =>
                allowed[i] &&
                docs.doc$(id).value &&
                !docs.doc$(id).value?.trash$.value
            )
          ) {
            setMessage(t['com.affine.selection.unavailable']());
            return;
          }
          tagId = tags.tagList.createTag(
            action.name.trim(),
            tags.randomTagColor()
          ).id;
        }
      }
      for (const [i, id] of ids.entries()) {
        const doc = docs.doc$(id).value;
        if (!doc || doc.trash$.value || !allowed[i]) {
          skipped++;
          continue;
        }
        try {
          if (action.type === 'tag' && tagId) {
            if (!tags.tagList.tagByTagId$(tagId).value) {
              skipped++;
              continue;
            }
            const before = doc.meta$.value.tags ?? [];
            if (before.includes(tagId)) {
              existing++;
              continue;
            }
            const addedTag = tagId;
            const after = [...before, addedTag];
            doc.setMeta({ tags: after });
            changes.push({
              undo: async () => {
                if (!(await guard.can('Doc_Update', id))) return false;
                const current = docs.doc$(id).value;
                const currentTags = current?.meta$.value.tags ?? [];
                // Keep later tag edits intact rather than restoring a stale snapshot.
                if (
                  !current ||
                  current.trash$.value ||
                  currentTags.length !== after.length ||
                  currentTags.some((tag, index) => tag !== after[index])
                )
                  return false;
                current.setMeta({
                  tags: currentTags.filter(tag => tag !== addedTag),
                });
                return true;
              },
            });
          } else if (action.type === 'folder') {
            const folder = folders.folderNode$(action.id).value;
            if (!folder || folder.type$.value !== 'folder') {
              skipped++;
              continue;
            }
            const change = folder.fileDoc(id, folder.indexAt('after'));
            if (change) changes.push(change);
            else existing++;
          } else if (action.type === 'favorite') {
            if (favorites.isFavorite$('doc', id).value) {
              existing++;
              continue;
            }
            const added = favorites.add('doc', id);
            changes.push({
              undo: () => {
                if (favorites.favorite$('doc', id).value?.index !== added.index)
                  return false;
                favorites.remove('doc', id);
                return true;
              },
            });
          }
        } catch (error) {
          skipped++;
          console.error('Could not apply selection action', error);
        }
      }
      const detail = [
        skipped
          ? t['com.affine.selection.skipped-count']({ count: String(skipped) })
          : '',
        existing
          ? t['com.affine.selection.already-count']({ count: String(existing) })
          : '',
        action.type === 'folder'
          ? t['com.affine.selection.originals-stay']()
          : t['com.affine.selection.kept-selected'](),
      ]
        .filter(Boolean)
        .join(' · ');
      if (!changes.length) {
        setMessage(
          skipped
            ? t['com.affine.selection.unavailable']()
            : t['com.affine.selection.already-done']()
        );
        return;
      }
      const count = String(changes.length);
      const title =
        action.type === 'favorite'
          ? t['com.affine.selection.favorited']({ count })
          : action.type === 'folder'
            ? t['com.affine.selection.filed']({ count, name: action.name })
            : t['com.affine.selection.tagged']({ count, name: action.name });
      const receipt = crypto.randomUUID();
      notify.custom(
        ({ onDismiss }) => (
          <UndoableActionReceipt
            key={receipt}
            title={title}
            detail={detail}
            changes={changes}
            onDismiss={onDismiss}
            onUndo={clearMessage}
            undoneTitle={t['com.affine.selection.undone']()}
            testId="selection-action-receipt"
          />
        ),
        {
          id: `selection-action:${workspace.id}`,
          duration: 8000,
          position: 'top-right',
        }
      );
      setMessage(
        skipped
          ? t['com.affine.selection.skipped-count']({ count: String(skipped) })
          : ''
      );
    } catch (error) {
      console.error('Could not prepare selection action', error);
      setMessage(t['com.affine.selection.failed']());
    } finally {
      working.current = false;
      setBusy(false);
    }
  };

  return {
    busy,
    message,
    run: (action: SelectionAction, ids: string[]) => {
      run(action, ids).catch(console.error);
    },
    clearMessage,
  };
}
