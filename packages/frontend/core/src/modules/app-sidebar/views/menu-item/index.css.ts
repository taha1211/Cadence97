import { cadence } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';
export const linkItemRoot = style({
  color: 'inherit',
});
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '20px',
  textAlign: 'left',
  color: 'inherit',
  width: '100%',
  minHeight: '40px',
  userSelect: 'none',
  cursor: 'pointer',
  padding: '0 10px',
  fontSize: cssVar('fontSm'),
  marginTop: '4px',
  position: 'relative',
  transition: 'background-color 160ms ease, color 160ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  selectors: {
    '&:hover': {
      background: cssVarV2.layer.background.hoverOverlay,
    },
    '&[data-active="true"]': {
      background: cadence.primaryContainer,
      color: cadence.onPrimaryContainer,
      fontWeight: 600,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
    '&[data-disabled="true"]': {
      cursor: 'default',
      color: cssVarV2.text.disable,
      pointerEvents: 'none',
    },
    '&[data-collapsible="true"]': {
      minHeight: '32px',
      borderRadius: '12px',
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    [`${linkItemRoot}:first-of-type &`]: {
      marginTop: '0px',
    },
  },
});
export const content = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});
export const postfix = style({
  right: '4px',
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  selectors: {
    [`${root}:hover &, ${root}:focus-within &, &[data-postfix-display="always"]`]:
      {
        justifySelf: 'flex-end',
        position: 'initial',
        opacity: 1,
        pointerEvents: 'all',
      },
  },
});
export const icon = style({
  color: cssVarV2('icon/primary'),
  fontSize: '20px',
  selectors: {
    [`${root}[data-active="true"] &`]: {
      color: cadence.onPrimaryContainer,
    },
  },
});
export const collapsedIconContainer = style({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  transition: 'transform 0.2s',
  color: 'inherit',
  selectors: {
    '&[data-collapsed="true"]': {
      transform: 'rotate(-90deg)',
    },
    '&[data-disabled="true"]': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
    '&:hover': {
      background: cssVarV2.layer.background.hoverOverlay,
    },
  },
});
export const iconsContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '32px',
  flexShrink: 0,
  selectors: {
    '&[data-collapsible="true"]': {
      width: '44px',
    },
  },
});
export const collapsedIcon = style({
  transition: 'transform 0.2s ease-in-out',
  selectors: {
    '&[data-collapsed="true"]': {
      transform: 'rotate(-90deg)',
    },
  },
});
export const spacer = style({
  flex: 1,
});
