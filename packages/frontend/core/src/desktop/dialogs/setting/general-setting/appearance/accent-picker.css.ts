import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
import { createVar, style } from '@vanilla-extract/css';

export const swatchColor = createVar();

export const group = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: 8,
});

// A circle at rest. The chosen swatch relaxes into a rounded square, which is
// the Material 3 Expressive way of marking selection with shape.
export const swatch = style({
  width: 32,
  height: 32,
  padding: 0,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  background: swatchColor,
  borderRadius: 16,
  transition: [
    springTransition(motion.spatialFast, 'border-radius', 'scale'),
    springTransition(motion.effectsDefault, 'outline-color'),
  ].join(', '),
  selectors: {
    '&:hover': {
      scale: '1.08',
    },
    '&:active': {
      scale: '0.92',
    },
    '&[aria-checked="true"]': {
      borderRadius: 10,
      outline: `2px solid ${swatchColor}`,
      outlineOffset: 2,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 4,
    },
  },
});

export const check = style({
  fontSize: 18,
  scale: '0',
  transition: springTransition(motion.spatialFast, 'scale'),
  selectors: {
    [`${swatch}[aria-checked="true"] &`]: {
      scale: '1',
    },
  },
});
