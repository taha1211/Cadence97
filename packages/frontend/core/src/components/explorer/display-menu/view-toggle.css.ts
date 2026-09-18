import { cadence } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

// A proper segmented control: a tinted track, and a pill that slides to the
// chosen view.
export const viewToggle = style({
  backgroundColor: cadence.surfaceContainerHigh,
});
export const viewToggleItem = style({
  padding: 0,
  fontSize: 16,
  width: 32,
  color: cssVarV2.icon.primary,
  selectors: {
    '&[data-state=checked]': {
      color: cadence.onPrimaryContainer,
    },
  },
});
export const viewToggleIndicator = style({
  backgroundColor: cadence.primaryContainer,
  boxShadow: 'none',
});
