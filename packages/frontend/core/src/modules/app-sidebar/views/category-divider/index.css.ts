import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

const baseAction = style({
  display: 'flex',
  gap: 8,
  opacity: 0,
});

export const root = style({
  fontSize: cssVar('fontSm'),
  height: 28,
  width: 'calc(100%)',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
  borderRadius: shape.small,
  selectors: {
    [`&[data-collapsible="true"]`]: {
      cursor: 'pointer',
    },
    [`&[data-collapsible="true"]:hover`]: {
      backgroundColor: cssVarV2('layer/background/hoverOverlay'),
    },
    [`&[data-collapsible="true"]:hover:has(${baseAction}:hover)`]: {
      backgroundColor: 'transparent',
    },
    '&[data-dragged-over="true"]': {
      backgroundColor: cadence.primaryContainer,
    },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});

export const actions = style([
  baseAction,
  {
    selectors: {
      [`${root}:hover &`]: {
        opacity: 1,
      },
    },
  },
]);
export const label = style({
  color: cssVarV2('text/secondary'),
  fontWeight: 600,
  lineHeight: '20px',
  flexGrow: '0',
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  justifyContent: 'start',
  cursor: 'pointer',
});

export const collapseIcon = style({
  vars: { '--y': '1px', '--r': '90deg' },
  color: cssVarV2('icon/tertiary'),
  transform: 'translateY(var(--y)) rotate(var(--r))',
  // Hidden at rest so the headers read as plain labels. It stays visible on a
  // collapsed section, because that is the only sign the section has content.
  opacity: 0,
  transition: [
    springTransition(motion.spatialFast, 'transform'),
    springTransition(motion.effectsFast, 'opacity'),
  ].join(', '),
  selectors: {
    [`${root}[data-collapsed="true"] &`]: {
      vars: { '--r': '0deg' },
      opacity: 1,
    },
    [`${root}:hover &, ${root}:focus-visible &`]: {
      opacity: 1,
    },
  },
});
