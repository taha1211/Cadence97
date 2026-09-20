import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const iconPop = keyframes({
  from: { scale: '0.5', rotate: '-12deg' },
  to: { scale: '1', rotate: '0deg' },
});

export const docIconPickerTrigger = style({
  width: 64,
  height: 64,
  padding: 2,
  borderRadius: shape.large,
  selectors: {
    // A freshly chosen icon lands with a small bounce. The trigger only mounts
    // in this state when an icon was just picked or the doc just opened, and
    // both are moments the user caused.
    '&[data-icon-type]': {
      animation: `${iconPop} ${motion.spatialFast.duration} ${motion.spatialFast.easing}`,
    },
    '&[data-icon-type="emoji"], &[data-icon-type="affine-icon"]': {
      fontSize: 60,
      lineHeight: 1,
    },
    '&[data-icon-type="emoji"]': {
      fontFamily:
        '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    },
    '&::after': {
      display: 'none',
    },
  },
});

// An invitation in the style of the sidebar's empty rows: dashed, quiet, and
// clearly a place where something can go.
export const placeholder = style({
  padding: '2px 10px 2px 6px',
  borderRadius: shape.full,
  border: `1px dashed ${cadence.outlineVariant}`,
  transition: springTransition(
    motion.effectsFast,
    'background-color',
    'border-color'
  ),
  selectors: {
    '&:hover': {
      borderColor: cadence.outline,
    },
  },
});
export const placeholderContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});
export const placeholderContentIcon = style({
  color: cssVarV2.icon.secondary,
  fontSize: 16,
});
export const placeholderContentText = style({
  color: cssVarV2.text.secondary,
  fontSize: 12,
});

globalStyle('.doc-icon-container[data-has-icon="false"]', {
  '@media': {
    print: {
      display: 'none',
    },
  },
});
