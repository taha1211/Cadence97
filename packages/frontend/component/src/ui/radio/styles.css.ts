import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { createVar, globalStyle, style } from '@vanilla-extract/css';

import { springTransition } from '../../theme/motion';
import { cadence, motion } from '../../theme/tokens.css';

export const outerPadding = createVar('radio-outer-padding');
export const outerRadius = createVar('radio-outer-radius');
export const itemGap = createVar('radio-item-gap');
export const itemHeight = createVar('radio-item-height');

export const radioButton = style({
  flex: 1,
  position: 'relative',
  borderRadius: `calc(${outerRadius} - ${outerPadding})`,
  height: itemHeight,
  padding: '4px 8px',
  fontSize: cssVar('fontXs'),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: cssVarV2('switch/fontColor/tertiary'),
  whiteSpace: 'nowrap',
  userSelect: 'none',
  fontWeight: 600,
  transition: springTransition(motion.effectsFast, 'color', 'background'),
  selectors: {
    '&[data-state="checked"]': {
      color: cadence.onPrimaryContainer,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
    '&[data-state="unchecked"]:hover:not([disabled])': {
      background: cssVarV2('switch/buttonBackground/hover'),
    },
    '[data-icon-mode=true] &': {
      color: cssVarV2('switch/iconColor/default'),
    },
    '[data-icon-mode=true] &[data-state="checked"]': {
      color: cadence.onPrimaryContainer,
    },
  },
});
export const radioButtonContent = style({
  zIndex: 1,
  display: 'block',
});
globalStyle(`${radioButtonContent} > svg`, { display: 'block' });
export const radioButtonGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  background: cadence.surfaceContainerHigh,

  borderRadius: outerRadius,
  padding: outerPadding,
  gap: itemGap,

  // @ts-expect-error - fix electron drag
  WebkitAppRegion: 'no-drag',
});
export const indicator = style({
  position: 'absolute',
  borderRadius: 'inherit',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  background: cadence.primaryContainer,
  opacity: 0,
  transformOrigin: 'left',
  selectors: {
    '[data-state="checked"] > &': {
      opacity: 1,
    },
  },
});
