import { cadence, shape } from '@affine/component/theme/tokens';
import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';
export const group = style({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
});
export const deleteHintContainer = style({
  position: 'relative',
  zIndex: 2,
  // A card of its own floating at the foot of the doc, so it reads as a
  // notice about the doc and not as part of it.
  margin: '0 12px 12px',
  padding: '10px 12px 10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
  bottom: '0',
  gap: '16px',
  backgroundColor: cadence.surfaceContainer,
  border: `0.5px solid ${cadence.outlineVariant}`,
  borderRadius: shape.large,
  boxShadow:
    '0 2px 6px rgba(0, 0, 0, 0.06), 0 12px 32px -8px rgba(0, 0, 0, 0.2)',
});
export const deleteHintText = style({
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '24px',
  color: cssVar('textSecondaryColor'),
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
export const buttonContainer = style({
  padding: '8px 18px',
  height: '36px',
});
export const icon = style({
  width: 20,
  height: 20,
});
