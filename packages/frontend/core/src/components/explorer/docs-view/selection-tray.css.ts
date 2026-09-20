import { springTransition } from '@affine/component/theme/motion';
import { cadence, motion, shape } from '@affine/component/theme/tokens';
import { cssVarV2 } from '@toeverything/theme/v2';
import { keyframes, style } from '@vanilla-extract/css';

const compact = 'selection-tray (width < 520px)';
const appear = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
export const anchor = style({
  containerName: 'selection-tray',
  containerType: 'inline-size',
  position: 'absolute',
  bottom: 22,
  left: 16,
  right: 16,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  pointerEvents: 'none',
});
export const tray = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: 4,
  maxWidth: '100%',
  padding: 8,
  borderRadius: shape.extraLarge,
  background: cadence.surfaceContainerHigh,
  color: cssVarV2('text/primary'),
  border: `1px solid ${cadence.outlineVariant}`,
  boxShadow: '0 4px 12px rgba(0,0,0,.10), 0 16px 40px -8px rgba(0,0,0,.22)',
  pointerEvents: 'auto',
  animation: `${appear} 160ms ease-out`,
  '@container': {
    [compact]: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
    },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
export const count = style({
  gridColumn: 1,
  gridRow: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  padding: '0 10px',
  fontSize: 12,
  whiteSpace: 'nowrap',
  color: cssVarV2('text/secondary'),
});
export const number = style({
  display: 'grid',
  placeItems: 'center',
  minWidth: 28,
  height: 28,
  padding: '0 7px',
  borderRadius: shape.full,
  fontVariantNumeric: 'tabular-nums',
  fontSize: 13,
  fontWeight: 650,
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
});
export const actions = style({
  gridColumn: '1 / -1',
  gridRow: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexWrap: 'wrap',
  justifyContent: 'center',
});
export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  height: 36,
  padding: '0 11px',
  borderRadius: shape.full,
  border: 0,
  background: 'transparent',
  color: cssVarV2('text/primary'),
  font: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: springTransition(
    motion.effectsFast,
    'background',
    'border-radius'
  ),
  selectors: {
    '&:hover:not(:disabled), &[data-state="open"]': {
      background: cadence.primaryContainer,
      color: cadence.onPrimaryContainer,
      borderRadius: 12,
    },
    '&:active:not(:disabled)': { borderRadius: 10 },
    '&:focus-visible': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
    '&:disabled': { opacity: 0.45, cursor: 'default' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
});
export const iconButton = style([
  button,
  { width: 34, padding: 0, color: cssVarV2('icon/secondary') },
]);
export const deleteButton = style([iconButton, { gridColumn: 2, gridRow: 1 }]);
export const clearButton = style([iconButton, { gridColumn: 3, gridRow: 1 }]);
export const popup = style({
  width: 300,
  maxWidth: 'calc(100vw - 32px)',
  padding: 8,
  borderRadius: 20,
  background: cadence.surfaceContainerHigh,
  border: `1px solid ${cadence.outlineVariant}`,
});
export const heading = style({
  fontSize: 13,
  fontWeight: 600,
  margin: '6px 8px 2px',
});
export const hint = style({
  fontSize: 12,
  lineHeight: '18px',
  color: cssVarV2('text/secondary'),
  margin: '0 8px 10px',
});
export const search = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 12,
  padding: '0 10px',
  background: cadence.surfaceContainer,
  border: `1px solid ${cadence.outlineVariant}`,
  marginBottom: 6,
  selectors: {
    '&:focus-within': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: -1,
    },
  },
});
export const input = style({
  minWidth: 0,
  width: '100%',
  height: 38,
  background: 'transparent',
  border: 0,
  outline: 'none',
  font: 'inherit',
  fontSize: 13,
  color: cssVarV2('text/primary'),
});
export const choices = style({
  maxHeight: 'min(260px, 40vh)',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});
export const choice = style([
  button,
  {
    width: '100%',
    height: 'auto',
    minHeight: 40,
    borderRadius: 12,
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: '8px 10px',
  },
]);
export const choiceText = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
export const path = style({
  display: 'block',
  fontSize: 11,
  color: cssVarV2('text/secondary'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
export const coverage = style({
  fontSize: 11,
  fontWeight: 400,
  color: cssVarV2('text/secondary'),
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
});
export const empty = style({
  padding: '16px 10px',
  fontSize: 12,
  lineHeight: '18px',
  color: cssVarV2('text/secondary'),
});
export const message = style({
  maxWidth: '100%',
  padding: '8px 14px',
  borderRadius: 16,
  background: cadence.surfaceContainerHigh,
  color: cssVarV2('text/secondary'),
  border: `1px solid ${cadence.outlineVariant}`,
  fontSize: 12,
  textAlign: 'center',
  pointerEvents: 'auto',
});
