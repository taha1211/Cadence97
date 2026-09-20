import { motion } from '@affine/component/theme/tokens';
import { keyframes, style } from '@vanilla-extract/css';
export const editor = style({
  flex: 1,
  selectors: {
    '&.full-screen': {
      width: '100%',
      minWidth: 0,
      vars: {
        '--affine-editor-width': '100%',
        '--affine-editor-side-padding': '72px',
      },
    },
  },
  '@media': {
    'screen and (max-width: 800px)': {
      selectors: {
        '&.is-public': {
          vars: {
            '--affine-editor-width': '100%',
            '--affine-editor-side-padding': '24px',
          },
        },
      },
    },
  },
});

// Switching between page and edgeless used to be a hard cut. The new view now
// fades in.
//
// It starts partly visible, so a stalled animation (a background tab, a
// throttled frame) can never leave the editor hidden.
//
// Opacity only, on purpose. A scale here would shrink every bounding rect
// inside the editor while it runs, and edgeless measures its canvas from
// those rects as it mounts.
//
// The two keyframes are identical. A CSS animation restarts only when its
// name changes, so each mode gets its own name.
const settlePage = keyframes({ from: { opacity: 0.35 }, to: { opacity: 1 } });
const settleEdgeless = keyframes({
  from: { opacity: 0.35 },
  to: { opacity: 1 },
});
const settle = {
  animationDuration: motion.effectsDefault.duration,
  animationTimingFunction: motion.effectsDefault.easing,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
    print: { animation: 'none' },
  },
} as const;
export const settleInPage = style({ animationName: settlePage, ...settle });
export const settleInEdgeless = style({
  animationName: settleEdgeless,
  ...settle,
});
