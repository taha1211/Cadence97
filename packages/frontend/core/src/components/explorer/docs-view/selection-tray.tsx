import { Popover } from '@affine/component';
import { DocsService } from '@affine/core/modules/doc';
import { FavoriteService } from '@affine/core/modules/favorite';
import {
  type FolderNode,
  OrganizeService,
} from '@affine/core/modules/organize';
import { GuardService } from '@affine/core/modules/permissions';
import { TagService } from '@affine/core/modules/tag';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import {
  CloseIcon,
  DeleteIcon,
  FavoritedIcon,
  FavoriteIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
} from '@blocksuite/icons/rc';
import { LiveData, useLiveData, useService } from '@toeverything/infra';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSelectionActions } from './selection-actions';
import * as styles from './selection-tray.css';

export function SelectionTray({
  selectedDocIds,
  onClose,
  onDelete,
}: {
  selectedDocIds: string[];
  onClose: () => void;
  onDelete?: () => void;
}) {
  const t = useI18n();
  const docs = useService(DocsService).list;
  const tagService = useService(TagService);
  const tree = useService(OrganizeService).folderTree;
  const favorites = useService(FavoriteService).favoriteList;
  const guard = useService(GuardService);
  const shared =
    useService(WorkspaceService).workspace.openOptions.isSharedMode;
  const tags = useLiveData(tagService.tagList.tagMetas$);
  const canCreateTag = useLiveData(guard.can$('Workspace_Properties_Update'));
  const { busy, message, run, clearMessage } = useSelectionActions();
  const [picker, setPicker] = useState<'tag' | 'folder' | null>(null);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const ids = useMemo(() => [...new Set(selectedDocIds)], [selectedDocIds]);
  useEffect(clearMessage, [clearMessage, ids]);
  const selection = useLiveData(
    useMemo(
      () =>
        LiveData.computed(get => {
          const tagCounts = new Map<string, number>();
          let favoriteCount = 0;
          for (const id of ids) {
            const doc = get(docs.doc$(id));
            if (!doc || get(doc.trash$)) continue;
            for (const tag of new Set(get(doc.meta$).tags ?? []))
              tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
            if (get(favorites.isFavorite$('doc', id))) favoriteCount++;
          }
          return { tagCounts, favoriteCount };
        }),
      [docs, favorites, ids]
    )
  );
  const folders = useLiveData(
    useMemo(
      () =>
        LiveData.computed(get => {
          const result: {
            id: string;
            name: string;
            path: string;
            count: number;
          }[] = [];
          const visited = new Set<string>();
          const visit = (parent: FolderNode, path: string[]) => {
            for (const node of get(parent.sortedChildren$)) {
              if (
                !node.id ||
                get(node.type$) !== 'folder' ||
                visited.has(node.id)
              )
                continue;
              visited.add(node.id);
              const name = get(node.name$);
              const linked = new Set(
                get(node.children$)
                  .filter(child => get(child.type$) === 'doc')
                  .map(child => get(child.data$))
              );
              result.push({
                id: node.id,
                name,
                path: path.join(' / '),
                count: ids.filter(id => linked.has(id)).length,
              });
              visit(node, [...path, name]);
            }
          };
          visit(tree.rootFolder, []);
          return result;
        }),
      [tree, ids]
    )
  );

  useEffect(() => {
    guard.revalidateCan('Workspace_Properties_Update');
  }, [guard]);
  useEffect(() => {
    if (!ids.length) setPicker(null);
  }, [ids.length]);

  const openPicker = (kind: 'tag' | 'folder', open: boolean) => {
    setPicker(open ? kind : null);
    setQuery('');
    clearMessage();
  };
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingTags = tags.filter(tag =>
    tag.name.toLocaleLowerCase().includes(normalizedQuery)
  );
  const matchingFolders = folders.filter(folder =>
    `${folder.path} ${folder.name}`
      .toLocaleLowerCase()
      .includes(normalizedQuery)
  );
  const canOfferCreate =
    canCreateTag &&
    query.trim() &&
    !tags.some(tag => tag.name.trim().toLocaleLowerCase() === normalizedQuery);
  const coverage = (count: number) =>
    count ? (
      <span className={styles.coverage}>
        {count === ids.length
          ? t['com.affine.selection.all']()
          : `${count}/${ids.length}`}
      </span>
    ) : null;
  const content = (kind: 'tag' | 'folder') => (
    <div data-selection-tray-popup>
      <div className={styles.heading}>
        {kind === 'tag'
          ? t['com.affine.selection.tag-heading']()
          : t['com.affine.selection.folder']()}
      </div>
      <div className={styles.hint}>
        {kind === 'tag'
          ? t['com.affine.selection.tag-hint']()
          : t['com.affine.selection.originals-stay']()}
      </div>
      <div className={styles.search}>
        <SearchIcon width={18} height={18} aria-hidden />
        <input
          ref={searchRef}
          className={styles.input}
          value={query}
          onChange={event => setQuery(event.target.value)}
          aria-label={
            kind === 'tag'
              ? t['com.affine.selection.search-tags']()
              : t['com.affine.selection.search-folders']()
          }
          placeholder={
            kind === 'tag'
              ? t['com.affine.selection.search-tags']()
              : t['com.affine.selection.search-folders']()
          }
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              event.currentTarget
                .closest('[data-selection-tray-popup]')
                ?.querySelector<HTMLButtonElement>('[data-choice]')
                ?.focus();
            }
          }}
        />
      </div>
      <div
        className={styles.choices}
        onKeyDown={event => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          const buttons = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
              '[data-choice]'
            ),
          ];
          const index = buttons.indexOf(event.target as HTMLButtonElement);
          if (event.key === 'ArrowUp' && index === 0)
            searchRef.current?.focus();
          else
            buttons[
              (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) %
                buttons.length
            ]?.focus();
        }}
      >
        {kind === 'tag'
          ? matchingTags.map(tag => (
              <button
                key={tag.id}
                data-choice
                type="button"
                className={styles.choice}
                disabled={busy}
                onClick={() => {
                  setPicker(null);
                  run({ type: 'tag', id: tag.id, name: tag.name }, ids);
                }}
              >
                <TagIcon
                  width={18}
                  height={18}
                  style={{ color: tag.color }}
                  aria-hidden
                />
                <span className={styles.choiceText}>{tag.name}</span>
                {coverage(selection.tagCounts.get(tag.id) ?? 0)}
              </button>
            ))
          : matchingFolders.map(folder => (
              <button
                key={folder.id}
                data-choice
                type="button"
                className={styles.choice}
                disabled={busy}
                title={[folder.path, folder.name].filter(Boolean).join(' / ')}
                onClick={() => {
                  setPicker(null);
                  run(
                    { type: 'folder', id: folder.id, name: folder.name },
                    ids
                  );
                }}
              >
                <FolderIcon width={18} height={18} aria-hidden />
                <span className={styles.choiceText}>
                  {folder.name}
                  {folder.path && (
                    <span className={styles.path}>{folder.path}</span>
                  )}
                </span>
                {coverage(folder.count)}
              </button>
            ))}
        {kind === 'tag' && canOfferCreate ? (
          <button
            type="button"
            data-choice
            className={styles.choice}
            disabled={busy}
            onClick={() => {
              setPicker(null);
              run({ type: 'tag', name: query.trim() }, ids);
            }}
          >
            <PlusIcon width={18} height={18} aria-hidden />
            <span className={styles.choiceText}>
              {t['com.affine.selection.create-tag']({ name: query.trim() })}
            </span>
          </button>
        ) : null}
        {(kind === 'tag'
          ? !matchingTags.length && !canOfferCreate
          : !matchingFolders.length) && (
          <div className={styles.empty}>
            {normalizedQuery
              ? t['com.affine.selection.no-results']()
              : kind === 'tag'
                ? canCreateTag
                  ? t['com.affine.selection.no-tags']()
                  : t['com.affine.selection.no-tags-readonly']()
                : t['com.affine.selection.no-folders']()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.anchor}>
      {message && (
        <div className={styles.message} role="status">
          {message}
        </div>
      )}
      <div
        className={styles.tray}
        role="group"
        aria-label={t['com.affine.selection.label']()}
        aria-busy={busy}
        data-testid="selection-tray"
      >
        <div
          className={styles.count}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={styles.number}>{ids.length}</span>
          {t['com.affine.selection.selected']()}
        </div>
        {!shared && (
          <div className={styles.actions}>
            {(['tag', 'folder'] as const).map(kind => (
              <Popover
                key={kind}
                open={picker === kind}
                onOpenChange={open => openPicker(kind, open)}
                content={content(kind)}
                contentOptions={{
                  side: 'top',
                  sideOffset: 12,
                  align: 'center',
                  collisionPadding: 16,
                  className: styles.popup,
                  'aria-label':
                    kind === 'tag'
                      ? t['com.affine.selection.tag-heading']()
                      : t['com.affine.selection.folder'](),
                  onOpenAutoFocus: event => {
                    event.preventDefault();
                    searchRef.current?.focus();
                  },
                  onEscapeKeyDown: event => event.stopPropagation(),
                }}
              >
                <button
                  type="button"
                  className={styles.button}
                  disabled={!ids.length || busy}
                >
                  {kind === 'tag' ? (
                    <TagIcon width={18} height={18} aria-hidden />
                  ) : (
                    <FolderIcon width={18} height={18} aria-hidden />
                  )}
                  {kind === 'tag'
                    ? t['com.affine.selection.tag']()
                    : t['com.affine.selection.folder']()}
                </button>
              </Popover>
            ))}
            <button
              type="button"
              className={styles.button}
              disabled={!ids.length || busy}
              onClick={() => {
                setPicker(null);
                run({ type: 'favorite' }, ids);
              }}
            >
              {ids.length > 0 && selection.favoriteCount === ids.length ? (
                <FavoritedIcon width={18} height={18} aria-hidden />
              ) : (
                <FavoriteIcon width={18} height={18} aria-hidden />
              )}
              {t['com.affine.selection.favorite']()}
            </button>
          </div>
        )}
        {onDelete && !shared && (
          <button
            type="button"
            className={styles.deleteButton}
            disabled={!ids.length || busy}
            onClick={onDelete}
            aria-label={t['com.affine.selection.delete']()}
            title={t['com.affine.selection.delete']()}
          >
            <DeleteIcon width={18} height={18} aria-hidden />
          </button>
        )}
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClose}
          aria-label={t['com.affine.selection.clear']()}
          title={t['com.affine.selection.clear']()}
        >
          <CloseIcon width={18} height={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
