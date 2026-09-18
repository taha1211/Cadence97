import type { Workspace } from '@affine/core/modules/workspace';
import type { Store } from '@blocksuite/affine/store';

import { ShareMenu } from './share-menu';
export { CloudSvg } from './cloud-svg';
export { ShareMenuContent } from './share-menu';

export const SharePageButton = ({
  workspace,
  page,
}: {
  workspace: Workspace;
  page: Store;
}) => <ShareMenu workspaceMetadata={workspace.meta} currentPage={page} />;
