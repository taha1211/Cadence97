import { i18nTime, isI18nString, useI18n } from '@affine/i18n';
import clsx from 'clsx';
import { Command } from 'cmdk';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { QuickSearchGroup } from '../types/group';
import type { QuickSearchItem } from '../types/item';
import * as styles from './cmdk.css';
import { HighlightText } from './highlight-text';
import { SelectionPill } from './selection-pill';

type Groups = { group?: QuickSearchGroup; items: QuickSearchItem[] }[];

type ItemKind =
  | 'doc'
  | 'navigation'
  | 'command'
  | 'settings'
  | 'tag'
  | 'collection'
  | 'create';

// Picks the shape of a result's icon tile. Ids are namespaced by the session
// that produced them, and commands carry their category in the group id.
const itemKind = (item: QuickSearchItem): ItemKind => {
  if (item.id.startsWith('creation:')) return 'create';
  if (item.id.startsWith('collection:')) return 'collection';
  if (item.id.startsWith('tag:')) return 'tag';
  if (item.id.startsWith('command:')) {
    if (item.group?.id === 'command:affine:navigation') return 'navigation';
    if (item.group?.id === 'command:affine:settings') return 'settings';
    return 'command';
  }
  return 'doc';
};

const EMPTY_GROUPS: Groups = [];

export type SubmitOptions = {
  /** Open beside the current view (desktop) or in a new tab (web). */
  aside?: boolean;
};

const FILTERS = ['all', 'docs', 'commands', 'tags'] as const;
type Filter = (typeof FILTERS)[number];

const DOC_SOURCES = new Set([
  'docs',
  'recent-doc',
  'link',
  'creation',
  'collections',
]);
const matchesFilter = (item: QuickSearchItem, filter: Filter) => {
  if (filter === 'all') return true;
  if (filter === 'docs') return DOC_SOURCES.has(item.source);
  if (filter === 'commands') return item.source === 'commands';
  return item.source === 'tags';
};

const NAVIGATION_GROUP = 'command:affine:navigation';
// With nothing typed, the full command list buries the recent docs. Show a
// few navigation commands and leave the rest to the Commands filter.
const MAX_IDLE_NAVIGATION = 4;

const shapeGroups = (groups: Groups, query: string, filter: Filter) => {
  let shaped = groups
    .map(({ group, items }) => ({
      group,
      items: items.filter(item => matchesFilter(item, filter)),
    }))
    .filter(({ items }) => items.length > 0);

  if (!query.trim() && filter === 'all') {
    shaped = shaped
      .filter(
        ({ group }) =>
          !group?.id.startsWith('command:') || group.id === NAVIGATION_GROUP
      )
      .map(({ group, items }) =>
        group?.id === NAVIGATION_GROUP
          ? { group, items: items.slice(0, MAX_IDLE_NAVIGATION) }
          : { group, items }
      );
  }

  return shaped;
};

