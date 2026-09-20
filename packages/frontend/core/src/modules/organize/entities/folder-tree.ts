import { Entity, LiveData } from '@toeverything/infra';
import { map } from 'rxjs';

import type { FolderStore } from '../stores/folder';
import { FolderNode } from './folder-node';

export class FolderTree extends Entity {
  constructor(private readonly folderStore: FolderStore) {
    super();
  }

  readonly rootFolder = this.framework.createEntity(FolderNode, {
    id: null,
  });

  isLoading$ = this.folderStore.watchIsLoading();

  /** The folders from the root down to the one holding `docId`. */
  docFolderChain(docId: string) {
    return this.folderStore.getDocFolderChain(docId);
  }

  /** Folder names from the root down to the folder holding `docId`. */
  docFolderPath(docId: string) {
    return this.folderStore.getDocFolderPath(docId);
  }

  // get folder by id
  folderNode$(id: string) {
    return LiveData.from(
      this.folderStore.watchNodeInfo(id).pipe(
        map(info => {
          if (!info) {
            return null;
          }
          return this.framework.createEntity(FolderNode, {
            id,
          });
        })
      ),
      null
    );
  }
}
