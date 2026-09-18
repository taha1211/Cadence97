import type { useI18n } from '@affine/i18n';
import { InformationIcon } from '@blocksuite/icons/rc';

import type { WorkspaceDialogService } from '../modules/dialogs';
import type { UrlService } from '../modules/url';
import { registerAffineCommand } from './registry';

export function registerAffineHelpCommands({
  workspaceDialogService,
}: {
  t: ReturnType<typeof useI18n>;
  urlService: UrlService;
  workspaceDialogService: WorkspaceDialogService;
}) {
  return registerAffineCommand({
    id: 'cadence:about',
    category: 'affine:help',
    icon: <InformationIcon />,
    label: 'About Cadence97',
    run: () => {
      workspaceDialogService.open('setting', { activeTab: 'about' });
    },
  });
}
