import { springTransition } from '@affine/component/theme/motion';
import {
  cadence,
  expressiveShape,
  motion,
  shape,
} from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
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

export const receipt = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  padding: '12px 12px 12px 14px',
  borderRadius: shape.extraLarge,
  background: cadence.surfaceContainerHigh,
  color: cssVarV2('text/primary'),
  border: `1px solid ${cadence.outlineVariant}`,
  boxShadow: '0 3px 8px rgba(0,0,0,0.08), 0 16px 40px -8px rgba(0,0,0,0.24)',
});

export const receiptIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  flexShrink: 0,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  clipPath: expressiveShape.scallop,
});

export const text = style({ flex: 1, minWidth: 0 });
export const title = style({
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '18px',
  overflowWrap: 'anywhere',
});
export const detail = style({
  fontSize: 12,
  lineHeight: '17px',
  color: cssVarV2('text/secondary'),
  marginTop: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const undo = style({
  border: 0,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  borderRadius: shape.full,
  padding: '7px 11px',
  font: 'inherit',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  flexShrink: 0,
  transition: springTransition(motion.effectsFast, 'opacity'),
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
    '&:active': { opacity: 0.7 },
  },
});

export const dismiss = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  background: 'transparent',
  color: cssVarV2('icon/secondary'),
  borderRadius: shape.full,
  width: 24,
  height: 28,
  padding: 0,
  flexShrink: 0,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});
