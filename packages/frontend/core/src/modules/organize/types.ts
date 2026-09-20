export interface NodeInfo {
  id: string;
  parentId: string | null;
  type: 'folder' | 'doc' | 'tag' | 'collection';
  data: string;
  index: string;
}

/** A narrow inverse of a folder-entry change, never a workspace snapshot. */
export interface FolderFilingChange {
  kind: 'linked' | 'moved' | 'reordered' | 'removed';
  /** False when a later edit makes this inverse unsafe. */
  undo: () => boolean;
}
