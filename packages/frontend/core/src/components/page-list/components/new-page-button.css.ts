import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';
export const menuContent = style({
  backgroundColor: cssVar('backgroundOverlayPanelColor'),
});
export const button = style({
  backgroundColor: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  borderColor: 'transparent',
  // A pill at rest that relaxes toward a rounded rectangle as the pointer
  // commits, like the sidebar's new-doc button.
  borderRadius: 999,
  transition: [
    springTransition(motion.spatialFast, 'border-radius', 'scale'),
    springTransition(motion.effectsDefault, 'background-color'),
  ].join(', '),
  ':hover': {
    backgroundColor: cadence.primaryContainer,
    borderRadius: 14,
  },
  ':active': {
    borderRadius: 10,
    scale: '0.96',
  },
});
