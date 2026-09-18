import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // The same chip as the quick search filters, so a filter looks the same
  // wherever it appears.
  padding: '0 12px',
  minWidth: '46px',
  height: 28,
  lineHeight: '26px',
  fontSize: cssVar('fontXs'),
  fontWeight: 500,
  color: cssVarV2('text/secondary'),
  border: `1px solid ${cadence.outlineVariant}`,
  borderRadius: shape.full,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  userSelect: 'none',
  transition: springTransition(
    motion.effectsFast,
    'background-color',
    'border-color',
    'color'
  ),
  ':hover': {
    color: cssVarV2('text/primary'),
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
  },
  selectors: {
    '&[data-active="true"]': {
      color: cadence.onPrimaryContainer,
      borderColor: 'transparent',
      backgroundColor: cadence.primaryContainer,
    },
  },
});

export const itemContent = style({
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  maxWidth: '128px',
  minWidth: '32px',
});

export const editIconButton = style({});

export const closeButton = style({});

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 6,
  alignItems: 'center',
});