export const CMDK = ({
  className,
  query,
  groups: newGroups = EMPTY_GROUPS,
  error,
  inputLabel,
  placeholder,
  loading: newLoading = false,
  loadingProgress,
  showFilters = false,
  onQueryChange,
  onSubmit,
}: React.PropsWithChildren<{
  className?: string;
  query: string;
  error?: ReactNode;
  inputLabel?: ReactNode;
  placeholder?: string;
  loading?: boolean;
  loadingProgress?: number;
  groups?: Groups;
  /** The main palette offers filter chips; pickers with one job do not. */
  showFilters?: boolean;
  onSubmit?: (item: QuickSearchItem, options?: SubmitOptions) => void;
  onQueryChange?: (query: string) => void;
}>) => {
  const t = useI18n();
  const [opening, setOpening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  // Whether the submit in flight asked to open aside. cmdk's `onSelect` gets
  // no event, so the key and pointer handlers record the modifier first.
  const asideRef = useRef(false);

  const shapedGroups = useMemo(
    () => shapeGroups(newGroups, query, showFilters ? filter : 'all'),
    [newGroups, query, filter, showFilters]
  );

  const [{ groups, selectedValue }, dispatch] = useReducer(
    (
      state: {
        groups: Groups;
        selectedValue: string;
      },
      action:
        | { type: 'select'; payload: string }
        | { type: 'reset-select' }
        | { type: 'update-groups'; payload: Groups }
    ) => {
      // control the currently selected item so that when the item list changes, the selected item remains controllable
      if (action.type === 'select') {
        return {
          ...state,
          selectedValue: action.payload,
        };
      }
      if (action.type === 'reset-select') {
        // reset selected item to the first item
        const firstItem = state.groups.at(0)?.items.at(0)?.id;
        return {
          ...state,
          selectedValue: firstItem ?? '',
        };
      }
      if (action.type === 'update-groups') {
        const prevGroups = state.groups;
        const prevSelectedValue = state.selectedValue;

        const prevFirstItem = prevGroups.at(0)?.items.at(0)?.id;
        const newFirstItem = action.payload.at(0)?.items.at(0)?.id;
        const isSelectingFirstItem = prevSelectedValue === prevFirstItem;
        // if previous selected item is the first item, select the new first item
        if (isSelectingFirstItem) {
          return {
            ...state,
            groups: action.payload,
            selectedValue: newFirstItem ?? '',
          };
        }

        const selectedExists = state.groups.some(({ items }) =>
          items.some(item => item.id === prevSelectedValue)
        );
        // if previous selected item exists in the new list, keep it
        if (selectedExists) {
          return {
            ...state,
            groups: action.payload,
            selectedValue: prevSelectedValue,
          };
        }

        // if previous selected item does not exist in the new list, select the new first item
        return {
          ...state,
          groups: action.payload,
          selectedValue: newFirstItem ?? '',
        };
      }
      return state;
    },
    { groups: [], selectedValue: '' }
  );

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // fix list height animation on opening
  useLayoutEffect(() => {
    setOpening(true);
    const timeout = setTimeout(() => {
      setOpening(false);
      inputRef.current?.focus();
    }, 150);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleValueChange = useCallback(
    (query: string) => {
      onQueryChange?.(query);
      dispatch({
        type: 'reset-select',
      });
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = 0;
      });
    },
    [onQueryChange]
  );

  const handleSelectChange = useCallback(
    (value: string) => {
      dispatch({
        type: 'select',
        payload: value,
      });
    },
    [dispatch]
  );

  const handleKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        asideRef.current = event.metaKey || event.ctrlKey;
      }
      if (event.key === 'Tab' && showFilters) {
        // Tab walks the filter chips. The input is the only other focusable
        // thing in the palette, so nothing is lost.
        event.preventDefault();
        setFilter(current => {
          const step = event.shiftKey ? FILTERS.length - 1 : 1;
          return FILTERS[(FILTERS.indexOf(current) + step) % FILTERS.length];
        });
        dispatch({ type: 'reset-select' });
      }
    },
    [showFilters]
  );
  const handlePointerDownCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      asideRef.current = event.metaKey || event.ctrlKey;
    },
    []
  );
  const handleSubmit = useCallback(
    (item: QuickSearchItem) => {
      onSubmit?.(item, { aside: asideRef.current });
      asideRef.current = false;
    },
    [onSubmit]
  );

  const selectedItem = useMemo(
    () =>
      groups
        .flatMap(({ items }) => items)
        .find(item => item.id === selectedValue),
    [groups, selectedValue]
  );
  // Live preview for items that offer one, such as accent colours. The cleanup
  // covers both moving on and closing the palette.
  useEffect(() => selectedItem?.preview?.(), [selectedItem]);

  const resultCount = useMemo(
    () => groups.reduce((count, { items }) => count + items.length, 0),
    [groups]
  );
  const onlyCreation =
    groups.length > 0 && groups.every(({ group }) => group?.id === 'creation');
  const showEmpty = !!query.trim() && (groups.length === 0 || onlyCreation);

  useEffect(() => {
    // on group change
    dispatch({
      type: 'update-groups',
      payload: shapedGroups,
    });
  }, [shapedGroups]);

  useEffect(() => {
    // Wait before showing the progress line, so fast searches never flash it.
    // Hide it the moment loading ends.
    if (!newLoading) {
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => setLoading(true), 400);
    return () => clearTimeout(timeout);
  }, [newLoading]);

  return (
    <Command
      data-testid="cmdk-quick-search"
      shouldFilter={false}
      className={clsx(className, styles.root, styles.panelContainer)}
      value={selectedValue}
      onValueChange={handleSelectChange}
      onKeyDownCapture={handleKeyDownCapture}
      onPointerDownCapture={handlePointerDownCapture}
      loop
    >
      {inputLabel ? (
        <div className={styles.pageTitleWrapper}>
          <span className={styles.pageTitle}>{inputLabel}</span>
        </div>
      ) : null}
      <div
        className={clsx(className, styles.searchInputContainer, {
          [styles.hasInputLabel]: inputLabel,
        })}
      >
        <Command.Input
          placeholder={placeholder}
          ref={inputRef}
          value={query}
          onValueChange={handleValueChange}
          className={clsx(className, styles.searchInput)}
        />
        <div
          className={styles.progressLine}
          data-loading={loading}
          data-determinate={loadingProgress ? true : undefined}
          style={
            loadingProgress
              ? ({
                  '--progress': `${Math.max(loadingProgress, 0.2) * 100}%`,
                } as CSSProperties)
              : undefined
          }
        />
      </div>

      {showFilters ? (
        <div className={styles.filters} role="tablist">
          {FILTERS.map(value => (
            <button
              key={value}
              type="button"
              role="tab"
              // The input keeps focus, so typing never stops.
              tabIndex={-1}
              aria-selected={filter === value}
              className={styles.filterChip}
              data-testid={`cmdk-filter-${value}`}
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                setFilter(value);
                dispatch({ type: 'reset-select' });
              }}
            >
              {t[`com.affine.cmdk.filter.${value}`]()}
            </button>
          ))}
        </div>
      ) : null}

      <Command.List ref={listRef} data-opening={opening ? true : undefined}>
        <SelectionPill />
        {error && <p className={styles.errorMessage}>{error}</p>}
        {showEmpty ? (
          <p className={styles.emptyMessage}>{t['com.affine.cmdk.empty']()}</p>
        ) : null}
        {groups.map(({ group, items }) => {
          return (
            <CMDKGroup
              key={group?.id ?? ''}
              onSubmit={handleSubmit}
              query={query + ':' + filter}
              group={{ group, items }}
            />
          );
        })}
      </Command.List>
      <div className={styles.visuallyHidden} role="status" aria-live="polite">
        {t['com.affine.cmdk.result-count']({ count: String(resultCount) })}
      </div>
      <CMDKFooter
        showFilters={showFilters}
        // Pickers that borrow the palette decide what a pick means, so only
        // the main palette offers the open-aside shortcut.
        canOpenAside={
          showFilters &&
          (selectedItem?.source === 'docs' ||
            selectedItem?.source === 'recent-doc')
        }
      />
    </Command>
  );
};

