import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  height: '100%',
  width: '100%',
});

export const header = style({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  gap: 12,
  containerName: 'detail-page-header',
  containerType: 'inline-size',
});
export const spacer = style({
  flexGrow: 1,
  minWidth: 12,
});
export const journalWeekPicker = style({
  minWidth: 100,
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Star, info and more belong together, so they share one quiet pill.
export const iconButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  gap: 2,
  padding: 2,
  borderRadius: shape.full,
  border: `1px solid ${cadence.outlineVariant}`,
});

// At the top of a doc its name is already on screen as the heading, so the
// header copy stays folded away. It unfolds once the heading scrolls out of
// view, and whenever it is being edited. A grid track animates between 0fr
// and 1fr, which folds the width without measuring it.
export const titleReveal = style({
  display: 'grid',
  gridTemplateColumns: '0fr',
  minWidth: 0,
  opacity: 0,
  transition: [
    springTransition(motion.effectsDefault, 'grid-template-columns'),
    springTransition(motion.effectsDefault, 'opacity'),
  ].join(', '),
  selectors: {
    [`${root}[data-show-title="true"] &, &:has([data-editing="true"])`]: {
      gridTemplateColumns: '1fr',
      opacity: 1,
    },
  },
});
export const titleRevealInner = style({
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

// Reading progress on the header's bottom edge. The page sets the variable
// while the user scrolls, so the line only ever moves with the user.
export const progress = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 2,
  borderRadius: 2,
  background: cadence.primary,
  transformOrigin: '0 50%',
  scale: 'var(--doc-scroll-progress, 0) 1',
  opacity: 0,
  pointerEvents: 'none',
  transition: springTransition(motion.effectsDefault, 'opacity'),
  selectors: {
    [`${root}[data-show-progress="true"] &`]: {
      opacity: 1,
    },
  },
});

export const dragHandle = style({
  cursor: 'grab',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: -16,
  width: 16,
  opacity: 0,
  selectors: {
    [`${root}:hover &, ${root}[data-dragging="true"] &`]: {
      opacity: 1,
    },
  },
});

export const dragPreview = style({
  // see https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints/#native-drag-previews
  maxWidth: '280px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  padding: '4px 16px',
  overflow: 'hidden',
  backgroundColor: cssVarV2('layer/background/primary'),
  borderRadius: '12px',
});

export const templateMark = style({
  backgroundColor: cadence.tertiaryContainer,
  color: cadence.onTertiaryContainer,
  borderRadius: shape.full,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '20px',
});

export const journalTemplateMark = style({
  '@container': {
    '(width <= 400px)': {
      display: 'none',
    },
  },
});
