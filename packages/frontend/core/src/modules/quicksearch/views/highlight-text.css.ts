import { cadence } from '@affine/component/theme/tokens';
import { style } from '@vanilla-extract/css';

export const highlightText = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
export const highlightKeyword = style({
  display: 'inline-block',
  verticalAlign: 'bottom',
  color: cadence.primary,
  fontWeight: 600,
  whiteSpace: 'pre',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexShrink: 0,
  maxWidth: '360px',
});