const CMDKFooter = ({
  showFilters,
  canOpenAside,
}: {
  showFilters: boolean;
  canOpenAside: boolean;
}) => {
  const t = useI18n();
  return (
    <div className={styles.footer} aria-hidden="true">
      <span className={styles.footerHint}>
        <CMDKKeyBinding keyBinding="ArrowUp+ArrowDown" />
        {t['com.affine.cmdk.hint.move']()}
      </span>
      <span className={styles.footerHint}>
        <CMDKKeyBinding keyBinding="↵" />
        {t['com.affine.cmdk.hint.open']()}
      </span>
      {canOpenAside ? (
        <span className={styles.footerHint}>
          <CMDKKeyBinding keyBinding="$mod+↵" />
          {BUILD_CONFIG.isElectron
            ? t['com.affine.cmdk.hint.split']()
            : t['com.affine.cmdk.hint.new-tab']()}
        </span>
      ) : null}
      {showFilters ? (
        <span className={styles.footerHint}>
          <CMDKKeyBinding keyBinding="tab" />
          {t['com.affine.cmdk.hint.filter']()}
        </span>
      ) : null}
      <span className={styles.footerSpacer} />
      <span className={styles.footerHint}>
        <CMDKKeyBinding keyBinding="esc" />
        {t['com.affine.cmdk.hint.close']()}
      </span>
    </div>
  );
};

