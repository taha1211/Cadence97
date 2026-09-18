import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { keyframes, style } from '@vanilla-extract/css';
const slideDownAndFade = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.92) translateY(40px)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
});
const slideUpAndFade = keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(0.95) translateY(20px)',
  },
});
export const root = style({
  display: 'flex',
  alignItems: 'center',
  borderRadius: shape.full,
  padding: '6px 8px',
  border: `0.5px solid ${cadence.outlineVariant}`,
  boxShadow:
    '0 2px 6px rgba(0, 0, 0, 0.08), 0 16px 40px -8px rgba(0, 0, 0, 0.28)',
  gap: 4,
  minWidth: 'max-content',
  width: 'fit-content',
  background: cadence.surfaceContainer,
});
export const popoverContent = style({
  willChange: 'transform opacity',
  selectors: {
    '&[data-state="open"]': {
      // Rises from the bottom edge on the spatial spring, and leaves faster
      // than it arrived.
      animation: `${slideDownAndFade} ${motion.spatialDefault.duration} ${motion.spatialDefault.easing}`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUpAndFade} ${motion.effectsFast.duration} ${motion.effectsFast.easing}`,
    },
  },
});
export const separator = style({
  width: '1px',
  height: '24px',
  background: cssVar('dividerColor'),
});
export const item = style({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  gap: 4,
  height: '32px',
  padding: '0 6px',
});
export const button = style([
  item,
  {
    borderRadius: '8px',
    ':hover': {
      background: cssVar('hoverColor'),
    },
  },
]);
export const danger = style({
  color: 'inherit',
  ':hover': {
    background: cssVar('backgroundErrorColor'),
    color: cssVar('errorColor'),
  },
});
export const buttonIcon = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 20,
  color: cssVar('iconColor'),
  selectors: {
    [`${danger}:hover &`]: {
      color: cssVar('errorColor'),
    },
  },
});
