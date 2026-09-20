import { cadence, shape } from '@affine/component/theme/tokens';
import { style } from '@vanilla-extract/css';

export const dropEffect = style({
  zIndex: 99999,
  position: 'fixed',
  left: 16,
  top: 20,
  pointerEvents: 'none',
  maxWidth: 'min(280px, calc(100vw - 32px))',
  background: cadence.primaryContainer,
  color: cadence.onPrimaryContainer,
  border: `1px solid ${cadence.outlineVariant}`,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
  padding: '7px 11px',
  fontSize: '12px',
  borderRadius: shape.full,
  fontWeight: 500,
  lineHeight: 1.4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
});

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const icon = style({
  width: 16,
  height: 16,
  flexShrink: 0,
});
