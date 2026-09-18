import { createGlobalThemeContract } from '@vanilla-extract/css';

// Cadence's first Material 3 inspired color roles. Keep these separate from
// document colors so changing the app's appearance never recolors user content.
export const cadence = createGlobalThemeContract({
  primary: 'cadence-primary',
  onPrimary: 'cadence-on-primary',
  primaryContainer: 'cadence-primary-container',
  onPrimaryContainer: 'cadence-on-primary-container',
  tertiary: 'cadence-tertiary',
  tertiaryContainer: 'cadence-tertiary-container',
  onTertiaryContainer: 'cadence-on-tertiary-container',
  // The tinted window surface that wraps the sidebar and the document card.
  frame: 'cadence-frame',
  // The raised pill behind the selected item on the frame.
  frameSelected: 'cadence-frame-selected',
  surfaceContainer: 'cadence-surface-container',
  surfaceContainerHigh: 'cadence-surface-container-high',
  outline: 'cadence-outline',
  outlineVariant: 'cadence-outline-variant',
});

// Every color role is derived from these two numbers, so one accent choice
// re-tints the whole frame. Hue is an OKLCH angle, chroma scales saturation.
export const cadenceSeed = {
  hue: '--cadence-hue',
  chroma: '--cadence-chroma',
} as const;

export const CADENCE_DEFAULT_HUE = 258;
export const CADENCE_DEFAULT_CHROMA = 1;

// Springs sampled into CSS linear() curves. Spatial springs overshoot and are
// for things that move or resize. Effects springs never overshoot and are for
// color and opacity.
export const motion = createGlobalThemeContract({
  spatialFast: {
    duration: 'cadence-spatial-fast-duration',
    easing: 'cadence-spatial-fast-easing',
  },
  spatialDefault: {
    duration: 'cadence-spatial-default-duration',
    easing: 'cadence-spatial-default-easing',
  },
  spatialSlow: {
    duration: 'cadence-spatial-slow-duration',
    easing: 'cadence-spatial-slow-easing',
  },
  effectsFast: {
    duration: 'cadence-effects-fast-duration',
    easing: 'cadence-effects-fast-easing',
  },
  effectsDefault: {
    duration: 'cadence-effects-default-duration',
    easing: 'cadence-effects-default-easing',
  },
  effectsSlow: {
    duration: 'cadence-effects-slow-duration',
    easing: 'cadence-effects-slow-easing',
  },
});

export const shape = {
  extraSmall: '4px',
  small: '8px',
  medium: '12px',
  large: '16px',
  extraLarge: '28px',
  full: '999px',
} as const;

