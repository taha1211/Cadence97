import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

import { container } from './bi-directional-link-panel.css';

export const root = style([
  container,
  {
    paddingBottom: 6,
    display: 'flex',
    gap: 8,
    alignItems: 'center',

    fontSize: 12,
    fontWeight: 400,
    lineHeight: '20px',
    color: cssVarV2.text.primary,
  },
]);

export const badges = style({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
});

export const badge = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  // The chip the rest of the app uses for filters and quick choices.
  height: 28,
  padding: '0 12px 0 8px',
  borderRadius: shape.full,
  border: `1px solid ${cadence.outlineVariant}`,
  backgroundColor: 'transparent',
  transition: springTransition(motion.spatialFast, 'scale'),
  cursor: 'pointer',
  userSelect: 'none',
  position: 'relative',

  ':before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: cssVarV2.layer.background.hoverOverlay,
    borderRadius: 'inherit',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },

  selectors: {
    '&:active': {
      scale: '0.96',
    },
    '&:hover:before': {
      opacity: 1,
    },
    '&[data-active="true"]:before': {
      opacity: 1,
    },
  },
});

export const badgeIcon = style({
  fontSize: 18,
  lineHeight: 0,
  color: cadence.primary,
});

export const aiIcon = style({
  color: cssVarV2.icon.activated,
});

export const badgeText = style({
  fontSize: 15,
  lineHeight: '24px',
  whiteSpace: 'nowrap',
});
