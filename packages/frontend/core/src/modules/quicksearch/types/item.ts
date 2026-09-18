import type { I18nString } from '@affine/i18n';

import type { QuickSearchGroup } from './group';

export type QuickSearchItem<S = any, P = any> = {
  id: string;
  source: S;
  label:
    | I18nString
    | {
        title: I18nString;
        subTitle?: I18nString;
      };
  score?: number;
  icon?: React.ReactNode | React.ComponentType;
  group?: QuickSearchGroup;
  disabled?: boolean;
  keyBinding?: string;
  timestamp?: number;
  /** Where the result lives, such as a folder path. Shown under the title. */
  location?: string;
  payload?: P;
  beforeSubmit?: () => boolean;
  /**
   * Runs while the item is highlighted. Returns a function that undoes the
   * preview when the highlight moves on or the palette closes.
   */
  preview?: () => () => void;
} & (P extends NonNullable<unknown> ? { payload: P } : unknown);
