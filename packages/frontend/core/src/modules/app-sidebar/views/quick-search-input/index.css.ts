import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
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
  transition: springTransition(motion.effectsDefault, 'background-color'),
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
// A quiet keycap that teaches the faster way in.
export const shortcutHint = style({
  flexShrink: 0,
  marginLeft: 8,
  padding: '1px 6px',
  borderRadius: 6,
  border: `1px solid ${cadence.outlineVariant}`,
  color: cssVarV2('text/tertiary'),
  fontSize: 11,
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '0.04em',
});
export const quickSearchBarEllipsisStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
