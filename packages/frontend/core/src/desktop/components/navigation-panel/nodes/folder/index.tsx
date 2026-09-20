import {
  AnimatedCollectionsIcon,
  AnimatedFolderIcon,
  type DropTargetDropEvent,
  type DropTargetOptions,
  IconButton,
  MenuItem,
  MenuSeparator,
  MenuSub,
  notify,
} from '@affine/component';
import { usePageHelper } from '@affine/core/blocksuite/block-suite-page-list/utils';
import { WorkspaceDialogService } from '@affine/core/modules/dialogs';
import { DocsService } from '@affine/core/modules/doc';
import { CompatibleFavoriteItemsAdapter } from '@affine/core/modules/favorite';
import { FeatureFlagService } from '@affine/core/modules/feature-flag';
import { NavigationPanelService } from '@affine/core/modules/navigation-panel';
import {
  type FolderNode,
  OrganizeService,
} from '@affine/core/modules/organize';
import type { FolderFilingChange } from '@affine/core/modules/organize/types';
import { WorkspaceService } from '@affine/core/modules/workspace';
import type { AffineDNDData } from '@affine/core/types/dnd';
import { Unreachable } from '@affine/env/constant';
import { useI18n } from '@affine/i18n';
import { track } from '@affine/track';
import {
  DeleteIcon,
  FolderIcon,
  PageIcon,
  PlusIcon,
  PlusThickIcon,
  RemoveFolderIcon,
  TagsIcon,
} from '@blocksuite/icons/rc';
import { useLiveData, useService, useServices } from '@toeverything/infra';
import { difference } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

import {
  NavigationPanelTreeNode,
  type NavigationPanelTreeNodeDropEffect,
} from '../../tree';
import type { NavigationPanelTreeNodeIcon } from '../../tree/node';
import type { NodeOperation } from '../../tree/types';
import { NavigationPanelCollectionNode } from '../collection';
import { NavigationPanelDocNode } from '../doc';
import { NavigationPanelTagNode } from '../tag';
import type { GenericNavigationPanelNode } from '../types';
import { FolderEmpty } from './empty';
import { useFilingFeedback } from './filing-feedback';
import { FavoriteFolderOperation } from './operations';

export const NavigationPanelFolderNode = ({
  nodeId,
  onDrop,
  defaultRenaming,
  operations,
  location,
  dropEffect,
  canDrop,
  reorderable,
  parentPath,
}: {
  defaultRenaming?: boolean;
  nodeId: string;
  onDrop?: (data: DropTargetDropEvent<AffineDNDData>, node: FolderNode) => void;
  operations?:
    | NodeOperation[]
    | ((type: string, node: FolderNode) => NodeOperation[]);
} & Omit<GenericNavigationPanelNode, 'operations'>) => {
  const { organizeService } = useServices({
    OrganizeService,
  });
  const node = useLiveData(organizeService.folderTree.folderNode$(nodeId));
  const type = useLiveData(node?.type$);
  const data = useLiveData(node?.data$);
  const handleDrop = useCallback(
    (data: DropTargetDropEvent<AffineDNDData>) => {
      if (!node) {
        return;
      }
      onDrop?.(data, node);
    },
    [node, onDrop]
  );
  const additionalOperations = useMemo(() => {
    if (!type || !node) {
      return;
    }
    if (typeof operations === 'function') {
      return operations(type, node);
    }
    return operations;
  }, [node, operations, type]);

  if (!node) {
    return;
  }

  if (type === 'folder') {
    return (
      <NavigationPanelFolderNodeFolder
        node={node}
        onDrop={handleDrop}
        defaultRenaming={defaultRenaming}
        operations={additionalOperations}
        dropEffect={dropEffect}
        reorderable={reorderable}
        canDrop={canDrop}
        parentPath={parentPath}
      />
    );
  } else if (type === 'doc') {
    return (
      data && (
        <NavigationPanelDocNode
          docId={data}
          location={location}
          onDrop={handleDrop}
          reorderable={reorderable}
          canDrop={canDrop}
          dropEffect={dropEffect}
          operations={additionalOperations}
          parentPath={parentPath}
        />
      )
    );
  } else if (type === 'collection') {
    return (
      data && (
        <NavigationPanelCollectionNode
          collectionId={data}
          location={location}
          onDrop={handleDrop}
          canDrop={canDrop}
          reorderable={reorderable}
          dropEffect={dropEffect}
          operations={additionalOperations}
          parentPath={parentPath}
        />
      )
    );
  } else if (type === 'tag') {
    return (
      data && (
        <NavigationPanelTagNode
          tagId={data}
          location={location}
          onDrop={handleDrop}
          canDrop={canDrop}
          reorderable
          dropEffect={dropEffect}
          operations={additionalOperations}
          parentPath={parentPath}
        />
      )
    );
  }

  return;
};

