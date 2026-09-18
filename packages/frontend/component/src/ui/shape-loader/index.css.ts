import { createVar, keyframes, style } from '@vanilla-extract/css';

import { cadence, expressiveShape } from '../../theme/tokens.css';

export const sizeVar = createVar('shape-loader-size');

// The shapes share a point count, so the browser can blend one polygon into
// the next.
const morph = keyframes({
  '0%, 100%': { clipPath: expressiveShape.cookie },
  '33%': { clipPath: expressiveShape.scallop },
  '66%': { clipPath: expressiveShape.hexagon },
});
const turn = keyframes({
  to: { rotate: '360deg' },
});

export const shapeLoader = style({
  width: sizeVar,
  height: sizeVar,
  flexShrink: 0,
  background: cadence.primary,
  clipPath: expressiveShape.cookie,
  animation: `${morph} 2.4s ease-in-out infinite, ${turn} 4.8s linear infinite`,
  '@media': {
    // Still a shape, and still clearly a placeholder, but at rest.
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
