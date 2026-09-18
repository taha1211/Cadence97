import { useI18n } from '@affine/i18n';
import { SearchIcon } from '@blocksuite/icons/rc';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

import * as styles from './index.css';

interface QuickSearchInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

// Although it is called an input, it is actually a button.
export function QuickSearchInput({ onClick, ...props }: QuickSearchInputProps) {
  const t = useI18n();

  return (
    <button
      {...props}
      type="button"
      className={clsx([props.className, styles.root])}
      onClick={onClick}
    >
      <SearchIcon className={styles.icon} aria-hidden="true" />
      <span className={styles.quickSearchBarEllipsisStyle}>
        {t['Quick search']()}
      </span>
    </button>
  );
}
