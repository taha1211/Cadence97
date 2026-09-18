import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';

import * as styles from './index.css';

export interface ShapeLoaderProps {
  /** Edge length in pixels. */
  size?: number;
  className?: string;
}

/**
 * A loading indicator that morphs between the expressive shapes. It moves by
 * itself, which the frame otherwise never does, because it only exists while
 * the app is answering something the user asked for.
 */
export const ShapeLoader = ({ size = 40, className }: ShapeLoaderProps) => {
  return (
    <div
      role="progressbar"
      aria-busy="true"
      className={clsx(styles.shapeLoader, className)}
      style={assignInlineVars({ [styles.sizeVar]: `${size}px` })}
    />
  );
};
