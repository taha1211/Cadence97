import { useI18n } from '@affine/i18n';
import {
  CloseIcon,
  SingleSelectCheckSolidIcon as CheckIcon,
  UndoIcon,
} from '@blocksuite/icons/rc';
import { useRef, useState } from 'react';

import * as styles from './receipt.css';

export interface UndoableChange {
  undo: () => boolean | Promise<boolean>;
}

export function UndoableActionReceipt({
  title,
  detail,
  changes,
  onDismiss,
  onUndo,
  undoneTitle,
  testId,
}: {
  title: string;
  detail: string;
  changes: UndoableChange[];
  onDismiss?: () => void;
  onUndo?: () => void;
  undoneTitle: string;
  testId?: string;
}) {
  const t = useI18n();
  const [outcome, setOutcome] = useState<'undone' | 'changed' | null>(null);
  const undoing = useRef(false);
  const [pending, setPending] = useState(false);
  const handleUndo = async () => {
    if (undoing.current) return;
    undoing.current = true;
    setPending(true);
    let restored = 0;
    for (const change of [...changes].reverse()) {
      try {
        if (await change.undo()) restored++;
      } catch (error) {
        console.error('Could not undo action', error);
      }
    }
    setOutcome(restored === changes.length ? 'undone' : 'changed');
    setPending(false);
    onUndo?.();
  };

  return (
    <div className={styles.receipt} data-testid={testId}>
      <div className={styles.receiptIcon} aria-hidden="true">
        {outcome ? (
          <UndoIcon width={18} height={18} />
        ) : (
          <CheckIcon width={18} height={18} />
        )}
      </div>
      <div
        className={styles.text}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.title}>
          {outcome === 'undone'
            ? undoneTitle
            : outcome === 'changed'
              ? t['com.affine.filing.undo-changed']()
              : title}
        </div>
        <div className={styles.detail} title={detail}>
          {outcome === 'changed'
            ? t['com.affine.filing.undo-changed-detail']()
            : detail}
        </div>
      </div>
      {!outcome && changes.length > 0 && (
        <button
          className={styles.undo}
          onClick={() => {
            handleUndo().catch(console.error);
          }}
          type="button"
          disabled={pending}
        >
          {t.Undo()}
        </button>
      )}
      <button
        className={styles.dismiss}
        onClick={onDismiss}
        disabled={pending}
        type="button"
        aria-label={t['com.affine.selection.dismiss-receipt']()}
      >
        <CloseIcon width={16} height={16} />
      </button>
    </div>
  );
}
