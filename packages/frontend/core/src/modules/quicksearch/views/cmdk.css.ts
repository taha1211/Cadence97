import { springTransition } from '@affine/component/theme/motion';
import {
  cadence,
  expressiveShape,
  motion,
  shape,
} from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { globalStyle, keyframes, style } from '@vanilla-extract/css';

export const root = style({});

// Each kind of result sits in its own shape, so after a while the eye finds
// "a doc" or "a command" by silhouette before it reads a single label.
export const itemIcon = style({
  fontSize: 18,
  width: 32,
  height: 32,
  marginRight: 12,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: cadence.onPrimaryContainer,
  background: cadence.primaryContainer,
  borderRadius: 10,
  selectors: {
    '&[data-kind="navigation"]': {
      borderRadius: '50%',
      background: cadence.surfaceContainerHigh,
      color: cssVarV2('icon/primary'),
    },
    '&[data-kind="command"]': {
      borderRadius: 0,
      clipPath: expressiveShape.cookie,
      background: cadence.tertiaryContainer,
      color: cadence.onTertiaryContainer,
    },
    '&[data-kind="settings"]': {
      borderRadius: 0,
      clipPath: expressiveShape.scallop,
      background: cadence.surfaceContainerHigh,
      color: cssVarV2('icon/primary'),
    },
    '&[data-kind="tag"]': {
      borderRadius: 0,
      clipPath: expressiveShape.diamond,
      background: cadence.tertiaryContainer,
      color: cadence.onTertiaryContainer,
    },
    '&[data-kind="collection"]': {
      borderRadius: 0,
      clipPath: expressiveShape.hexagon,
    },
    // Creating is the primary action of the palette, so its tile is the only
    // one filled with the full accent.
    '&[data-kind="create"]': {
      borderRadius: 0,
      clipPath: expressiveShape.cookie,
      background: cadence.primary,
      color: cadence.onPrimary,
    },
    '[data-is-danger="true"] &': {
      background: cssVar('backgroundErrorColor'),
      color: cssVar('errorColor'),
    },
  },
});
// Doc emoji and custom icons bring their own color; everything else follows
// the tile.
globalStyle(`${itemIcon} svg`, {
  color: 'inherit',
});

export const itemLabel = style({
  fontSize: 14,
  lineHeight: '1.5',
  color: cssVar('textPrimaryColor'),
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

globalStyle(`${root} [cmdk-root]`, {
  height: '100%',
});
globalStyle(`${root} [cmdk-group-heading]`, {
  padding: '10px 12px 4px',
  color: cssVarV2('text/secondary'),
  fontSize: cssVar('fontXs'),
  fontWeight: 600,
  lineHeight: '1.67',
});
globalStyle(`${root} [cmdk-group][hidden]`, {
  display: 'none',
});
globalStyle(`${root} [cmdk-list]`, {
  maxHeight: 420,
  minHeight: 80,
  overflow: 'auto',
  overscrollBehavior: 'contain',
  height: 'min(420px, calc(var(--cmdk-list-height) + 8px))',
  margin: '4px 8px 8px',
  scrollbarGutter: 'stable',
  scrollPaddingBlock: '12px',
  scrollbarWidth: 'thin',
  scrollbarColor: `${cssVar('iconColor')} transparent`,
});
// An effects curve, because a list that overshoots its height flashes a gap.
globalStyle(`${root} [cmdk-list]:not([data-opening])`, {
  transition: springTransition(motion.effectsDefault, 'height'),
});
// The selection pill is positioned against the sizer, so it scrolls with the
// rows for free.
globalStyle(`${root} [cmdk-list-sizer]`, {
  position: 'relative',
});
globalStyle(`${root} [cmdk-list]::-webkit-scrollbar`, {
  width: 6,
  height: 6,
});
globalStyle(`${root} [cmdk-list]::-webkit-scrollbar-thumb`, {
  borderRadius: 4,
  backgroundClip: 'padding-box',
});
globalStyle(`${root} [cmdk-list]:hover::-webkit-scrollbar-thumb`, {
  backgroundColor: cssVar('dividerColor'),
});
globalStyle(`${root} [cmdk-list]:hover::-webkit-scrollbar-thumb:hover`, {
  backgroundColor: cssVar('iconColor'),
});
globalStyle(`${root} [cmdk-item]`, {
  display: 'flex',
  minHeight: 48,
  padding: '6px 10px',
  alignItems: 'center',
  cursor: 'default',
  borderRadius: shape.large,
  userSelect: 'none',
  // Above the selection pill, which paints the highlight for every row.
  position: 'relative',
  zIndex: 1,
});
globalStyle(`${root} [cmdk-item][data-disabled=true]`, {
  opacity: 0.5,
});
// Dangerous commands look dangerous before they are selected, not only after.
globalStyle(`${root} [cmdk-item][data-is-danger=true] ${itemLabel}`, {
  color: cssVar('errorColor'),
});
// The create row is the palette's primary action.
globalStyle(`${root} [cmdk-item][data-kind=create] ${itemLabel}`, {
  color: cadence.onPrimaryContainer,
  fontWeight: 500,
});

export const selectionPill = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
  pointerEvents: 'none',
  opacity: 0,
  borderRadius: shape.large,
  background: cadence.surfaceContainerHigh,
  willChange: 'translate',
  transition: springTransition(motion.effectsFast, 'opacity', 'background'),
  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
    },
    // Arrow keys travel. Typing, scrolling and a held key snap, because a
    // highlight that lags behind the keyboard feels broken.
    '&[data-moving="true"]': {
      transition: [
        springTransition(motion.spatialFast, 'translate'),
        springTransition(motion.effectsFast, 'height', 'opacity', 'background'),
      ].join(', '),
    },
    '&[data-kind="create"]': {
      background: cadence.primaryContainer,
    },
    '&[data-danger="true"]': {
      background: cssVar('backgroundErrorColor'),
    },
  },
});

