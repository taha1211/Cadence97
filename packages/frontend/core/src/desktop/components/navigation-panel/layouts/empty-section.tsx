import { PlusIcon } from '@blocksuite/icons/rc';
import clsx from 'clsx';
import {
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  type JSX,
  type ReactElement,
  type Ref,
  type SVGAttributes,
  type SVGProps,
} from 'react';

import * as styles from './empty-section.css';

interface NavigationPanelEmptySectionProps extends HTMLAttributes<HTMLDivElement> {
  icon:
    | ((props: SVGProps<SVGSVGElement>) => JSX.Element)
    | ReactElement<SVGAttributes<SVGElement>>;
  message: string;
  messageTestId?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export const NavigationPanelEmptySection = forwardRef(
  function NavigationPanelEmptySection(
    {
      icon: Icon,
      message,
      messageTestId,
      actionText,
      children,
      className,
      onActionClick,
      ...attrs
    }: NavigationPanelEmptySectionProps,
    ref: Ref<HTMLDivElement>
  ) {
    const icon =
      typeof Icon === 'function' ? (
        <Icon className={styles.icon} />
      ) : (
        cloneElement(Icon, { className: styles.icon })
      );

    // One row instead of an icon block. With an action, the whole row is the
    // action; without one, it says how the section gets filled.
    const actionable = !!actionText;
    return (
      <div
        className={clsx(styles.content, className)}
        ref={ref}
        role={actionable ? 'button' : undefined}
        tabIndex={actionable ? 0 : undefined}
        title={actionable ? message : undefined}
        data-actionable={actionable}
        onClick={onActionClick}
        onKeyDown={
          actionable
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onActionClick?.();
                }
              }
            : undefined
        }
        {...attrs}
      >
        {actionable ? <PlusIcon className={styles.icon} /> : icon}
        <div data-testid={messageTestId} className={styles.message}>
          {actionText ?? message}
        </div>
        {children}
      </div>
    );
  }
);
