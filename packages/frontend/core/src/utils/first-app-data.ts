import '../blocksuite/block-suite-editor';

import { DebugLogger } from '@affine/debug';
import { DEFAULT_WORKSPACE_NAME } from '@affine/env/constant';
import { Text } from '@blocksuite/affine/store';

import { initDocFromProps } from '../blocksuite/initialization';
import type { WorkspacesService } from '../modules/workspace';

export async function buildShowcaseWorkspace(
  workspacesService: WorkspacesService,
  flavour: string,
  workspaceName: string
) {
  let defaultDocId: string | undefined;
  // The workspace factory persists this initial collection before publishing
  // its ID. Creating the welcome document here avoids a second sync lifecycle.
  const meta = await workspacesService.create(flavour, async collection => {
    collection.meta.initialize();
    collection.doc.getMap('meta').set('name', workspaceName);
    const doc = collection.createDoc();
    const title = 'Welcome to Cadence97';
    initDocFromProps(
      doc.getStore(),
      {
        paragraph: {
          text: new Text(
            'This is your workspace. Create a document, organize your ideas into folders, or switch to a canvas. Use / while writing to insert blocks. Your work is stored in this browser; use Export to keep a copy of important documents.'
          ),
        },
      },
      { title }
    );
    collection.meta.setDocMeta(doc.id, { title });
    defaultDocId = doc.id;
  });
  return { meta, defaultDocId };
}

const logger = new DebugLogger('createFirstAppData');

let firstAppDataPromise:
  | Promise<Awaited<ReturnType<typeof buildShowcaseWorkspace>>>
  | undefined;

export function createFirstAppData(workspacesService: WorkspacesService) {
  if (workspacesService.list.workspaces$.value.length > 0) {
    return;
  }

  if (
    !BUILD_CONFIG.isMobileEdition &&
    localStorage.getItem('is-first-open') !== null
  ) {
    return;
  }

  firstAppDataPromise ??= buildShowcaseWorkspace(
    workspacesService,
    'local',
    DEFAULT_WORKSPACE_NAME
  ).finally(() => {
    firstAppDataPromise = undefined;
  });

  return firstAppDataPromise.then(({ meta, defaultDocId }) => {
    localStorage.setItem('is-first-open', 'false');
    logger.info('create first workspace', defaultDocId);
    return { meta, defaultPageId: defaultDocId };
  });
}
