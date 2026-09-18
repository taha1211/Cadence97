import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { checkboxRestRadius } from '@affine/component/ui/checkbox';
import { cssVarV2 } from '@toeverything/theme/v2';
import { globalStyle, style } from '@vanilla-extract/css';

import { dateDocListInlineProperty } from '../../workspace-property-types/created-updated-at.css';

export const root = style({
  width: '100%',
  height: '100%',
});

// A dragged doc has weight: it tilts a little and casts a deeper shadow.
export const dragPreview = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px 8px 12px',
  background: cadence.surfaceContainer,
  borderRadius: shape.medium,
  border: `0.5px solid ${cadence.outlineVariant}`,
  boxShadow:
    '0 2px 6px rgba(0, 0, 0, 0.1), 0 16px 32px -8px rgba(0, 0, 0, 0.3)',
  rotate: '-3deg',
  fontSize: 14,
  fontWeight: 500,
});
export const dragPreviewIcon = style({
  fontSize: 24,
});

export const listViewRoot = style({
  padding: '0px 8px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  borderRadius: shape.medium,
  overflow: 'hidden',
  transition: springTransition(motion.effectsFast, 'background-color'),
  containerName: 'list-view-root',
  containerType: 'size',
  selectors: {
    '&:hover': {
      backgroundColor: cssVarV2.layer.background.hoverOverlay,
    },
    [`${root}[data-selected="true"] &`]: {
      backgroundColor: cadence.primaryContainer,
    },
  },
});

export const dragHandle = style({
  position: 'absolute',
  padding: '5px 2px',
  color: cssVarV2.icon.secondary,
});
export const listDragHandle = style([
  dragHandle,
  {
    left: -4,
    top: '50%',
    transform: 'translateY(-50%) translateX(-100%)',
    opacity: 0,
    selectors: {
      [`${listViewRoot}:hover &`]: {
        opacity: 1,
      },
    },
  },
]);
export const listSelect = style({
  // Marks selection, so it rests as a circle and relaxes into a rounded
  // square when chosen, like the accent swatches.
  vars: { [checkboxRestRadius]: '50%' },
  width: 0,
  height: 24,
  fontSize: 20,
  padding: 2,
  // to make sure won't take place when hidden
  // 12 = gap + padding * 2
  marginLeft: -12,
  flexShrink: 0,
  display: 'flex',
  color: cssVarV2.icon.primary,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'end',
  transition: springTransition(motion.effectsDefault, 'width', 'margin-left'),
  // when select mode is on, the whole item can be clicked,
  // the selection will be handled by the parent, the checkbox here just for the visual effect
  pointerEvents: 'none',
  selectors: {
    '&[data-select-mode="true"]': {
      width: 24,
      marginLeft: 0,
    },
  },
});

// The same tile a doc wears in quick search, so it looks alike in both places.
export const listIcon = style({
  width: 32,
  height: 32,
  fontSize: 18,
  flexShrink: 0,
  borderRadius: 10,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
export const listContent = style({
  width: 0,
  height: '100%',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'space-between',
});
export const listBrief = style({
  height: '100%',
  flexShrink: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: 4,
  minWidth: 200,
});
export const listSpace = style({
  width: 0,
  flex: 1,
});
// export const listDetails = style({
//   display: 'flex',
//   gap: 8,
//   alignItems: 'center',
//   flexShrink: 1,
//   minWidth: 0,
//   justifyContent: 'flex-end',
// });
const ellipsis = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
export const listTitle = style([
  ellipsis,
  {
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 500,
    color: cssVarV2.text.primary,
  },
]);
// The title leads and the preview stays quiet beneath it.
export const listPreview = style([
  ellipsis,
  {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: cssVarV2.text.tertiary,
  },
]);

export const listQuickActions = style({
  display: 'flex',
  gap: 8,
  flexShrink: 0,
});

export const listHide750 = style({
  '@container': {
    'list-view-root (width <= 750px)': {
      display: 'none',
    },
  },
});

export const listHide560 = style({
  '@container': {
    'list-view-root (width <= 560px)': {
      display: 'none',
    },
  },
});

// --- card view ---
export const cardViewRoot = style({
  vars: {
    '--ring-color': 'transparent',
  },
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '0 16px 16px',
  borderRadius: shape.large,
  backgroundColor: cadence.surfaceContainer,
  border: `0.5px solid ${cadence.outlineVariant}`,
  boxShadow: '0 0 0 2px var(--ring-color), 0 1px 2px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  // The card rises toward the pointer on a spring and settles back the same
  // way.
  transition: [
    springTransition(motion.spatialFast, 'translate'),
    springTransition(motion.effectsDefault, 'box-shadow', 'border-color'),
  ].join(', '),
  selectors: {
    [`${root}[data-selected="true"] &`]: {
      vars: {
        '--ring-color': cadence.primary,
      },
    },
    '&:hover': {
      translate: '0 -2px',
      boxShadow:
        '0 0 0 2px var(--ring-color), 0 2px 4px rgba(0, 0, 0, 0.06), 0 12px 24px -8px rgba(0, 0, 0, 0.18)',
    },
  },
});
// The card's face: a tinted band with the doc's icon set large in a tile.
export const cardViewCover = style({
  flexShrink: 0,
  height: 56,
  margin: '0 -16px',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'flex-end',
  background: cadence.primaryContainer,
});
export const cardViewCoverIcon = style({
  width: 40,
  height: 40,
  marginBottom: -14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  lineHeight: 0,
  borderRadius: shape.medium,
  background: cadence.surfaceContainer,
  border: `0.5px solid ${cadence.outlineVariant}`,
  color: cadence.onPrimaryContainer,
});
// In a list the dates line up as a column. On a card they read as a sentence,
// so they start at the left edge.
globalStyle(`${cardViewRoot} ${dateDocListInlineProperty}`, {
  width: 'auto',
  justifyContent: 'flex-start',
});
export const cardViewHeader = style({
  marginTop: 14,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});
export const cardViewIcon = style({
  fontSize: 24,
  color: cssVarV2.icon.primary,
  lineHeight: 0,
});
export const cardViewTitle = style({
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
  color: cssVarV2.text.primary,
  letterSpacing: '-0.24px',
  width: 0,
  flexGrow: 1,
  flexShrink: 1,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
export const cardPreviewContainer = style({
  width: '100%',
  fontSize: 12,
  lineHeight: '20px',
  fontWeight: 400,
  color: cssVarV2.text.secondary,
  minHeight: 20,
  flexGrow: 1,
  flexShrink: 1,
  overflow: 'hidden',
});
export const cardViewCheckbox = style({
  vars: { [checkboxRestRadius]: '50%' },
  width: 20,
  height: 20,
  fontSize: 16,
  padding: 2,
  color: cssVarV2.icon.primary,
  pointerEvents: 'none',
});
export const cardDragHandle = style([
  dragHandle,
  {
    left: -4,
    top: 0,
    transform: 'translateX(-100%)',
    opacity: 0,
    selectors: {
      [`${cardViewRoot}:hover &`]: {
        opacity: 1,
      },
    },
  },
]);
