import { createVar, fallbackVar, style } from '@vanilla-extract/css';

import { springTransition } from '../../theme/motion';
import { cadence, motion } from '../../theme/tokens.css';
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
});
export const disabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
});
export const input = style({
  opacity: 0,
  position: 'absolute',
  width: '1em',
  height: '1em',
  inset: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: 'inherit',
});

/**
 * The corner radius of an unchecked box. It defaults to a rounded square, so
 * a checkbox in a form still reads as a checkbox. A caller that marks
 * selection, like the doc list, can set it to `50%` for a circle that relaxes
 * into a rounded square when chosen, as the accent swatches do.
 */
export const restRadius = createVar('checkbox-rest-radius');

export const box = style({
  width: '1em',
  height: '1em',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
export const mark = style({
  width: '0.75em',
  height: '0.75em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid currentColor',
  borderRadius: fallbackVar(restRadius, '28%'),
  color: 'inherit',
  transition: [
    springTransition(motion.spatialFast, 'border-radius', 'scale'),
    springTransition(motion.effectsFast, 'background-color', 'border-color'),
  ].join(', '),
  selectors: {
    [`${root}:active &`]: {
      scale: '0.88',
    },
    '&[data-state="checked"], &[data-state="indeterminate"]': {
      borderRadius: '28%',
      borderColor: cadence.primary,
      backgroundColor: cadence.primary,
    },
  },
});
export const glyph = style({
  width: '100%',
  height: '100%',
  color: cadence.onPrimary,
  scale: '0',
  transition: springTransition(motion.spatialFast, 'scale'),
  selectors: {
    [`${mark}[data-state="checked"] &, ${mark}[data-state="indeterminate"] &`]:
      {
        scale: '1',
      },
  },
});
