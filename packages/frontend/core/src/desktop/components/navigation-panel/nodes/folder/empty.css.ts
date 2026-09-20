import { cadence, shape } from '@affine/component/theme/tokens';
import { style } from '@vanilla-extract/css';

export const draggedOverHighlight = style({
  selectors: {
    '&[data-dragged-over="true"]': {
      background: cadence.primaryContainer,
      color: cadence.onPrimaryContainer,
      borderRadius: shape.small,
    },
  },
});
