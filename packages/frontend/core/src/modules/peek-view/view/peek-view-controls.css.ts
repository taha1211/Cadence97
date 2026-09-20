import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { style } from '@vanilla-extract/css';

// One dock beside the preview instead of loose buttons.
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start',
  gap: 2,
  padding: 4,
  borderRadius: shape.full,
  background: cadence.surfaceContainer,
  border: `0.5px solid ${cadence.outlineVariant}`,
  boxShadow:
    '0 2px 6px rgba(0, 0, 0, 0.08), 0 12px 32px -8px rgba(0, 0, 0, 0.28)',
  '@media': {
    'screen and (width <= 640px)': {
      flexDirection: 'row-reverse',
      width: '100%',
    },
  },
});

export const button = style({
  borderRadius: shape.full,
  width: 32,
  height: 32,
  background: 'transparent',
  transition: springTransition(motion.spatialFast, 'scale'),
  selectors: {
    '&:active': {
      scale: '0.9',
    },
  },
  '@media': {
    'screen and (width <= 640px)': {
      selectors: {
        [`[data-action-name="close"]&`]: {
          marginLeft: 'auto',
          order: 0,
        },
      },
    },
  },
});
