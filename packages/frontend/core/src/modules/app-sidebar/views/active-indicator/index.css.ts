import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
import { style } from '@vanilla-extract/css';

export const indicator = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
  pointerEvents: 'none',
  opacity: 0,
  background: cadence.frameSelected,
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.1)',
  willChange: 'transform',
  transition: springTransition(motion.effectsDefault, 'opacity'),
  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
    },
    // Only the travel between two items springs. Size and shape follow on an
    // effects curve, because an overshooting height reads as a glitch.
    '&[data-moving="true"]': {
      transition: [
        springTransition(motion.spatialDefault, 'transform'),
        springTransition(
          motion.effectsDefault,
          'width',
          'height',
          'border-radius',
          'opacity'
        ),
      ].join(', '),
    },
  },
});
