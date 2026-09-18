import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

// Utilities live here, pinned to the bottom edge, so the list above holds
// only places and the user's own things.
export const dock = style({
  display: 'flex',
  alignItems: 'center',
  // Spread edge to edge, so the row is anchored to both sides of the sidebar
  // like the search row at the top.
  justifyContent: 'space-between',
  padding: '2px',
});

export const dockItem = style({
  position: 'relative',
  width: 36,
  height: 36,
  padding: 0,
  border: 'none',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 20,
  color: cssVarV2('icon/primary'),
  background: 'transparent',
  borderRadius: shape.medium,
  transition: [
    springTransition(motion.effectsFast, 'background-color', 'color'),
    springTransition(motion.spatialFast, 'scale'),
  ].join(', '),
  selectors: {
    '&:hover': {
      background: cssVarV2.layer.background.hoverOverlay,
    },
    '&:active': {
      scale: '0.92',
    },
    '&[data-active="true"]': {
      background: cadence.frameSelected,
      color: cadence.onPrimaryContainer,
    },
    // The shared sliding pill paints the selection instead.
    '[data-active-indicator="true"] &[data-active="true"]': {
      background: 'transparent',
    },
    '&[data-dragged-over="true"]': {
      background: cadence.primaryContainer,
      color: cadence.onPrimaryContainer,
      scale: '1.12',
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});
