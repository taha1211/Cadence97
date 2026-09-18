import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
import { keyframes, style } from '@vanilla-extract/css';

// "It's me now": the pill swells into place on the new item. `scale` is its
// own property and applies after `translate`, which positions the pill, so the
// pill grows around its own center.
const pop = keyframes({
  from: { scale: '0.55', opacity: 0 },
  '40%': { opacity: 1 },
  to: { scale: '1', opacity: 1 },
});

export const indicator = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
  pointerEvents: 'none',
  opacity: 0,
  background: cadence.frameSelected,
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.1)',
  willChange: 'translate',
  transition: springTransition(motion.effectsDefault, 'opacity'),
  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
    },
    '&[data-pop="true"]': {
      animation: `${pop} ${motion.spatialFast.duration} ${motion.spatialFast.easing}`,
    },
    // Only the travel between two items springs. Size and shape follow on an
    // effects curve, because an overshooting height reads as a glitch.
    '&[data-moving="true"]': {
      transition: [
        springTransition(motion.spatialDefault, 'translate'),
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
