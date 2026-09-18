import { cssVar } from '@toeverything/theme';
import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

import { cadence } from './tokens.css';

const sansFamily =
  "'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";

globalStyle(':root', {
  vars: {
    '--affine-font-family': sansFamily,
    '--affine-font-sans-family': sansFamily,
  },
  fontOpticalSizing: 'auto',
});

createGlobalTheme(':root, [data-theme="light"]', cadence, {
  primary: '#365e9d',
  onPrimary: '#ffffff',
  primaryContainer: '#d8e6ff',
  onPrimaryContainer: '#17365f',
  surfaceContainer: '#f2f4f8',
  surfaceContainerHigh: '#e7ebf2',
  outline: '#737b89',
});

createGlobalTheme('[data-theme="dark"]', cadence, {
  primary: '#aac7ff',
  onPrimary: '#10305b',
  primaryContainer: '#2c456b',
  onPrimaryContainer: '#d8e6ff',
  surfaceContainer: '#1b1e24',
  surfaceContainerHigh: '#282d36',
  outline: '#8d96a5',
});

globalStyle('body', {
  color: cssVar('textPrimaryColor'),
  fontFamily: cssVar('fontFamily'),
  fontSize: cssVar('fontBase'),
});
