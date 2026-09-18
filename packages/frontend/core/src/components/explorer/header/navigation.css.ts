import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  fontSize: 15,
  lineHeight: '24px',
  fontWeight: 600,
});

export const item = style({
  position: 'relative',
  zIndex: 1,
  padding: '4px 14px',
  borderRadius: shape.full,
  color: cssVarV2.text.secondary,
  transition: springTransition(motion.effectsFast, 'color', 'background-color'),
  selectors: {
    '&:hover': {
      color: cssVarV2.text.primary,
    },
    '&[data-active="true"]': {
      color: cadence.onPrimaryContainer,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});

// One pill shared by the three tabs. It travels inside this row only.
export const indicator = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  zIndex: 0,
  borderRadius: shape.full,
  background: cadence.primaryContainer,
  pointerEvents: 'none',
  willChange: 'translate',
  selectors: {
    '&[data-moving="true"]': {
      transition: [
        springTransition(motion.spatialFast, 'translate'),
        springTransition(motion.effectsFast, 'width'),
      ].join(', '),
    },
  },
});
