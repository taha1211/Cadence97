import { AppSidebarService } from '@affine/core/modules/app-sidebar';
import { NavigationPanelService } from '@affine/core/modules/navigation-panel';
import { OrganizeService } from '@affine/core/modules/organize';
import { ArrowRightSmallIcon } from '@blocksuite/icons/rc';
import { useService } from '@toeverything/infra';
import { Fragment, useCallback, useMemo } from 'react';

import * as styles from './index.css';

/**
 * The folders a doc lives in, shown before its name in the header. Clicking a
 * folder reveals it in the sidebar. A doc in no folder renders nothing.
 */
export const DocBreadcrumb = ({ docId }: { docId: string }) => {
  const organizeService = useService(OrganizeService);
  const navigationPanelService = useService(NavigationPanelService);
  const appSidebar = useService(AppSidebarService).sidebar;

  const chain = useMemo(
    () => organizeService.folderTree.docFolderChain(docId),
    [organizeService, docId]
  );

  const reveal = useCallback(
    (index: number) => {
      appSidebar.setOpen(true);
      // Sidebar nodes key their collapsed state by the path of ids above
      // them, so open every level from the section down to this folder.
      const path = ['organize'];
      navigationPanelService.setCollapsed(path, false);
      for (const folder of chain.slice(0, index + 1)) {
        path.push(`folder-${folder.id}`);
        navigationPanelService.setCollapsed([...path], false);
      }
      // Wait for the rows to mount before scrolling to the folder.
      const folderId = chain[index].id;
      setTimeout(() => {
        document
          .querySelector(`[data-testid="navigation-panel-folder-${folderId}"]`)
          ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 100);
    },
    [appSidebar, chain, navigationPanelService]
  );

  if (chain.length === 0) return null;

  // The container lays out right to left so it truncates from the left. Its
  // children are therefore listed in reverse.
  return (
    <nav className={styles.breadcrumb} aria-label="Folder path">
      {[...chain.entries()].reverse().map(([index, folder]) => (
        <Fragment key={folder.id}>
          <ArrowRightSmallIcon className={styles.separator} />
          <button
            type="button"
            className={styles.crumb}
            data-testid="doc-breadcrumb-folder"
            onClick={() => reveal(index)}
          >
            {folder.name}
          </button>
        </Fragment>
      ))}
    </nav>
  );
};
