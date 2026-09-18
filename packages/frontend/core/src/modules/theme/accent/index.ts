import { DEFAULT_ACCENT_CHROMA, DEFAULT_ACCENT_HUE } from '@toeverything/infra';

// Hue is an OKLCH angle. Chroma scales how saturated the frame gets, so
// graphite is blueberry with most of the color drained out.
export const accents = [
  { id: 'blueberry', hue: DEFAULT_ACCENT_HUE, chroma: DEFAULT_ACCENT_CHROMA },
  { id: 'grape', hue: 305, chroma: 1 },
  { id: 'flamingo', hue: 355, chroma: 1 },
  { id: 'tangerine', hue: 55, chroma: 1 },
  { id: 'matcha', hue: 140, chroma: 1 },
  { id: 'lagoon', hue: 205, chroma: 1 },
  { id: 'graphite', hue: DEFAULT_ACCENT_HUE, chroma: 0.12 },
] as const;

export type Accent = (typeof accents)[number];

let previewToken = 0;

/**
 * Tint the window with an accent without saving it, and return a function
 * that takes the tint off again.
 *
 * The saved accent reaches the page through a stylesheet rule. An inline
 * value on the root element outranks that rule, so removing the inline value
 * is all it takes to fall back to whatever is saved.
 */
export const previewAccent = (accent: Accent) => {
  const token = ++previewToken;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--cadence-hue', String(accent.hue));
  rootStyle.setProperty('--cadence-chroma', String(accent.chroma));

  return () => {
    // Wait a beat before letting go. When the user confirms the accent, the
    // saved value lands a render later, and dropping the preview first would
    // flash the old color. A newer preview owns the inline value by then, so
    // only the latest preview may clear it.
    setTimeout(() => {
      if (token !== previewToken) return;
      rootStyle.removeProperty('--cadence-hue');
      rootStyle.removeProperty('--cadence-chroma');
    }, 80);
  };
};
