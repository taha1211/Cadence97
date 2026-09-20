import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  maxWidth: cssVar('--affine-editor-width'),
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: cssVar('--affine-editor-side-padding', '24'),
  paddingRight: cssVar('--affine-editor-side-padding', '24'),
  fontSize: cssVar('--affine-font-base'),
  '@container': {
    [`viewport (width <= 640px)`]: {
      padding: '0 24px',
    },
  },
  '@media': {
    print: {
      display: 'none',
    },
  },
});

export const titleLine = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const title = style({
  fontWeight: 600,
  fontSize: '13px',
  lineHeight: '24px',
  color: cssVarV2('text/secondary'),
});

export const showButton = style({
  height: '28px',
  padding: '0 12px',
  borderRadius: shape.full,
  border: `1px solid ${cadence.outlineVariant}`,
  backgroundColor: 'transparent',
  textAlign: 'center',
  fontSize: '12px',
  lineHeight: '26px',
  fontWeight: '500',
  color: cssVarV2('text/secondary'),
  cursor: 'pointer',
  transition: springTransition(motion.effectsFast, 'background-color', 'color'),
  ':hover': {
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
    color: cssVarV2('text/primary'),
  },
});

export const linksContainer = style({
  marginBottom: '16px',
});

export const linksTitles = style({
  color: cssVar('--affine-text-secondary-color'),
  height: '32px',
  lineHeight: '32px',
});

export const link = style({
  width: '100%',
  height: '34px',
  padding: '0 6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap',
  borderRadius: shape.small,
  transition: springTransition(motion.effectsFast, 'background-color'),
  ':hover': {
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
  },
});

globalStyle(`${link} .affine-reference-title`, {
  borderBottom: 'none',
});

globalStyle(`${link} svg`, {
  color: cssVarV2('icon/secondary'),
});

globalStyle(`${link}:hover svg`, {
  color: cssVarV2('icon/primary'),
});

export const linkPreviewContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '4px',
  marginBottom: '16px',
});

export const linkPreview = style({
  cursor: 'default',
  border: `0.5px solid ${cadence.outlineVariant}`,
  borderRadius: shape.medium,
  padding: '10px 12px',
  color: cssVarV2('text/primary'),
  vars: {
    [cssVar('fontFamily')]: cssVar('fontSansFamily'),
  },
  backgroundColor: cadence.surfaceContainer,
  transition: springTransition(motion.effectsFast, 'background-color'),
  ':hover': {
    backgroundColor: cadence.surfaceContainerHigh,
  },
});

globalStyle(`${linkPreview} *`, {
  cursor: 'default',
});

export const notFound = style({
  color: cssVarV2('text/secondary'),
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center',
});

export const linkPreviewRenderer = style({
  cursor: 'pointer',
});

export const collapsedIcon = style({
  transition: 'all 0.2s ease-in-out',
  color: cssVarV2('icon/primary'),
  fontSize: 20,
  selectors: {
    '&[data-collapsed="true"]': {
      transform: 'rotate(90deg)',
      color: cssVarV2('icon/secondary'),
    },
  },
});
