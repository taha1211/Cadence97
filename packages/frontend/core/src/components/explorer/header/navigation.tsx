import { WorkbenchLink } from '@affine/core/modules/workbench';
import { useI18n } from '@affine/i18n';
import track from '@affine/track';
import { useLayoutEffect, useRef } from 'react';

import * as styles from './navigation.css';

const items = [
  {
    value: 'docs',
    label: 'com.affine.docs.header',
    testId: 'workspace-docs-button',
    to: '/all',
  },
  {
    value: 'collections',
    label: 'com.affine.collections.header',
    testId: 'workspace-collections-button',
    to: '/collection',
  },
  {
    value: 'tags',
    label: 'Tags',
    testId: 'workspace-tags-button',
    to: '/tag',
  },
] as const;

type NavigationKey = (typeof items)[number]['value'];

// Each tab is its own route, and each route mounts its own copy of this row.
// Remembering the last tab lets the pill start where it was and travel to the
// new tab, instead of appearing in place on every navigation.
let lastActive: NavigationKey | null = null;

export const ExplorerNavigation = ({ active }: { active: NavigationKey }) => {
  const t = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    // Layout offsets, so a transform on any ancestor cannot skew the pill.
    const place = (key: NavigationKey) => {
      const tab = container.querySelector<HTMLElement>(`[data-tab="${key}"]`);
      if (!tab) return;
      indicator.style.translate = `${tab.offsetLeft}px ${tab.offsetTop}px`;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.height = `${tab.offsetHeight}px`;
    };

    const from = lastActive;
    lastActive = active;
    if (from && from !== active) {
      indicator.dataset.moving = 'false';
      place(from);
      // Commit the starting position before switching the spring on.
      void indicator.offsetWidth;
      indicator.dataset.moving = 'true';
    }
    place(active);

    // Labels change width with the language and the font loading. An observer
    // always reports once on `observe`, and that first report must not cancel
    // the travel that just started.
    let initialReport = true;
    const resizes = new ResizeObserver(() => {
      if (initialReport) {
        initialReport = false;
        return;
      }
      indicator.dataset.moving = 'false';
      place(active);
    });
    resizes.observe(container);
    return () => resizes.disconnect();
  }, [active]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div ref={indicatorRef} className={styles.indicator} aria-hidden />
      {items.map(item => (
        <WorkbenchLink
          key={item.value}
          data-testid={item.testId}
          data-active={active === item.value}
          data-tab={item.value}
          to={item.to}
          onClick={() => {
            track.allDocs.header.navigation.navigateAllDocsRouter({
              control: item.value,
            });
          }}
          className={styles.item}
        >
          {t[item.label]()}
        </WorkbenchLink>
      ))}
    </div>
  );
};
