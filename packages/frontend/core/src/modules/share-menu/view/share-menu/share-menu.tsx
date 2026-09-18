import { Button, Menu } from '@affine/component';
import type { WorkspaceMetadata } from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import type { Store } from '@blocksuite/affine/store';
import { ExportIcon } from '@blocksuite/icons/rc';
import type { PropsWithChildren } from 'react';

import * as styles from './index.css';
import { ShareExport } from './share-export';

export interface ShareMenuProps extends PropsWithChildren {
  workspaceMetadata: WorkspaceMetadata;
  currentPage: Store;
  onEnableAffineCloud?: () => void;
  onOpenShareModal?: (open: boolean) => void;
  openPaywallModal?: () => void;
  hittingPaywall?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export enum ShareMenuTab {
  Share = 'share',
  Export = 'export',
  Invite = 'invite',
  Members = 'members',
}

export const ShareMenuContent = (_props: ShareMenuProps) => <ShareExport />;

export const ShareMenu = (props: ShareMenuProps) => {
  const t = useI18n();
  return (
    <Menu
      items={<ShareExport />}
      contentOptions={{
        className: styles.localMenuStyle,
        align: 'end',
        ['data-testid' as string]: 'local-share-menu',
      }}
      rootOptions={{ modal: false, onOpenChange: props.onOpenShareModal }}
    >
      {props.children || (
        <Button
          variant="primary"
          disabled={props.disabled}
          data-testid="local-share-menu-button"
          prefix={<ExportIcon />}
          tooltip={props.disabledReason}
        >
          {t['Export']()}
        </Button>
      )}
    </Menu>
  );
};
