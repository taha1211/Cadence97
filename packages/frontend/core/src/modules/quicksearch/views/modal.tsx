import { useI18n } from '@affine/i18n';
import * as Dialog from '@radix-ui/react-dialog';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useEffect } from 'react';
import { useTransition } from 'react-transition-state';

import { visuallyHidden } from './cmdk.css';
import * as styles from './modal.css';

// a QuickSearch modal that can be used to display a QuickSearch command
// it has a smooth animation and can be closed by clicking outside of the modal

export interface QuickSearchModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const animationTimeout = 120;

export const QuickSearchModal = ({
  onOpenChange,
  open,
  children,
}: React.PropsWithChildren<QuickSearchModalProps>) => {
  const t = useI18n();
  const [{ status }, toggle] = useTransition({
    timeout: animationTimeout,
  });
  useEffect(() => {
    toggle(open);
  }, [open]);
  return (
    <Dialog.Root modal open={status !== 'exited'} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.modalOverlay}
          data-state={status}
          style={assignInlineVars({
            [styles.animationTimeout]: `${animationTimeout}ms`,
          })}
        />
        <div className={styles.modalContentWrapper}>
          <Dialog.Content
            style={assignInlineVars({
              [styles.animationTimeout]: `${animationTimeout}ms`,
            })}
            className={styles.modalContent}
            data-state={status}
            aria-describedby={undefined}
          >
            <Dialog.Title className={visuallyHidden}>
              {t['Quick search']()}
            </Dialog.Title>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
