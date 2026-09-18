import { cadence, motion } from '@affine/component/theme/tokens';
import { keyframes, style } from '@vanilla-extract/css';

const pop = keyframes({
  from: { scale: '0.4', rotate: '-24deg' },
  to: { scale: '1', rotate: '0deg' },
});

export const favorited = style({
  color: cadence.primary,
});

// Favoriting is a moment worth marking. The star lands on the spatial spring,
// which overshoots a little, so it reads as a bounce.
export const justFavorited = style({
  animation: `${pop} ${motion.spatialFast.duration} ${motion.spatialFast.easing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