// Define outside the `NavigationPanelFolderNodeFolder` to avoid re-render(the close animation won't play)
const NavigationPanelFolderIcon: NavigationPanelTreeNodeIcon = ({
  collapsed,
  className,
  draggedOver,
  treeInstruction,
}) => (
  <AnimatedFolderIcon
    className={className}
    open={
      !collapsed || (!!draggedOver && treeInstruction?.type === 'make-child')
    }
  />
);

const NavigationPanelFolderNodeFolder = ({
  node,
  onDrop,
  defaultRenaming,
  location,
  operations: additionalOperations,
  canDrop,
  dropEffect,
  reorderable,
  parentPath,
}: {
  defaultRenaming?: boolean;
  node: FolderNode;
} & GenericNavigationPanelNode) => {
  const t = useI18n();
  const { workspaceService, featureFlagService, workspaceDialogService } =
    useServices({
      WorkspaceService,
      CompatibleFavoriteItemsAdapter,
      FeatureFlagService,
      WorkspaceDialogService,
    });
  const navigationPanelService = useService(NavigationPanelService);
  const name = useLiveData(node.name$);
  const docsService = useService(DocsService);
  const { showFeedback, acknowledgment } = useFilingFeedback(
    workspaceService.workspace.id,
    name
  );
  const enableEmojiIcon = useLiveData(
    featureFlagService.flags.enable_emoji_folder_icon.$
  );
  const path = useMemo(
    () => [...(parentPath ?? []), `folder-${node.id}`],
    [parentPath, node.id]
  );
  const collapsed = useLiveData(navigationPanelService.collapsed$(path));
  const setCollapsed = useCallback(
    (value: boolean) => {
      navigationPanelService.setCollapsed(path, value);
    },
    [navigationPanelService, path]
  );
  const [newFolderId, setNewFolderId] = useState<string | null>(null);

  const { createPage } = usePageHelper(
    workspaceService.workspace.docCollection
  );
  const handleDelete = useCallback(() => {
    node.delete();
    track.$.navigationPanel.organize.deleteOrganizeItem({
      type: 'folder',
    });
    notify.success({
      title: t['com.affine.rootAppSidebar.organize.delete.notify-title']({
        name,
      }),
      message: t['com.affine.rootAppSidebar.organize.delete.notify-message'](),
    });
  }, [name, node, t]);

  const children = useLiveData(node.sortedChildren$);

  const dndData = useMemo(() => {
    if (!node.id) {
      throw new Unreachable();
    }
    return {
      draggable: {
        entity: {
          type: 'folder',
          id: node.id,
        },
        from: location,
      },
      dropTarget: {
        at: 'navigation-panel:organize:folder',
      },
    } satisfies AffineDNDData;
  }, [location, node.id]);

  const handleRename = useCallback(
    (newName: string) => {
      node.rename(newName);
    },
    [node]
  );

  const fileDocument = useCallback(
    (data: DropTargetDropEvent<AffineDNDData>, index: string) => {
      const entity = data.source.data.entity;
      if (entity?.type !== 'doc') return;
      const from = data.source.data.from;
      try {
        const change = node.fileDoc(
          entity.id,
          index,
          from?.at === 'navigation-panel:organize:folder-node'
            ? from.nodeId
            : undefined
        );
        showFeedback(
          change ? [change] : [],
          docsService.list.doc$(entity.id).value?.title$.value || t.Untitled(),
          true
        );
        if (change) {
          setCollapsed(false);
          if (change.kind === 'linked') {
            track.$.navigationPanel.organize.createOrganizeItem({
              type: 'link',
              target: 'doc',
            });
          } else {
            track.$.navigationPanel.organize.moveOrganizeItem({
              type: 'link',
              target: 'doc',
            });
          }
        }
      } catch (error) {
        console.error('Could not file document', error);
        notify.error({ title: t['com.affine.filing.failed']() });
      }
    },
    [docsService, node, setCollapsed, showFeedback, t]
  );

  const handleDropOnFolder = useCallback(
    (data: DropTargetDropEvent<AffineDNDData>) => {
      if (data.source.data.entity?.type) {
        track.$.navigationPanel.folders.drop({
          type: data.source.data.entity.type,
        });
      }
      if (data.treeInstruction?.type === 'make-child') {
        if (data.source.data.entity?.type === 'doc') {
          fileDocument(data, node.indexAt('before'));
          return;
        }
        if (data.source.data.entity?.type === 'folder') {
          if (
            node.id === data.source.data.entity.id ||
            node.beChildOf(data.source.data.entity.id)
          ) {
            return;
          }
          node.moveHere(data.source.data.entity.id, node.indexAt('before'));
          track.$.navigationPanel.organize.moveOrganizeItem({ type: 'folder' });
        } else if (
          data.source.data.entity?.type === 'collection' ||
          data.source.data.entity?.type === 'tag'
        ) {
          if (
            data.source.data.from?.at ===
            'navigation-panel:organize:folder-node'
          ) {
            node.moveHere(data.source.data.from.nodeId, node.indexAt('before'));
            track.$.navigationPanel.organize.moveOrganizeItem({
              type: 'link',
              target: data.source.data.entity?.type,
            });
          } else {
            node.createLink(
              data.source.data.entity?.type,
              data.source.data.entity.id,
              node.indexAt('before')
            );
            track.$.navigationPanel.organize.createOrganizeItem({
              type: 'link',
              target: data.source.data.entity?.type,
            });
          }
        }
      } else {
        onDrop?.(data);
      }
    },
    [fileDocument, node, onDrop]
  );

  const handleDropEffect = useCallback<NavigationPanelTreeNodeDropEffect>(
    data => {
      if (data.treeInstruction?.type === 'make-child') {
        if (data.source.data.entity?.type === 'folder') {
          if (
            node.id === data.source.data.entity.id ||
            node.beChildOf(data.source.data.entity.id)
          ) {
            return;
          }
          return { effect: 'move', destination: name };
        } else if (
          data.source.data.from?.at === 'navigation-panel:organize:folder-node'
        ) {
          return { effect: 'move', destination: name };
        } else if (
          data.source.data.entity?.type === 'collection' ||
          data.source.data.entity?.type === 'doc' ||
          data.source.data.entity?.type === 'tag'
        ) {
          return { effect: 'link', destination: name };
        }
      } else {
        return dropEffect?.(data);
      }
      return;
    },
    [dropEffect, name, node]
  );

  const handleDropOnPlaceholder = useCallback(
    (data: DropTargetDropEvent<AffineDNDData>) => {
      if (data.source.data.entity?.type) {
        track.$.navigationPanel.folders.drop({
          type: data.source.data.entity.type,
        });
      }
      if (data.source.data.entity?.type === 'doc') {
        fileDocument(data, node.indexAt('before'));
        return;
      }
      if (data.source.data.entity?.type === 'folder') {
        if (
          node.id === data.source.data.entity.id ||
          node.beChildOf(data.source.data.entity.id)
        ) {
          return;
        }
        node.moveHere(data.source.data.entity.id, node.indexAt('before'));
        track.$.navigationPanel.organize.moveOrganizeItem({ type: 'folder' });
      } else if (
        data.source.data.entity?.type === 'collection' ||
        data.source.data.entity?.type === 'tag'
      ) {
        if (
          data.source.data.from?.at === 'navigation-panel:organize:folder-node'
        ) {
          node.moveHere(data.source.data.from.nodeId, node.indexAt('before'));
          track.$.navigationPanel.organize.moveOrganizeItem({
            type: data.source.data.entity?.type,
          });
        } else {
          node.createLink(
            data.source.data.entity?.type,
            data.source.data.entity.id,
            node.indexAt('before')
          );
          track.$.navigationPanel.organize.createOrganizeItem({
            type: 'link',
            target: data.source.data.entity?.type,
          });
        }
      }
    },
    [fileDocument, node]
  );

  const handleDropOnChildren = useCallback(
    (data: DropTargetDropEvent<AffineDNDData>, dropAtNode?: FolderNode) => {
      if (!dropAtNode || !dropAtNode.id) {
        return;
      }
      if (data.source.data.entity?.type) {
        track.$.navigationPanel.folders.drop({
          type: data.source.data.entity.type,
        });
      }
      if (
        data.treeInstruction?.type === 'reorder-above' ||
        data.treeInstruction?.type === 'reorder-below'
      ) {
        const at =
          data.treeInstruction?.type === 'reorder-below' ? 'after' : 'before';
        if (data.source.data.entity?.type === 'doc') {
          fileDocument(data, node.indexAt(at, dropAtNode.id));
          return;
        }
        if (data.source.data.entity?.type === 'folder') {
          if (
            node.id === data.source.data.entity.id ||
            node.beChildOf(data.source.data.entity.id)
          ) {
            return;
          }
          node.moveHere(
            data.source.data.entity.id,
            node.indexAt(at, dropAtNode.id)
          );
          track.$.navigationPanel.organize.moveOrganizeItem({ type: 'folder' });
        } else if (
          data.source.data.entity?.type === 'collection' ||
          data.source.data.entity?.type === 'tag'
        ) {
          if (
            data.source.data.from?.at ===
            'navigation-panel:organize:folder-node'
          ) {
            node.moveHere(
              data.source.data.from.nodeId,
              node.indexAt(at, dropAtNode.id)
            );
            track.$.navigationPanel.organize.moveOrganizeItem({
              type: 'link',
              target: data.source.data.entity?.type,
            });
          } else {
            node.createLink(
              data.source.data.entity?.type,
              data.source.data.entity.id,
              node.indexAt(at, dropAtNode.id)
            );

            track.$.navigationPanel.organize.createOrganizeItem({
              type: 'link',
              target: data.source.data.entity?.type,
            });
          }
        }
      } else if (data.treeInstruction?.type === 'reparent') {
        const currentLevel = data.treeInstruction.currentLevel;
        const desiredLevel = data.treeInstruction.desiredLevel;
        if (currentLevel === desiredLevel + 1) {
          onDrop?.({
            ...data,
            treeInstruction: {
              type: 'reorder-below',
              currentLevel,
              indentPerLevel: data.treeInstruction.indentPerLevel,
            },
          });
          return;
        } else {
          onDrop?.({
            ...data,
            treeInstruction: {
              ...data.treeInstruction,
              currentLevel: currentLevel - 1,
            },
          });
        }
      }
    },
    [fileDocument, node, onDrop]
  );

  const handleDropEffectOnChildren =
    useCallback<NavigationPanelTreeNodeDropEffect>(
      data => {
        if (
          data.treeInstruction?.type === 'reorder-above' ||
          data.treeInstruction?.type === 'reorder-below'
        ) {
          if (data.source.data.entity?.type === 'folder') {
            if (
              node.id === data.source.data.entity.id ||
              node.beChildOf(data.source.data.entity.id)
            ) {
              return;
            }
            return { effect: 'move', destination: name };
          } else if (
            data.source.data.from?.at ===
            'navigation-panel:organize:folder-node'
          ) {
            return { effect: 'move', destination: name };
          } else if (
            data.source.data.entity?.type === 'collection' ||
            data.source.data.entity?.type === 'doc' ||
            data.source.data.entity?.type === 'tag'
          ) {
            return { effect: 'link', destination: name };
          }
        } else if (data.treeInstruction?.type === 'reparent') {
          const currentLevel = data.treeInstruction.currentLevel;
          const desiredLevel = data.treeInstruction.desiredLevel;
          if (currentLevel === desiredLevel + 1) {
            dropEffect?.({
              ...data,
              treeInstruction: {
                type: 'reorder-below',
                currentLevel,
                indentPerLevel: data.treeInstruction.indentPerLevel,
              },
            });
            return;
          } else {
            dropEffect?.({
              ...data,
              treeInstruction: {
                ...data.treeInstruction,
                currentLevel: currentLevel - 1,
              },
            });
          }
        }
        return;
      },
      [dropEffect, name, node]
    );

  const handleCanDrop = useMemo<DropTargetOptions<AffineDNDData>['canDrop']>(
    () => args => {
      const entityType = args.source.data.entity?.type;
      if (args.treeInstruction && args.treeInstruction?.type !== 'make-child') {
        return (
          (typeof canDrop === 'function' ? canDrop(args) : canDrop) ?? true
        );
      }

      if (args.source.data.entity?.type === 'folder') {
        if (
          node.id === args.source.data.entity.id ||
          node.beChildOf(args.source.data.entity.id)
        ) {
          return false;
        }
        return true;
      } else if (
        args.source.data.from?.at === 'navigation-panel:organize:folder-node'
      ) {
        return true;
      } else if (
        entityType === 'collection' ||
        entityType === 'doc' ||
        entityType === 'tag'
      ) {
        return true;
      }
      return false;
    },
    [canDrop, node]
  );

  const handleChildrenCanDrop = useMemo<
    DropTargetOptions<AffineDNDData>['canDrop']
  >(
    () => args => {
      const entityType = args.source.data.entity?.type;

      if (args.source.data.entity?.type === 'folder') {
        if (
          node.id === args.source.data.entity.id ||
          node.beChildOf(args.source.data.entity.id)
        ) {
          return false;
        }
        return true;
      } else if (
        args.source.data.from?.at === 'navigation-panel:organize:folder-node'
      ) {
        return true;
      } else if (
        entityType === 'collection' ||
        entityType === 'doc' ||
        entityType === 'tag'
      ) {
        return true;
      }
      return false;
    },
    [node]
  );

  const handleNewDoc = useCallback(() => {
    const newDoc = createPage();
    node.createLink('doc', newDoc.id, node.indexAt('before'));
    track.$.navigationPanel.folders.createDoc();
    track.$.navigationPanel.organize.createOrganizeItem({
      type: 'link',
      target: 'doc',
    });
    setCollapsed(false);
  }, [createPage, node, setCollapsed]);

  const handleCreateSubfolder = useCallback(() => {
    const newFolderId = node.createFolder(
      t['com.affine.rootAppSidebar.organize.new-folders'](),
      node.indexAt('before')
    );
    track.$.navigationPanel.organize.createOrganizeItem({ type: 'folder' });
    setCollapsed(false);
    setNewFolderId(newFolderId);
  }, [node, setCollapsed, t]);

  const handleAddToFolder = useCallback(
    (type: 'doc' | 'collection' | 'tag') => {
      const initialIds = children
        .filter(node => node.type$.value === type)
        .map(node => node.data$.value)
        .filter(Boolean) as string[];
      const selector =
        type === 'doc'
          ? 'doc-selector'
          : type === 'collection'
            ? 'collection-selector'
            : 'tag-selector';
      workspaceDialogService.open(
        selector,
        {
          init: initialIds,
        },
        selectedIds => {
          if (selectedIds === undefined) {
            return;
          }
          const newItemIds = difference(selectedIds, initialIds);
          const removedItemIds = difference(initialIds, selectedIds);
          const removedItems = children.filter(
            node =>
              !!node.data$.value && removedItemIds.includes(node.data$.value)
          );

          if (type === 'doc') {
            const changes: FolderFilingChange[] = [];
            try {
              newItemIds.forEach(id => {
                const change = node.fileDoc(id, node.indexAt('after'));
                if (change) changes.push(change);
              });
              removedItems.forEach(child => {
                if (child.id)
                  changes.push(node.store.removeDocLink(child.id, node.id));
              });
            } catch (error) {
              console.error('Could not update folder documents', error);
              notify.error({ title: t['com.affine.filing.failed']() });
            }
            if (changes.length) {
              showFeedback(
                changes,
                t[
                  changes.length === 1
                    ? 'com.affine.filing.reference'
                    : 'com.affine.filing.references'
                ]({ count: String(changes.length) })
              );
              setCollapsed(false);
            }
            return;
          }

          newItemIds.forEach(id => {
            node.createLink(type, id, node.indexAt('after'));
          });
          removedItems.forEach(node => node.delete());
          const updated = newItemIds.length + removedItems.length;
          updated && setCollapsed(false);
        }
      );
      track.$.navigationPanel.organize.createOrganizeItem({
        type: 'link',
        target: type,
      });
    },
    [children, node, setCollapsed, showFeedback, t, workspaceDialogService]
  );

  const folderOperations = useMemo(() => {
    return [
      {
        index: 0,
        inline: true,
        view: (
          <IconButton
            size="16"
            onClick={handleNewDoc}
            tooltip={t[
              'com.affine.rootAppSidebar.explorer.organize-add-tooltip'
            ]()}
          >
            <PlusIcon />
          </IconButton>
        ),
      },
      {
        index: 100,
        view: (
          <MenuItem prefixIcon={<FolderIcon />} onClick={handleCreateSubfolder}>
            {t['com.affine.rootAppSidebar.organize.folder.create-subfolder']()}
          </MenuItem>
        ),
      },
      {
        index: 101,
        view: (
          <MenuItem
            prefixIcon={<PageIcon />}
            onClick={() => handleAddToFolder('doc')}
          >
            {t['com.affine.rootAppSidebar.organize.folder.add-docs']()}
          </MenuItem>
        ),
      },
      {
        index: 102,
        view: (
          <MenuSub
            triggerOptions={{
              prefixIcon: <PlusThickIcon />,
            }}
            items={
              <>
                <MenuItem
                  onClick={() => handleAddToFolder('tag')}
                  prefixIcon={<TagsIcon />}
                >
                  {t['com.affine.rootAppSidebar.organize.folder.add-tags']()}
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddToFolder('collection')}
                  prefixIcon={<AnimatedCollectionsIcon closed={false} />}
                >
                  {t[
                    'com.affine.rootAppSidebar.organize.folder.add-collections'
                  ]()}
                </MenuItem>
              </>
            }
          >
            {t['com.affine.rootAppSidebar.organize.folder.add-others']()}
          </MenuSub>
        ),
      },

      {
        index: 200,
        view: node.id ? <FavoriteFolderOperation id={node.id} /> : null,
      },

      {
        index: 9999,
        view: <MenuSeparator key="menu-separator" />,
      },
      {
        index: 10000,
        view: (
          <MenuItem
            type={'danger'}
            prefixIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            {t['com.affine.rootAppSidebar.organize.delete']()}
          </MenuItem>
        ),
      },
    ];
  }, [
    handleAddToFolder,
    handleCreateSubfolder,
    handleDelete,
    handleNewDoc,
    node,
    t,
  ]);

  const finalOperations = useMemo(() => {
    if (additionalOperations) {
      return [...additionalOperations, ...folderOperations];
    }
    return folderOperations;
  }, [additionalOperations, folderOperations]);

  const childrenOperations = useCallback(
    (type: string, child: FolderNode) => {
      if (type === 'doc' || type === 'collection' || type === 'tag') {
        return [
          {
            index: 999,
            view: (
              <MenuItem
                type={'danger'}
                prefixIcon={<RemoveFolderIcon />}
                data-event-props="$.navigationPanel.organize.deleteOrganizeItem"
                data-event-args-type={child.type$.value}
                onClick={() => {
                  if (type !== 'doc' || !child.id) {
                    child.delete();
                    return;
                  }
                  try {
                    const title =
                      child.data$.value &&
                      docsService.list.doc$(child.data$.value).value?.title$
                        .value;
                    const change = node.store.removeDocLink(child.id, node.id);
                    showFeedback([change], title || t.Untitled());
                  } catch (error) {
                    console.error('Could not remove folder reference', error);
                    notify.error({ title: t['com.affine.filing.failed']() });
                  }
                }}
              >
                {t['com.affine.rootAppSidebar.organize.delete-from-folder']()}
              </MenuItem>
            ),
          },
        ] satisfies NodeOperation[];
      }
      return [];
    },
    [docsService, node, showFeedback, t]
  );

  const handleCollapsedChange = useCallback(
    (collapsed: boolean) => {
      if (collapsed) {
        setNewFolderId(null); // reset new folder id to clear the renaming state
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    },
    [setCollapsed]
  );

  return (
    <NavigationPanelTreeNode
      icon={NavigationPanelFolderIcon}
      name={name}
      dndData={dndData}
      onDrop={handleDropOnFolder}
      defaultRenaming={defaultRenaming}
      renameable
      extractEmojiAsIcon={enableEmojiIcon}
      reorderable={reorderable}
      collapsed={collapsed}
      setCollapsed={handleCollapsedChange}
      onRename={handleRename}
      operations={finalOperations}
      canDrop={handleCanDrop}
      childrenPlaceholder={
        <FolderEmpty
          name={name}
          canDrop={handleCanDrop}
          onDrop={handleDropOnPlaceholder}
        />
      }
      postfix={acknowledgment}
      dropEffect={handleDropEffect}
      data-testid={`navigation-panel-folder-${node.id}`}
      explorerIconConfig={node.id ? { where: 'folder', id: node.id } : null}
    >
      {children.map(child => (
        <NavigationPanelFolderNode
          key={child.id}
          nodeId={child.id as string}
          defaultRenaming={child.id === newFolderId}
          onDrop={handleDropOnChildren}
          operations={childrenOperations}
          dropEffect={handleDropEffectOnChildren}
          canDrop={handleChildrenCanDrop}
          location={{
            at: 'navigation-panel:organize:folder-node',
            nodeId: child.id as string,
          }}
          parentPath={path}
        />
      ))}
    </NavigationPanelTreeNode>
  );
};
