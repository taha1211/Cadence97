import { createGlobalThemeContract } from '@vanilla-extract/css';

// Cadence's first Material 3 inspired color roles. Keep these separate from
// document colors so changing the app's appearance never recolors user content.
export const cadence = createGlobalThemeContract({
  primary: 'cadence-primary',
  onPrimary: 'cadence-on-primary',
  primaryContainer: 'cadence-primary-container',
  onPrimaryContainer: 'cadence-on-primary-container',
  surfaceContainer: 'cadence-surface-container',
  surfaceContainerHigh: 'cadence-surface-container-high',
  outline: 'cadence-outline',
});
