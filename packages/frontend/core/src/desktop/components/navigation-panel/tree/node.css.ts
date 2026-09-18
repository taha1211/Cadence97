import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { createVar, keyframes, style } from '@vanilla-extract/css';
export const levelIndent = createVar();
export const linkItemRoot = style({
  color: 'inherit',
});
export const itemRoot = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: shape.small,
  textAlign: 'left',
  color: 'inherit',
  width: '100%',
  minHeight: '32px',
  userSelect: 'none',
  cursor: 'pointer',
  padding: '0 6px',
  fontSize: cssVar('fontSm'),
  position: 'relative',
  marginTop: '0px',
  transition: springTransition(motion.effectsFast, 'background-color'),
  selectors: {
    '&:hover': {
      background: cssVarV2.layer.background.hoverOverlay,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: -2,
    },
    '&[data-active="true"]': {
      background: cssVar('hoverColor'),
      color: cadence.onPrimaryContainer,
      fontWeight: 500,
    },
    // The shared sliding pill paints the selection instead.
    '[data-active-indicator="true"] &[data-active="true"]': {
      background: 'transparent',
    },
    '&[data-disabled="true"]': {
      cursor: 'default',
      color: cssVar('textSecondaryColor'),
      pointerEvents: 'none',
    },
    '&[data-dragging="true"]': {
      opacity: 0.5,
    },
  },
});
export const itemMain = style({
  display: 'flex',
  alignItems: 'center',
  width: 0,
  flex: 1,
  position: 'relative',
  gap: 12,
});
export const toggleIcon = style({
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
});
export const itemRenameAnchor = style({
  pointerEvents: 'none',
  position: 'absolute',
  left: 0,
  top: -10,
  width: 10,
  height: 10,
});
export const itemContent = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  alignItems: 'center',
  flex: 1,
  color: cssVarV2('text/primary'),
  lineHeight: cssVar('lineHeight'),
});
export const postfix = style({
  display: 'flex',
  alignItems: 'center',
  right: 0,
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  selectors: {
    [`${itemRoot}:hover &`]: {
      opacity: 1,
      pointerEvents: 'initial',
      position: 'initial',
    },
  },
});
export const iconContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 20,
  height: 20,
  color: cssVarV2('icon/primary'),
  fontSize: 20,
  position: 'absolute',
  selectors: {
    [`${itemRoot}[data-collapsible="true"]:hover &`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
    [`${itemRoot}[data-active="true"] &`]: {
      color: cadence.onPrimaryContainer,
    },
  },
});
export const collapsedIconContainer = style({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  transition: springTransition(motion.spatialFast, 'transform'),
  color: cssVarV2('icon/primary'),
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  selectors: {
    '&[data-collapsed="true"]': {
      transform: 'rotate(-90deg)',
    },
    '&[data-disabled="true"]': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
    '&:hover': {
      background: cssVar('hoverColor'),
    },
    [`${itemRoot}[data-collapsible="true"]:hover &`]: {
      opacity: 1,
      pointerEvents: 'initial',
    },
  },
});
export const collapsedIcon = style({
  transition: 'transform 0.2s ease-in-out',
  fontSize: 16,
  selectors: {
    '&[data-collapsed="true"]': {
      transform: 'rotate(-90deg)',
    },
  },
});

export const collapseContentPlaceholder = style({
  display: 'none',
  selectors: {
    '&:only-child': {
      display: 'initial',
    },
  },
});

const draggedOverAnimation = keyframes({
  '0%': {
    opacity: 1,
  },
  '60%': {
    opacity: 1,
  },
  '70%': {
    opacity: 0,
  },
  '80%': {
    opacity: 1,
  },
  '90%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const contentContainer = style({
  marginTop: 2,
  paddingLeft: levelIndent,
  position: 'relative',
});

export const draggingContainer = style({
  background: cssVar('--affine-background-primary-color'),
  width: '200px',
  borderRadius: '6px',
});

export const draggedOverEffect = style({
  position: 'relative',
  selectors: {
    '&[data-tree-instruction="make-child"][data-self-dragged-over="false"]:after':
      {
        display: 'block',
        content: '""',
        position: 'absolute',
        zIndex: 1,
        background: cadence.primaryContainer,
        opacity: 0.6,
        borderRadius: shape.small,
        left: levelIndent,
        top: 0,
        width: `calc(100% - ${levelIndent})`,
        height: '100%',
      },
    '&[data-tree-instruction="make-child"][data-self-dragged-over="false"][data-open="false"]:after':
      {
        animation: `${draggedOverAnimation} 1s infinite linear`,
      },
  },
});

const expandChildren = keyframes({
  from: { height: 0, opacity: 0, overflow: 'clip' },
  to: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
    overflow: 'clip',
  },
});
const collapseChildren = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
    overflow: 'clip',
  },
  to: { height: 0, opacity: 0, overflow: 'clip' },
});
// Matches the section collapse: a spatial spring on the way in, an effects
// curve on the way out. The keyframes clip overflow only while animating.
export const collapseContent = style({
  position: 'relative',
  selectors: {
    // Indent guide: a hairline under the parent's icon, so nesting depth
    // reads at a glance in a deep tree. `levelIndent` here is still the
    // parent's, because each child sets its own on its own root.
    '&::before': {
      content: '""',
      position: 'absolute',
      left: `calc(${levelIndent} + 16px)`,
      top: 2,
      bottom: 2,
      width: 1,
      background: cadence.outlineVariant,
      pointerEvents: 'none',
    },
    '&[data-state="open"]': {
      animation: `${expandChildren} ${motion.spatialSlow.duration} ${motion.spatialSlow.easing}`,
    },
    '&[data-state="closed"]': {
      animation: `${collapseChildren} ${motion.effectsDefault.duration} ${motion.effectsDefault.easing}`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none !important',
    },
  },
});