// Material 3 Expressive shapes as scalable clip paths. Every shape has the
// same 72 points, so any one can morph into any other.
export const expressiveShape = {
  // A square whose corners swell and whose sides pinch in slightly.
  cookie:
    'polygon(93.0% 50.0%, 93.1% 53.8%, 93.2% 57.6%, 93.2% 61.6%, 93.1% 65.7%, 92.7% 69.9%, 91.8% 74.1%, 90.3% 78.2%, 88.1% 82.0%, 85.3% 85.3%, 82.0% 88.1%, 78.2% 90.3%, 74.1% 91.8%, 69.9% 92.7%, 65.7% 93.1%, 61.6% 93.2%, 57.6% 93.2%, 53.8% 93.1%, 50.0% 93.0%, 46.2% 93.1%, 42.4% 93.2%, 38.4% 93.2%, 34.3% 93.1%, 30.1% 92.7%, 25.9% 91.8%, 21.8% 90.3%, 18.0% 88.1%, 14.7% 85.3%, 11.9% 82.0%, 9.7% 78.2%, 8.2% 74.1%, 7.3% 69.9%, 6.9% 65.7%, 6.8% 61.6%, 6.8% 57.6%, 6.9% 53.8%, 7.0% 50.0%, 6.9% 46.2%, 6.8% 42.4%, 6.8% 38.4%, 6.9% 34.3%, 7.3% 30.1%, 8.2% 25.9%, 9.7% 21.8%, 11.9% 18.0%, 14.7% 14.7%, 18.0% 11.9%, 21.8% 9.7%, 25.9% 8.2%, 30.1% 7.3%, 34.3% 6.9%, 38.4% 6.8%, 42.4% 6.8%, 46.2% 6.9%, 50.0% 7.0%, 53.8% 6.9%, 57.6% 6.8%, 61.6% 6.8%, 65.7% 6.9%, 69.9% 7.3%, 74.1% 8.2%, 78.2% 9.7%, 82.0% 11.9%, 85.3% 14.7%, 88.1% 18.0%, 90.3% 21.8%, 91.8% 25.9%, 92.7% 30.1%, 93.1% 34.3%, 93.2% 38.4%, 93.2% 42.4%, 93.1% 46.2%)',
  // Eight soft lobes, like a bottle cap.
  scallop:
    'polygon(99.1% 50.0%, 98.3% 54.2%, 96.2% 58.2%, 93.7% 61.7%, 91.4% 65.1%, 90.0% 68.6%, 89.2% 72.6%, 88.5% 76.9%, 87.1% 81.1%, 84.7% 84.7%, 81.1% 87.1%, 76.9% 88.5%, 72.6% 89.2%, 68.6% 90.0%, 65.1% 91.4%, 61.7% 93.7%, 58.2% 96.2%, 54.2% 98.3%, 50.0% 99.1%, 45.8% 98.3%, 41.8% 96.2%, 38.3% 93.7%, 34.9% 91.4%, 31.4% 90.0%, 27.4% 89.2%, 23.1% 88.5%, 18.9% 87.1%, 15.3% 84.7%, 12.9% 81.1%, 11.5% 76.9%, 10.8% 72.6%, 10.0% 68.6%, 8.6% 65.1%, 6.3% 61.7%, 3.8% 58.2%, 1.7% 54.2%, 0.9% 50.0%, 1.7% 45.8%, 3.8% 41.8%, 6.3% 38.3%, 8.6% 34.9%, 10.0% 31.4%, 10.8% 27.4%, 11.5% 23.1%, 12.9% 18.9%, 15.3% 15.3%, 18.9% 12.9%, 23.1% 11.5%, 27.4% 10.8%, 31.4% 10.0%, 34.9% 8.6%, 38.3% 6.3%, 41.8% 3.8%, 45.8% 1.7%, 50.0% 0.9%, 54.2% 1.7%, 58.2% 3.8%, 61.7% 6.3%, 65.1% 8.6%, 68.6% 10.0%, 72.6% 10.8%, 76.9% 11.5%, 81.1% 12.9%, 84.7% 15.3%, 87.1% 18.9%, 88.5% 23.1%, 89.2% 27.4%, 90.0% 31.4%, 91.4% 34.9%, 93.7% 38.3%, 96.2% 41.8%, 98.3% 45.8%)',
  // A hexagon with relaxed corners.
  hexagon:
    'polygon(98.9% 50.0%, 98.4% 54.2%, 97.2% 58.3%, 95.4% 62.2%, 93.3% 65.8%, 91.1% 69.2%, 89.1% 72.6%, 87.2% 76.0%, 85.3% 79.6%, 83.2% 83.2%, 80.8% 86.7%, 77.9% 89.8%, 74.4% 92.3%, 70.6% 94.1%, 66.4% 95.0%, 62.2% 95.4%, 58.0% 95.4%, 54.0% 95.2%, 50.0% 95.1%, 46.0% 95.2%, 42.0% 95.4%, 37.8% 95.4%, 33.6% 95.0%, 29.4% 94.1%, 25.6% 92.3%, 22.1% 89.8%, 19.2% 86.7%, 16.8% 83.2%, 14.7% 79.6%, 12.8% 76.0%, 10.9% 72.6%, 8.9% 69.2%, 6.7% 65.8%, 4.6% 62.2%, 2.8% 58.3%, 1.6% 54.2%, 1.1% 50.0%, 1.6% 45.8%, 2.8% 41.7%, 4.6% 37.8%, 6.7% 34.2%, 8.9% 30.8%, 10.9% 27.4%, 12.8% 24.0%, 14.7% 20.4%, 16.8% 16.8%, 19.2% 13.3%, 22.1% 10.2%, 25.6% 7.7%, 29.4% 5.9%, 33.6% 5.0%, 37.8% 4.6%, 42.0% 4.6%, 46.0% 4.8%, 50.0% 4.9%, 54.0% 4.8%, 58.0% 4.6%, 62.2% 4.6%, 66.4% 5.0%, 70.6% 5.9%, 74.4% 7.7%, 77.9% 10.2%, 80.8% 13.3%, 83.2% 16.8%, 85.3% 20.4%, 87.2% 24.0%, 89.1% 27.4%, 91.1% 30.8%, 93.3% 34.2%, 95.4% 37.8%, 97.2% 41.7%, 98.4% 45.8%)',
  // A square stood on its corner, with the points rounded off.
  diamond:
    'polygon(99.0% 50.0%, 98.3% 54.2%, 97.0% 58.3%, 95.3% 62.1%, 93.4% 65.8%, 91.2% 69.2%, 89.0% 72.5%, 86.5% 75.6%, 84.0% 78.5%, 81.3% 81.3%, 78.5% 84.0%, 75.6% 86.5%, 72.5% 89.0%, 69.2% 91.2%, 65.8% 93.4%, 62.1% 95.3%, 58.3% 97.0%, 54.2% 98.3%, 50.0% 99.0%, 45.8% 98.3%, 41.7% 97.0%, 37.9% 95.3%, 34.2% 93.4%, 30.8% 91.2%, 27.5% 89.0%, 24.4% 86.5%, 21.5% 84.0%, 18.7% 81.3%, 16.0% 78.5%, 13.5% 75.6%, 11.0% 72.5%, 8.8% 69.2%, 6.6% 65.8%, 4.7% 62.1%, 3.0% 58.3%, 1.7% 54.2%, 1.0% 50.0%, 1.7% 45.8%, 3.0% 41.7%, 4.7% 37.9%, 6.6% 34.2%, 8.8% 30.8%, 11.0% 27.5%, 13.5% 24.4%, 16.0% 21.5%, 18.7% 18.7%, 21.5% 16.0%, 24.4% 13.5%, 27.5% 11.0%, 30.8% 8.8%, 34.2% 6.6%, 37.9% 4.7%, 41.7% 3.0%, 45.8% 1.7%, 50.0% 1.0%, 54.2% 1.7%, 58.3% 3.0%, 62.1% 4.7%, 65.8% 6.6%, 69.2% 8.8%, 72.5% 11.0%, 75.6% 13.5%, 78.5% 16.0%, 81.3% 18.7%, 84.0% 21.5%, 86.5% 24.4%, 89.0% 27.5%, 91.2% 30.8%, 93.4% 34.2%, 95.3% 37.9%, 97.0% 41.7%, 98.3% 45.8%)',
} as const;
