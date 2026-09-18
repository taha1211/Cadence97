import { cadence } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';
export const menuContent = style({
  backgroundColor: cssVar('backgroundOverlayPanelColor'),
});
export const button = style({
  backgroundColor: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  borderColor: 'transparent',
  ':hover': {
    backgroundColor: cadence.primaryContainer,
    boxShadow: `inset 0 0 0 1px ${cadence.outline}`,
  },
});
