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
