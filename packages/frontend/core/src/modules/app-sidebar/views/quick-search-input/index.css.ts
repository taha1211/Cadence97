import { cadence } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '20px',
  border: 'none',
  color: cssVarV2('text/primary'),
  background: cadence.surfaceContainerHigh,
  textAlign: 'left',
  fontSize: cssVar('fontSm'),
  width: '100%',
  height: '40px',
  userSelect: 'none',
  cursor: 'pointer',
  padding: '0 12px',
  position: 'relative',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  ':hover': {
    background: cadence.primaryContainer,
  },
  ':focus-visible': {
    outline: `2px solid ${cadence.primary}`,
    outlineOffset: 2,
  },
  transition: 'background-color 160ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
export const icon = style({
  marginRight: '8px',
  flexShrink: 0,
  color: cssVarV2('icon/primary'),
  fontSize: '20px',
});
export const spacer = style({
  flex: 1,
});
export const shortcutHint = style({
  color: cssVarV2('text/tertiary'),
  fontSize: cssVar('fontBase'),
});
export const quickSearchBarEllipsisStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
