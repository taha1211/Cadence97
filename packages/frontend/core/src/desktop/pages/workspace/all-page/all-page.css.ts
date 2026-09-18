import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';
export const scrollContainer = style({
  flex: 1,
  width: '100%',
  paddingBottom: '32px',
});
export const headerCreateNewButton = style({
  transition: 'opacity 0.1s ease-in-out',
});

export const headerCreateNewCollectionIconButton = style({
  padding: '4px 8px',
  fontSize: '16px',
  width: '32px',
  height: '28px',
  borderRadius: '8px',
});
export const headerCreateNewButtonHidden = style({
  opacity: 0,
  pointerEvents: 'none',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  containerName: 'docs-body',
  containerType: 'size',
});

export const scrollArea = style({
  height: 0,
  flex: 1,
  paddingTop: '12px',
  position: 'relative',
});

// Sits in the empty lower half of a nearly empty page. A dashed outline, like
// the sidebar's empty rows, because it marks a place where something can go.
export const sparseInvitation = style({
  position: 'absolute',
  left: '50%',
  bottom: '18%',
  translate: '-50% 0',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px 10px 18px',
  borderRadius: shape.full,
  border: `1px dashed ${cadence.outlineVariant}`,
  color: cssVarV2('text/tertiary'),
  fontSize: 13,
  whiteSpace: 'nowrap',
});
export const sparseInvitationAction = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  height: 30,
  padding: '0 14px 0 10px',
  border: 'none',
  borderRadius: shape.full,
  cursor: 'pointer',
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  fontSize: 13,
  fontWeight: 500,
  transition: springTransition(motion.spatialFast, 'border-radius', 'scale'),
  selectors: {
    '&:hover': {
      borderRadius: 12,
    },
    '&:active': {
      borderRadius: 10,
      scale: '0.96',
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});

// group

export const pinnedCollection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '0 24px',
  paddingTop: '12px',
  '@container': {
    'docs-body (width <= 500px)': {
      padding: '0 20px',
    },
    'docs-body (width <= 393px)': {
      padding: '0 16px',
    },
  },
});

export const filterArea = style({
  padding: '0 24px',
  paddingTop: '12px',
  '@container': {
    'docs-body (width <= 500px)': {
      padding: '0 20px',
    },
    'docs-body (width <= 393px)': {
      padding: '0 16px',
    },
  },
});

export const filterInnerArea = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  padding: '8px',
  background: cssVarV2('layer/background/secondary'),
  borderRadius: '12px',
});

export const filters = style({
  flex: 1,
});
