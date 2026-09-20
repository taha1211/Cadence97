import { Store } from '@toeverything/infra';

import type { WorkspaceDBService } from '../../db';
import type { FolderFilingChange } from '../types';

export class FolderStore extends Store {
  constructor(private readonly dbService: WorkspaceDBService) {
    super();
  }

  watchNodeInfo(nodeId: string) {
    return this.dbService.db.folders.get$(nodeId);
  }

  watchNodeChildren(parentId: string | null) {
    return this.dbService.db.folders.find$({
      parentId: parentId,
    });
  }

  watchIsLoading() {
    return this.dbService.db.folders.isLoading$;
  }

  /**
   * The folders from the root down to the one holding `docId`, or an empty
   * array when the doc sits in no folder. A doc linked from several folders
   * reports the first link.
   */
  getDocFolderChain(docId: string): { id: string; name: string }[] {
    const link = this.dbService.db.folders.find({
      type: 'doc',
      data: docId,
    })[0];
    const chain: { id: string; name: string }[] = [];
    const visited = new Set<string>();
    let current = link?.parentId;
    while (current && !visited.has(current)) {
      visited.add(current);
      const folder = this.dbService.db.folders.get(current);
      if (!folder) break;
      chain.unshift({ id: folder.id, name: folder.data });
      current = folder.parentId;
    }
    return chain;
  }

  /** Folder names from the root down to the folder holding `docId`. */
  getDocFolderPath(docId: string): string[] {
    return this.getDocFolderChain(docId).map(folder => folder.name);
  }

  isAncestor(childId: string, ancestorId: string): boolean {
    if (childId === ancestorId) {
      return false;
    }
    const history = new Set<string>([childId]);
    let current: string = childId;
    while (current) {
      const info = this.dbService.db.folders.get(current);
      if (info === null || !info.parentId) {
        return false;
      }
      current = info.parentId;
      if (history.has(current)) {
        return false; // loop detected
      }
      history.add(current);
      if (current === ancestorId) {
        return true;
      }
    }
    return false;
  }

  createLink(
    parentId: string,
    type: 'doc' | 'tag' | 'collection',
    nodeId: string,
    index: string
  ) {
    const parent = this.dbService.db.folders.get(parentId);
    if (parent === null || parent.type !== 'folder') {
      throw new Error('Parent folder not found');
    }

    return this.dbService.db.folders.create({
      parentId,
      type,
      data: nodeId,
      index: index,
    }).id;
  }

  fileDoc(
    parentId: string,
    docId: string,
    index: string,
    sourceLinkId?: string
  ): FolderFilingChange | null {
    const folders = this.dbService.db.folders;
    const parent = folders.get(parentId);
    if (!parent || parent.type !== 'folder') {
      throw new Error('Parent folder not found');
    }
    const source = sourceLinkId ? folders.get(sourceLinkId) : null;
    if (
      sourceLinkId &&
      (!source || source.type !== 'doc' || source.data !== docId)
    ) {
      throw new Error('Source document link not found');
    }
    // Filing the same document twice should not create duplicate entries.
    const duplicate = folders
      .find({ parentId, type: 'doc', data: docId })
      .some(link => link.id !== sourceLinkId);
    if (duplicate) return null;

    if (source?.parentId === parentId) {
      const siblings = folders
        .find({ parentId })
        .filter(link => link.id !== source.id);
      const oldPosition = siblings.filter(
        link => link.index < source.index
      ).length;
      const newPosition = siblings.filter(link => link.index < index).length;
      if (oldPosition === newPosition) return null;
    }

    const id = source
      ? source.id
      : this.createLink(parentId, 'doc', docId, index);
    if (source) this.moveNode(id, parentId, index);

    let undone = false;
    return {
      kind: source
        ? source.parentId === parentId
          ? 'reordered'
          : 'moved'
        : 'linked',
      undo: () => {
        if (undone) return false;
        const current = folders.get(id);
        // A later move, reorder, removal, or replacement wins over this Undo.
        if (
          !current ||
          current.type !== 'doc' ||
          current.data !== docId ||
          current.parentId !== parentId ||
          current.index !== index
        )
          return false;
        if (source) {
          const originalParent =
            source.parentId && folders.get(source.parentId);
          if (!originalParent || originalParent.type !== 'folder') return false;
          if (
            folders
              .find({ parentId: source.parentId, type: 'doc', data: docId })
              .some(link => link.id !== id)
          )
            return false;
          this.moveNode(id, source.parentId ?? null, source.index);
        } else {
          this.removeLink(id);
        }
        undone = true;
        return true;
      },
    };
  }

  removeDocLink(linkId: string, parentId: string | null): FolderFilingChange {
    const folders = this.dbService.db.folders;
    const original = folders.get(linkId);
    if (
      !original ||
      original.type !== 'doc' ||
      original.parentId !== parentId
    ) {
      throw new Error('Document link not found');
    }
    this.removeLink(linkId);
    let undone = false;
    return {
      kind: 'removed',
      undo: () => {
        if (undone || folders.get(linkId)) return false;
        const parent = original.parentId && folders.get(original.parentId);
        if (!parent || parent.type !== 'folder') return false;
        if (
          folders.find({
            parentId: parent.id,
            type: 'doc',
            data: original.data,
          }).length
        )
          return false;
        // Restore just the removed reference, keeping its identity and order.
        folders.create(original);
        undone = true;
        return true;
      },
    };
  }

  renameNode(nodeId: string, name: string) {
    const node = this.dbService.db.folders.get(nodeId);
    if (node === null) {
      throw new Error('Node not found');
    }
    if (node.type !== 'folder') {
      throw new Error('Cannot rename non-folder node');
    }
    this.dbService.db.folders.update(nodeId, {
      data: name,
    });
  }

  createFolder(parentId: string | null, name: string, index: string) {
    if (parentId) {
      const parent = this.dbService.db.folders.get(parentId);
      if (parent === null || parent.type !== 'folder') {
        throw new Error('Parent folder not found');
      }
    }

    return this.dbService.db.folders.create({
      parentId: parentId,
      type: 'folder',
      data: name,
      index: index,
    }).id;
  }

  removeFolder(folderId: string) {
    const info = this.dbService.db.folders.get(folderId);
    if (info === null || info.type !== 'folder') {
      throw new Error('Folder not found');
    }
    const stack = [info];
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) {
        continue;
      }
      if (current.type !== 'folder') {
        this.dbService.db.folders.delete(current.id);
      } else {
        const children = this.dbService.db.folders.find({
          parentId: current.id,
        });
        stack.push(...children);
        this.dbService.db.folders.delete(current.id);
      }
    }
  }

  removeLink(linkId: string) {
    const link = this.dbService.db.folders.get(linkId);
    if (link === null || link.type === 'folder') {
      throw new Error('Link not found');
    }
    this.dbService.db.folders.delete(linkId);
  }

  moveNode(nodeId: string, parentId: string | null, index: string) {
    const node = this.dbService.db.folders.get(nodeId);
    if (node === null) {
      throw new Error('Node not found');
    }

    if (parentId) {
      if (nodeId === parentId) {
        throw new Error('Cannot move a node to itself');
      }
      if (this.isAncestor(parentId, nodeId)) {
        throw new Error('Cannot move a node to its descendant');
      }
      const parent = this.dbService.db.folders.get(parentId);
      if (parent === null || parent.type !== 'folder') {
        throw new Error('Parent folder not found');
      }
    } else {
      if (node.type !== 'folder') {
        throw new Error('Root node can only have folders');
      }
    }
    this.dbService.db.folders.update(nodeId, {
      parentId,
      index,
    });
  }
}
