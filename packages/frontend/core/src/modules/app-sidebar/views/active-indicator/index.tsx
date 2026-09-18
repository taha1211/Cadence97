import { useLayoutEffect, useRef } from 'react';

import * as styles from './index.css';

const ACTIVE_SELECTOR = '[data-active="true"]';
const SCROLL_VIEWPORT_SELECTOR = '[data-radix-scroll-area-viewport]';
// How long to keep re-measuring after the sidebar changes, so the pill stays
// glued to its item while folders expand or collapse around it.
const FOLLOW_WINDOW_MS = 500;

/**
 * One shared pill behind the active sidebar item. It springs from the previous
 * item to the next instead of each item switching its own background.
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
    let followUntil = 0;
    let frame = 0;

    const place = () => {
      const target = container.querySelector(ACTIVE_SELECTOR);
      if (!target) {
        current = null;
        indicator.dataset.visible = 'false';
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
        indicator.dataset.visible = 'false';
        return;
      }

      // Spring only when the pill already sits on another item.
      const changed = target !== current;
      const moving = changed && current !== null;
      current = target;
      if (changed || !indicator.dataset.moving) {
        indicator.dataset.moving = String(moving);
      }

      indicator.style.transform = `translate(${rect.left - origin.left}px, ${top - origin.top}px)`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = `${bottom - top}px`;
      indicator.style.borderRadius = getComputedStyle(target).borderRadius;
      indicator.dataset.visible = 'true';
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
      if (event.propertyName === 'transform') {
        indicator.dataset.moving = 'false';
      }
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
    place();

    return () => {
      mutations.disconnect();
      resizes.disconnect();
      container.removeEventListener('scroll', onScroll, { capture: true });
      indicator.removeEventListener('transitionend', stopSpring);
      cancelAnimationFrame(frame);
      delete container.dataset.activeIndicator;
    };
  }, []);

  return <div ref={ref} className={styles.indicator} aria-hidden />;
};