export const CMDKGroup = ({
  group: { group, items },
  onSubmit,
  query,
}: {
  group: { group?: QuickSearchGroup; items: QuickSearchItem[] };
  onSubmit?: (item: QuickSearchItem) => void;
  query: string;
}) => {
  const i18n = useI18n();
  return (
    <Command.Group
      key={query + ':' + (group?.id ?? '')}
      heading={group && i18n.t(group.label)}
      style={{ overflowAnchor: 'none' }}
    >
      {items.map(item => {
        const [title, subTitle] = isI18nString(item.label)
          ? [i18n.t(item.label), null]
          : [
              i18n.t(item.label.title),
              item.label.subTitle ? i18n.t(item.label.subTitle) : null,
            ];

        const kind = itemKind(item);
        return (
          <Command.Item
            key={item.id}
            onSelect={() => onSubmit?.(item)}
            value={item.id}
            disabled={item.disabled}
            data-kind={kind}
            data-is-danger={
              item.id === 'editor:page-move-to-trash' ||
              item.id === 'editor:edgeless-move-to-trash'
            }
          >
            <div className={styles.itemIcon} data-kind={kind}>
              {item.icon &&
                (typeof item.icon === 'function' ? <item.icon /> : item.icon)}
            </div>
            <div
              data-testid="cmdk-label"
              className={styles.itemLabel}
              data-value={item.id}
            >
              <div className={styles.itemTitle}>
                <HighlightText text={title} start="<b>" end="</b>" />
              </div>
              {(item.location || subTitle) && (
                <div className={styles.itemSubtitle}>
                  {item.location ? (
                    <span className={styles.itemLocation}>{item.location}</span>
                  ) : null}
                  {subTitle && (
                    <HighlightText text={subTitle} start="<b>" end="</b>" />
                  )}
                </div>
              )}
            </div>
            {item.timestamp ? (
              <div className={styles.timestamp}>
                {i18nTime(new Date(item.timestamp))}
              </div>
            ) : null}
            {item.keyBinding ? (
              <CMDKKeyBinding keyBinding={item.keyBinding} />
            ) : null}
          </Command.Item>
        );
      })}
    </Command.Group>
  );
};

const CMDKKeyBinding = ({ keyBinding }: { keyBinding: string }) => {
  const isMacOS = environment.isMacOs;
  const fragments = useMemo(() => {
    return keyBinding.split('+').map(fragment => {
      if (fragment === '$mod') {
        return isMacOS ? '⌘' : 'Ctrl';
      }
      if (fragment === 'Alt') {
        return isMacOS ? '⌥' : 'Alt';
      }
      if (fragment.startsWith('Key')) {
        return fragment.slice(3);
      }
      if (fragment === 'ArrowUp') {
        return '↑';
      }
      if (fragment === 'ArrowDown') {
        return '↓';
      }
      if (fragment === 'ArrowLeft') {
        return '←';
      }
      if (fragment === 'ArrowRight') {
        return '→';
      }
      return fragment;
    });
  }, [isMacOS, keyBinding]);

  return (
    <div className={styles.keybinding}>
      {fragments.map(fragment => {
        return (
          <div key={fragment} className={styles.keybindingFragment}>
            {fragment}
          </div>
        );
      })}
    </div>
  );
};
