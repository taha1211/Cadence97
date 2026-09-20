import {
  cadence,
  expressiveShape,
  shape,
} from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const sidebarContainerInner = style({
  display: 'flex',
  background: cadence.surfaceContainer,
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  borderRadius: 'inherit',
  selectors: {
    ['[data-client-border=true] &']: {
      borderRadius: shape.large,
      border: `0.5px solid ${cadence.outlineVariant}`,
    },
    ['[data-client-border=true][data-is-floating="true"] &']: {
      boxShadow: cssVar('shadow3'),
      border: `1px solid ${cssVarV2.layer.insideBorder.border}`,
    },
  },
});

export const sidebarBodyTarget = style({
  display: 'flex',
  flexDirection: 'column',
  height: 0,
  flex: 1,
  width: '100%',
  alignItems: 'center',
});

export const borderTop = style({
  borderTop: `0.5px solid ${cssVarV2.layer.insideBorder.border}`,
});

export const sidebarBodyNoSelectionTile = style({
  width: 48,
  height: 48,
  marginBottom: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  clipPath: expressiveShape.scallop,
  background: cadence.surfaceContainerHigh,
  color: cssVarV2('icon/secondary'),
});
export const sidebarBodyNoSelection = style({
  padding: '0 24px',
  textAlign: 'center',
  fontSize: 13,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  userSelect: 'none',
  color: cssVar('--affine-text-secondary-color'),
  alignItems: 'center',
});
