import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { createVar, keyframes, style } from '@vanilla-extract/css';

const contentShow = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-8px) scale(0.96)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
});
const contentHide = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-4px) scale(0.98)',
  },
});
const scrimShow = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const scrimHide = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

// How long the panel takes to leave. It also drives unmounting from JS, and it
// is deliberately shorter than the entrance: arriving may take a moment, but
// leaving must never hold the user up.
export const animationTimeout = createVar();

// A soft scrim separates the palette from the page without hiding it.
export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: cssVarV2('layer/background/modal'),
  zIndex: cssVar('zIndexModal'),
  selectors: {
    '&[data-state=entered], &[data-state=entering]': {
      animation: `${scrimShow} ${motion.effectsDefault.duration} ${motion.effectsDefault.easing} both`,
    },
    '&[data-state=exited], &[data-state=exiting]': {
      animation: `${scrimHide} ${animationTimeout} ${motion.effectsFast.easing} both`,
    },
  },
});
export const modalContentWrapper = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: cssVar('zIndexModal'),
  // About a fifth of the way down, where the eye already rests.
  padding: '18vh 16px 16px',
  pointerEvents: 'none',
});

export const modalContent = style({
  width: 720,
  backgroundColor: cadence.surfaceContainer,
  border: `0.5px solid ${cadence.outlineVariant}`,
  boxShadow:
    '0 2px 6px rgba(0, 0, 0, 0.08), 0 24px 64px -12px rgba(0, 0, 0, 0.36)',
  borderRadius: shape.extraLarge,
  overflow: 'hidden',
  maxWidth: 'calc(100vw - 32px)',
  minWidth: 480,
  // :focus-visible will set outline
  outline: 'none',
  position: 'relative',
  pointerEvents: 'auto',
  zIndex: cssVar('zIndexModal'),
  willChange: 'transform, opacity',
  transformOrigin: '50% 0',
  selectors: {
    '&[data-state=entered], &[data-state=entering]': {
      animation: `${contentShow} ${motion.spatialFast.duration} ${motion.spatialFast.easing} both`,
    },
    '&[data-state=exited], &[data-state=exiting]': {
      animation: `${contentHide} ${animationTimeout} ${motion.effectsFast.easing} both`,
    },
  },
  '@media': {
    'screen and (max-width: 520px)': {
      minWidth: 'auto',
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none !important',
    },
  },
});
