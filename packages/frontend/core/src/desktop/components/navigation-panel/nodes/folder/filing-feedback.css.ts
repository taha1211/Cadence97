import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { keyframes, style } from '@vanilla-extract/css';

const arrive = keyframes({
  from: { opacity: 0, transform: 'translateY(2px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const appear = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const acknowledgment = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  flexShrink: 0,
  borderRadius: shape.full,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  pointerEvents: 'none',
  animation: `${arrive} ${motion.effectsFast.duration} ${motion.effectsFast.easing}`,
  selectors: {
    '&[data-immediate="true"]': { animation: 'none' },
    '&[data-existing="true"]': {
      width: 'auto',
      padding: '0 7px',
      fontSize: 11,
      whiteSpace: 'nowrap',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: `${appear} ${motion.effectsFast.duration} ${motion.effectsFast.easing}`,
    },
  },
});
