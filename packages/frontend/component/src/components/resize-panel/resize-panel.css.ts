import { createVar, style } from '@vanilla-extract/css';

import { springTransition } from '../../theme/motion';
import { cadence, motion } from '../../theme/tokens.css';
export const panelWidthVar = createVar('panel-width');
export const resizeHandleOffsetVar = createVar('resize-handle-offset');
export const resizeHandleVerticalPadding = createVar(
  'resize-handle-vertical-padding'
);
export const animationTimeout = createVar();

export const root = style({
  vars: {
    [panelWidthVar]: '256px',
    [resizeHandleOffsetVar]: '0',
  },
  position: 'relative',
  width: panelWidthVar,
  minWidth: panelWidthVar,
  height: '100%',
  zIndex: 4,
  transform: 'translateX(0)',
  maxWidth: '50%',
  selectors: {
    '&[data-open="false"][data-handle-position="right"],&[data-is-floating="true"][data-handle-position="right"]':
      {
        marginLeft: `calc(${panelWidthVar} * -1)`,
      },
    '&[data-open="false"][data-handle-position="left"],&[data-is-floating="true"][data-handle-position="left"]':
      {
        marginRight: `calc(${panelWidthVar} * -1)`,
      },
    '&[data-open="true"][data-handle-position="right"][data-is-floating="true"]':
      {
        transform: `translateX(calc(${panelWidthVar} + 4px))`,
      },
    '&[data-open="true"][data-handle-position="left"][data-is-floating="true"]':
      {
        transform: `translateX(calc(${panelWidthVar} * -1))`,
      },
    '&[data-enable-animation="true"]': {
      // The panel slides on a spatial spring, so it settles with a small
      // overshoot. The duration stays in JS because it also drives unmounting.
      transition: ['margin-left', 'margin-right', 'transform']
        .map(
          property =>
            `${property} ${animationTimeout} ${motion.spatialDefault.easing}`
        )
        .concat(`background ${animationTimeout}`)
        .join(', '),
      '@media': {
        '(prefers-reduced-motion: reduce)': { transition: 'none' },
      },
    },
    '&[data-transition-state="exited"]': {
      // avoid focus on hidden panel
      visibility: 'hidden',
    },
  },
});

export const content = style({
  contain: 'strict',
  width: '100%',
  height: '100%',
});

export const panelContent = style({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
});
export const resizeHandleContainer = style({
  position: 'absolute',
  right: resizeHandleOffsetVar,
  top: resizeHandleVerticalPadding,
  bottom: resizeHandleVerticalPadding,
  width: 8,
  zIndex: '1',
  transform: 'translateX(50%)',
  backgroundColor: 'transparent',
  opacity: 0,
  display: 'flex',
  justifyContent: 'center',
  cursor: 'col-resize',
  '@media': {
    '(max-width: 600px)': {
      // do not allow resizing on small screen
      display: 'none',
    },
  },
  transition: 'opacity 0.15s ease 0.1s',
  selectors: {
    '&[data-resizing="true"], &:hover': {
      opacity: 1,
    },
    '&[data-open="false"]': {
      display: 'none',
    },
    '&[data-open="open"]': {
      display: 'block',
    },
    '&[data-handle-position="left"]': {
      left: resizeHandleOffsetVar,
      right: 'auto',
      transform: 'translateX(-50%)',
    },
  },
});
// A short grabber pill instead of a full-height line. It thickens and takes
// the accent while the user drags it.
export const resizerInner = style({
  position: 'absolute',
  top: '50%',
  height: 48,
  width: 4,
  borderRadius: 4,
  backgroundColor: cadence.outline,
  translate: '0.5px -50%',
  transition: [
    springTransition(motion.spatialFast, 'height', 'width'),
    springTransition(motion.effectsFast, 'background-color'),
  ].join(', '),
  selectors: {
    [`${resizeHandleContainer}[data-resizing="true"] &`]: {
      height: 72,
      width: 6,
      backgroundColor: cadence.primary,
    },
  },
});
