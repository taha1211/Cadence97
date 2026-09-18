import { cadence } from '@affine/component/theme/tokens';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  width: 40,
  height: 40,
  borderRadius: 14,
  boxShadow: 'none',
  borderWidth: 0,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
});

export const withAskRoot = style([
  root,
  {
    width: 'auto',
    padding: 7,
  },
]);

globalStyle(`${root} svg`, {
  color: cadence.onPrimaryContainer,
});

export const withAskContent = style({
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  color: cadence.onPrimaryContainer,
});

export const templateMenu = style({
  width: 280,
});
