import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const empty = style({
  color: cssVarV2.text.placeholder,
});

export const tooltip = style({
  display: 'inline-block',
  selectors: {
    '&::first-letter': {
      textTransform: 'uppercase',
    },
  },
});

// A small leading icon tells Created from Updated without a column header.
export const dateDocListInlineProperty = style({
  width: 76,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 4,
  fontSize: 12,
  lineHeight: '20px',
  color: cssVarV2.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexShrink: 0,
});

export const dateDocListInlineIcon = style({
  flexShrink: 0,
  fontSize: 14,
  color: cssVarV2.icon.tertiary,
});
