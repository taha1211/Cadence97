import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
import { globalStyle, style } from '@vanilla-extract/css';

// A circle at rest that relaxes toward a rounded square as the pointer
// commits: hover softens it, press finishes the morph. Accent swatches mark
// selection with the same shape change.
export const root = style({
  width: 40,
  height: 40,
  borderRadius: 20,
  boxShadow: 'none',
  borderWidth: 0,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  transition: [
    springTransition(motion.spatialFast, 'border-radius', 'scale'),
    springTransition(motion.effectsDefault, 'background-color'),
  ].join(', '),
  selectors: {
    '&:hover': {
      borderRadius: 14,
    },
    '&:active': {
      borderRadius: 10,
      scale: '0.94',
    },
  },
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
  transition: springTransition(motion.spatialFast, 'rotate'),
});
globalStyle(`${root}:hover svg:first-of-type`, {
  rotate: '90deg',
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
