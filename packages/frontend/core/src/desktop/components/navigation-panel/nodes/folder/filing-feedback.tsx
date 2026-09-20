import { notify } from '@affine/component';
import { UndoableActionReceipt } from '@affine/core/components/undoable-action/receipt';
import type { FolderFilingChange } from '@affine/core/modules/organize/types';
import { useI18n } from '@affine/i18n';
import { SingleSelectCheckSolidIcon as CheckIcon } from '@blocksuite/icons/rc';
import { useCallback, useEffect, useRef, useState } from 'react';

import * as styles from './filing-feedback.css';

export function useFilingFeedback(workspaceId: string, folderName: string) {
  const t = useI18n();
  const sequence = useRef(0);
  const [acknowledgment, setAcknowledgment] = useState<{
    id: number;
    label: string;
    existing: boolean;
    fromDrag: boolean;
  } | null>(null);

  useEffect(() => {
    if (!acknowledgment) return;
    const timer = setTimeout(() => setAcknowledgment(null), 1800);
    return () => clearTimeout(timer);
  }, [acknowledgment]);

  const showFeedback = useCallback(
    (changes: FolderFilingChange[], detail: string, fromDrag = false) => {
      const kinds = new Set(changes.map(change => change.kind));
      const kind =
        changes.length === 0
          ? 'existing'
          : kinds.size > 1
            ? 'updated'
            : changes[0].kind;
      const title = t[`com.affine.filing.${kind}`]({ name: folderName });
      const id = ++sequence.current;
      setAcknowledgment({
        id,
        label: title,
        existing: changes.length === 0,
        fromDrag,
      });
      // A duplicate gets a local acknowledgment without obscuring or replacing
      // the previous action's Undo.
      if (!changes.length) return;
      // One current action receipt per workspace, so rapid filing never stacks
      // a wall of notifications. Each receipt reverses precisely its own changes.
      const receiptId = `folder-filing:${workspaceId}`;
      notify.custom(
        ({ onDismiss }) => (
          <UndoableActionReceipt
            undoneTitle={t['com.affine.filing.undone']()}
            testId="folder-filing-receipt"
            key={id}
            title={title}
            detail={detail}
            changes={changes}
            onDismiss={onDismiss}
            onUndo={() => setAcknowledgment(null)}
          />
        ),
        { id: receiptId, duration: 8000 }
      );
    },
    [folderName, t, workspaceId]
  );

  return {
    showFeedback,
    acknowledgment: acknowledgment ? (
      <span
        key={acknowledgment.id}
        className={styles.acknowledgment}
        data-existing={acknowledgment.existing}
        data-immediate={!acknowledgment.fromDrag}
        title={acknowledgment.label}
        aria-hidden={acknowledgment.existing ? undefined : true}
        role={acknowledgment.existing ? 'status' : undefined}
      >
        {acknowledgment.existing ? (
          t['com.affine.filing.already-here']()
        ) : (
          <CheckIcon width={14} height={14} />
        )}
      </span>
    ) : undefined,
  };
}
