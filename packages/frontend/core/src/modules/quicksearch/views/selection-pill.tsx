import { useLayoutEffect, useRef } from 'react';

import * as styles from './cmdk.css';

const SELECTED_ITEM = '[cmdk-item][data-selected="true"]';

/**
 * One shared highlight behind the selected result. A single arrow-key press
 * makes it travel to the next row on a spring. Everything else snaps: typing
 * (the rows are new, so there is nothing to travel from), the pointer, and a
 * held arrow key, because a highlight must never lag behind the input that
 * moves it.
 *
 * Render it as the first child of `Command.List`, so it lands inside cmdk's
 * sizer element and scrolls with the rows.
 */
export const SelectionPill = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pill = ref.current;
    const sizer = pill?.parentElement;
    const root = pill?.closest('[cmdk-root]');
    if (!pill || !sizer || !root) return;

    let travelNext = false;

    const place = () => {
      const selected = sizer.querySelector<HTMLElement>(SELECTED_ITEM);
      if (!selected) {
        pill.dataset.visible = 'false';
        return;
      }
      // Set before the position changes, so a snap never inherits a spring.
      pill.dataset.moving = String(
        travelNext && pill.dataset.visible === 'true'
      );
      travelNext = false;

      // Position with `translate`, never `transform`, so nothing that later
      // animates `scale` on this element can drag its position along.
      //
      // Measure with offsets, never `getBoundingClientRect`. The palette
      // scales in from 0.96, and a bounding rect taken during that entrance
      // comes back 4% too small, which leaves the pill short of the row's
      // edge. Offsets are layout values and ignore transforms. They are
      // relative to the sizer, because it is the nearest positioned ancestor.
      pill.style.translate = `${selected.offsetLeft}px ${selected.offsetTop}px`;
      pill.style.width = `${selected.offsetWidth}px`;
      pill.style.height = `${selected.offsetHeight}px`;
      pill.dataset.kind = selected.dataset.kind ?? '';
      pill.dataset.danger = selected.dataset.isDanger ?? 'false';
      pill.dataset.visible = 'true';
    };

    const onKeyDown = (event: Event) => {
      const { key, repeat } = event as KeyboardEvent;
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        travelNext = !repeat;
      }
    };
    const onPointerMove = () => {
      travelNext = false;
    };

    const mutations = new MutationObserver(place);
    mutations.observe(sizer, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-selected'],
    });
    const resizes = new ResizeObserver(place);
    resizes.observe(sizer);
    // Capture, so the flag is set before cmdk moves the selection.
    root.addEventListener('keydown', onKeyDown, true);
    sizer.addEventListener('pointermove', onPointerMove);
    place();

    return () => {
      mutations.disconnect();
      resizes.disconnect();
      root.removeEventListener('keydown', onKeyDown, true);
      sizer.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <div ref={ref} className={styles.selectionPill} aria-hidden />;
};
