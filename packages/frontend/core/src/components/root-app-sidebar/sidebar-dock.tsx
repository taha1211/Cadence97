import { Tooltip } from '@affine/component';
import { WorkbenchLink } from '@affine/core/modules/workbench';
import type { To } from 'history';
import {
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
  type Ref,
} from 'react';

import * as styles from './sidebar-dock.css';

export const SidebarDock = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={styles.dock}
      data-testid="sidebar-dock"
      data-sidebar-region="dock"
    >
      {children}
    </div>
  );
};

export interface SidebarDockItemProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onClick'
> {
  icon: ReactElement;
  /** Shown as the tooltip and read by screen readers. */
  label: string;
  active?: boolean;
  draggedOver?: boolean;
  /** Renders a workbench link instead of a button. */
  to?: To;
  onClick?: () => void;
}

export const SidebarDockItem = forwardRef<HTMLElement, SidebarDockItemProps>(
  function SidebarDockItem(
    { icon, label, active, draggedOver, to, children, ...props },
    ref
  ) {
    const shared = {
      ...props,
      'aria-label': label,
      'data-sidebar-item': true,
      'data-active': active,
      'data-dragged-over': draggedOver,
      className: styles.dockItem,
    };
    return (
      <Tooltip content={label} side="top">
        {to ? (
          <WorkbenchLink
            {...shared}
            to={to}
            ref={ref as Ref<HTMLAnchorElement>}
          >
            {icon}
            {children}
          </WorkbenchLink>
        ) : (
          <button {...shared} type="button" ref={ref as Ref<HTMLButtonElement>}>
            {icon}
            {children}
          </button>
        )}
      </Tooltip>
    );
  }
);
