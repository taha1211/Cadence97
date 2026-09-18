import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

import { cadence } from '../../theme/tokens.css';

export const dropdownBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 16px',
  // fix dropdown button click area
  paddingRight: 0,
  color: cssVar('textPrimaryColor'),
  fontWeight: 600,
  background: cssVar('backgroundPrimaryColor'),
  border: `1px solid ${cssVar('borderColor')}`,
  borderRadius: '20px',
  fontSize: cssVar('fontSm'),
  // width: '100%',
  height: '40px',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      background: cssVar('hoverColorFilled'),
    },
    '&[data-size=default]': {
      height: 40,
    },
    '&[data-size=small]': {
      height: 32,
    },
    '&:focus-visible, &:has(:focus-visible)': {
      outline: `2px solid ${cadence.primary}`,
      outlineOffset: 2,
    },
  },
});

export const divider = style({
  width: '0.5px',
  height: '16px',
  background: cssVar('dividerColor'),
  // fix dropdown button click area
  margin: '0 4px',
  marginRight: 0,
});

export const dropdownWrapper = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: '4px',
  paddingRight: '10px',
});

export const dropdownIcon = style({
  borderRadius: '4px',
  selectors: {
    [`${dropdownWrapper}:hover &`]: {
      background: cssVar('hoverColor'),
    },
  },
});
