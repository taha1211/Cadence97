import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

// A dashed row at item height. The dashes say "something can land here",
// which is true: every empty section is also a drop target.
export const content = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 32,
  padding: '0 8px',
  borderRadius: shape.small,
  border: `1px dashed ${cadence.outlineVariant}`,
  color: cssVarV2('text/tertiary'),
  transition: springTransition(
    motion.effectsFast,
    'background-color',
    'border-color',
    'color'
  ),
  selectors: {
    '&[data-actionable="true"]': {
      cursor: 'pointer',
    },
    '&[data-actionable="true"]:hover': {
      backgroundColor: cssVarV2('layer/background/hoverOverlay'),
      color: cssVarV2('text/primary'),
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
    '&[data-dragged-over="true"]': {
      backgroundColor: cadence.primaryContainer,
      borderColor: cadence.primary,
      borderStyle: 'solid',
      color: cadence.onPrimaryContainer,
    },
  },
});
export const icon = style({
  flexShrink: 0,
  fontSize: 16,
  color: 'currentColor',
});
export const message = style({
  fontSize: cssVar('fontSm'),
  color: 'currentColor',
  userSelect: 'none',
  fontWeight: 400,
  lineHeight: '22px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
