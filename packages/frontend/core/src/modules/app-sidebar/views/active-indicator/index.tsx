import { useLayoutEffect, useRef } from 'react';

import * as styles from './index.css';

// Items opt in with `data-sidebar-item`, because other sidebar parts use
// `data-active` for unrelated state.
const ACTIVE_SELECTOR = '[data-sidebar-item][data-active="true"]';
const SCROLL_VIEWPORT_SELECTOR = '[data-radix-scroll-area-viewport]';
// The pill only travels inside one region. Crossing into another region would
// drag it over section headers, so there it pops in place instead.
const REGION_SELECTOR = '[data-sidebar-region]';
// How long to keep re-measuring after the sidebar changes, so the pill stays
// glued to its item while folders expand or collapse around it.
const FOLLOW_WINDOW_MS = 500;

/**
 * One shared pill behind the active sidebar item. Between two items of the
 * same region it springs from one to the other. When the selection crosses
 * regions, it appears on the new item with a bounce and does not travel.
 *
 * Render it as the first child of a `position: relative` container. Items opt
 * in by dropping their own active background under
 * `[data-active-indicator="true"]`.
 */
export const ActiveIndicator = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const indicator = ref.current;
    const container = indicator?.parentElement;
    if (!indicator || !container) return;

    container.dataset.activeIndicator = 'true';

    let current: Element | null = null;
    let currentRegion: Element | null = null;
    let followUntil = 0;
    let frame = 0;

    // Writing an unchanged value still queues a mutation record, and `place`
    // runs every frame while following.
    const setVisible = (visible: boolean) => {
      const value = String(visible);
      if (indicator.dataset.visible !== value) {
        indicator.dataset.visible = value;
      }
    };

    const place = () => {
      const target = container.querySelector(ACTIVE_SELECTOR);
      if (!target) {
        // Keep `current`. A route change often clears the old selection a few
        // frames before the new page sets its own, and the pill still has to
        // know where it came from to choose between travelling and popping.
        setVisible(false);
        return;
      }

      const origin = container.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      let top = rect.top;
      let bottom = rect.bottom;
      // The pill lives outside the scroll area, so clip it by hand.
      const viewport = target.closest(SCROLL_VIEWPORT_SELECTOR);
      if (viewport) {
        const bounds = viewport.getBoundingClientRect();
        top = Math.max(top, bounds.top);
        bottom = Math.min(bottom, bounds.bottom);
      }
      if (bottom <= top || rect.width === 0) {
        setVisible(false);
        return;
      }

      const changed = target !== current;
      const region = target.closest(REGION_SELECTOR);
      // Travel only when the pill already sits on another item of this region.
      const moving =
        changed &&
        current !== null &&
        region !== null &&
        region === currentRegion;
      const popping = changed && current !== null && !moving;
      current = target;
      currentRegion = region;
      if (changed || !indicator.dataset.moving) {
        indicator.dataset.moving = String(moving);
      }
      if (popping) {
        // Restart the keyframes even when two pops land back to back.
        indicator.dataset.pop = 'false';
        void indicator.offsetWidth;
        indicator.dataset.pop = 'true';
      }

      // Position with `translate`, never `transform`. The pop animates `scale`,
      // and CSS applies `scale` outside `transform`, so a transform-based
      // position would be scaled too and the pill would slide in from afar.
      indicator.style.translate = `${rect.left - origin.left}px ${top - origin.top}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = `${bottom - top}px`;
      indicator.style.borderRadius = getComputedStyle(target).borderRadius;
      setVisible(true);
    };

    const follow = () => {
      place();
      frame =
        performance.now() < followUntil ? requestAnimationFrame(follow) : 0;
    };
    const startFollowing = () => {
      // Place once right away so the spring starts on the same frame as the
      // selection change, then keep following.
      place();
      followUntil = performance.now() + FOLLOW_WINDOW_MS;
      if (!frame) frame = requestAnimationFrame(follow);
    };
    const stopSpring = (event: TransitionEvent) => {
      if (event.propertyName === 'translate') {
        indicator.dataset.moving = 'false';
      }
    };
    const stopPop = () => {
      indicator.dataset.pop = 'false';
    };
    // Scrolling must track the item exactly, so it cancels any spring.
    const onScroll = () => {
      indicator.dataset.moving = 'false';
      place();
    };

    const mutations = new MutationObserver(startFollowing);
    mutations.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-active'],
    });
    const resizes = new ResizeObserver(startFollowing);
    resizes.observe(container);
    container.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    });
    indicator.addEventListener('transitionend', stopSpring);
    indicator.addEventListener('animationend', stopPop);
    place();

    return () => {
      mutations.disconnect();
      resizes.disconnect();
      container.removeEventListener('scroll', onScroll, { capture: true });
      indicator.removeEventListener('transitionend', stopSpring);
      indicator.removeEventListener('animationend', stopPop);
      cancelAnimationFrame(frame);
      delete container.dataset.activeIndicator;
    };
  }, []);

  return <div ref={ref} className={styles.indicator} aria-hidden />;
};