export const panelContainer = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const pageTitleWrapper = style({
  display: 'flex',
  alignItems: 'center',
  padding: '18px 16px 0',
  width: '100%',
});

export const pageTitle = style({
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: cssVar('fontXs'),
  lineHeight: '20px',
  color: cssVar('textSecondaryColor'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  backgroundColor: cadence.surfaceContainerHigh,
});

export const searchInputContainer = style({
  height: 72,
  padding: '20px 22px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: `1px solid ${cadence.outlineVariant}`,
  flexShrink: 0,
  position: 'relative',
});

const progressSlide = keyframes({
  from: { translate: '-100% 0' },
  to: { translate: '350% 0' },
});
// A thin line on the input's bottom edge while results load. It takes no
// space, so nothing shifts when it appears.
export const progressLine = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: -1,
  height: 2,
  overflow: 'hidden',
  opacity: 0,
  transition: springTransition(motion.effectsDefault, 'opacity'),
  selectors: {
    '&[data-loading="true"]': {
      opacity: 1,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '30%',
      borderRadius: 2,
      background: cadence.primary,
    },
    '&[data-loading="true"]::before': {
      animation: `${progressSlide} 1.1s ease-in-out infinite`,
    },
    // A known progress fills from the left instead of sliding.
    '&[data-determinate="true"]::before': {
      animation: 'none',
      width: 'var(--progress, 0%)',
      transition: springTransition(motion.effectsDefault, 'width'),
    },
  },
});

export const hasInputLabel = style([
  searchInputContainer,
  {
    paddingTop: '12px',
    paddingBottom: '18px',
  },
]);

export const searchInput = style({
  color: cssVar('textPrimaryColor'),
  fontSize: 22,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  width: '100%',
  caretColor: cadence.primary,
  '::placeholder': {
    color: cssVarV2('text/tertiary'),
    fontWeight: 400,
  },
});

export const timestamp = style({
  display: 'flex',
  fontSize: cssVar('fontXs'),
  color: cssVar('textSecondaryColor'),
  minWidth: 120,
  flexDirection: 'row-reverse',
});

export const keybinding = style({
  display: 'flex',
  fontSize: cssVar('fontXs'),
  columnGap: 2,
});

// The same keycap as the sidebar's search pill.
export const keybindingFragment = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 5px',
  borderRadius: 6,
  border: `1px solid ${cadence.outlineVariant}`,
  color: cssVarV2('text/secondary'),
  minWidth: 22,
  height: 20,
  fontSize: 11,
  fontWeight: 500,
  textTransform: 'uppercase',
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '10px 22px',
  borderTop: `1px solid ${cadence.outlineVariant}`,
  color: cssVarV2('text/tertiary'),
  fontSize: cssVar('fontXs'),
  userSelect: 'none',
  flexShrink: 0,
});
export const footerHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});
export const footerSpacer = style({
  flex: 1,
});

export const itemTitle = style({
  fontSize: cssVar('fontBase'),
  lineHeight: '24px',
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
export const itemSubtitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
  fontSize: cssVar('fontXs'),
  lineHeight: '20px',
  fontWeight: 400,
  color: cssVarV2('text/secondary'),
});
// Two docs called "Untitled" are only told apart by where they live.
export const itemLocation = style({
  flexShrink: 0,
  maxWidth: '50%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: cssVarV2('text/tertiary'),
  selectors: {
    '&:not(:last-child)::after': {
      content: '"·"',
      marginLeft: 6,
    },
  },
});

export const filters = style({
  display: 'flex',
  gap: 6,
  padding: '10px 20px 2px',
  flexShrink: 0,
});
export const filterChip = style({
  height: 28,
  padding: '0 12px',
  border: `1px solid ${cadence.outlineVariant}`,
  borderRadius: shape.full,
  background: 'transparent',
  color: cssVarV2('text/secondary'),
  fontSize: cssVar('fontXs'),
  fontWeight: 500,
  cursor: 'pointer',
  transition: springTransition(
    motion.effectsFast,
    'background-color',
    'border-color',
    'color'
  ),
  selectors: {
    '&:hover': {
      background: cssVarV2('layer/background/hoverOverlay'),
    },
    '&[aria-selected="true"]': {
      background: cadence.primaryContainer,
      borderColor: 'transparent',
      color: cadence.onPrimaryContainer,
    },
  },
});

export const emptyMessage = style({
  padding: '20px 12px 8px',
  color: cssVarV2('text/secondary'),
  fontSize: cssVar('fontSm'),
});

export const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const errorMessage = style({
  padding: '0px 8px 8px',
  fontSize: cssVar('fontXs'),
  color: cssVarV2('status/error'),
});
