import type { useDropTarget } from '@affine/component';
import { useI18n } from '@affine/i18n';
import { CopyIcon, LinkIcon, MoveToIcon } from '@blocksuite/icons/rc';
import { createPortal } from 'react-dom';

import * as styles from './drop-effect.css';

export type DropEffectValue =
  | 'copy'
  | 'move'
  | 'link'
  | {
      effect: 'copy' | 'move' | 'link';
      destination: string;
    };

export const DropEffect = ({
  dropEffect,
  position,
}: {
  dropEffect?: DropEffectValue;
  position: ReturnType<typeof useDropTarget>['draggedOverPosition'];
}) => {
  const t = useI18n();
  if (dropEffect === undefined) return null;
  const effect =
    typeof dropEffect === 'string' ? dropEffect : dropEffect.effect;
  const destination =
    typeof dropEffect === 'string' ? undefined : dropEffect.destination;
  const label = destination
    ? t[`com.affine.filing.drag.${effect}`]({ name: destination })
    : effect === 'copy'
      ? t['com.affine.rootAppSidebar.explorer.drop-effect.copy']()
      : effect === 'move'
        ? t['com.affine.rootAppSidebar.explorer.drop-effect.move']()
        : t['com.affine.rootAppSidebar.explorer.drop-effect.link']();
  return createPortal(
    <div
      className={styles.dropEffect}
      aria-hidden="true"
      style={{
        transform: `translate(${position.clientX}px, ${position.clientY}px)`,
      }}
    >
      {effect === 'copy' ? (
        <CopyIcon className={styles.icon} />
      ) : effect === 'move' ? (
        <MoveToIcon className={styles.icon} />
      ) : (
        <LinkIcon className={styles.icon} />
      )}
      <span className={styles.label}>{label}</span>
    </div>,
    document.body
  );
};
