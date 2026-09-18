import { cadence, motion } from '@affine/component/theme/tokens';
import { keyframes, style } from '@vanilla-extract/css';

const open = keyframes({
  from: { height: 0, opacity: 0, overflow: 'clip' },
  to: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
    overflow: 'clip',
  },
});
const close = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
    overflow: 'clip',
  },
  to: { height: 0, opacity: 0, overflow: 'clip' },
});

export const root = style({});
// The keyframes clip overflow only while the height animates, so focus rings
// are never cut off at rest. Opening lands on a gentle spatial spring. Closing uses an effects curve,
// because a section that overshoots on its way out looks like a stutter.
export const content = style({
  paddingTop: 6,
  selectors: {
    '&[data-state="open"]': {
      animation: `${open} ${motion.spatialSlow.duration} ${motion.spatialSlow.easing}`,
    },
    '&[data-state="closed"]': {
      animation: `${close} ${motion.effectsDefault.duration} ${motion.effectsDefault.easing}`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none !important',
    },
  },
});

export const header = style({
  selectors: {
    '&[data-dragged-over="true"]': {
      background: cadence.primaryContainer,
    },
  },
});
