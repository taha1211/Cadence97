import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

// The path may shrink; the doc name beside it may not. When the header gets
// narrow, the folders give way first and the name is the last thing to go.
export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  minWidth: 0,
  flexShrink: 100,
  overflow: 'hidden',
  fontSize: 14,
  color: cssVarV2('text/tertiary'),
  // Truncate from the left, so the folder nearest the doc survives.
  direction: 'rtl',
});
export const crumb = style({
  direction: 'ltr',
  flexShrink: 0,
  maxWidth: 160,
  padding: '2px 6px',
  border: 'none',
  background: 'transparent',
  borderRadius: shape.small,
  color: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: springTransition(motion.effectsFast, 'background-color', 'color'),
  selectors: {
    '&:hover': {
      color: cssVarV2('text/primary'),
      background: cssVarV2('layer/background/hoverOverlay'),
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: -2,
    },
  },
});
export const separator = style({
  direction: 'ltr',
  flexShrink: 0,
  fontSize: 16,
  color: cssVarV2('icon/tertiary'),
});
