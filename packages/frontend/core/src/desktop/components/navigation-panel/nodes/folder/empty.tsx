import {
  type DropTargetDropEvent,
  type DropTargetOptions,
  useDropTarget,
} from '@affine/component';
import type { AffineDNDData } from '@affine/core/types/dnd';
import { useI18n } from '@affine/i18n';

import { EmptyNodeChildren } from '../../layouts/empty-node-children';
import { DropEffect } from '../../tree';
import { draggedOverHighlight } from './empty.css';

export const FolderEmpty = ({
  name,
  canDrop,
  onDrop,
}: {
  name: string;
  onDrop?: (data: DropTargetDropEvent<AffineDNDData>) => void;
  canDrop?: DropTargetOptions<AffineDNDData>['canDrop'];
}) => {
  const { dropTargetRef, draggedOverDraggable, draggedOverPosition } =
    useDropTarget<AffineDNDData>(
      () => ({
        onDrop,
        canDrop,
      }),
      [onDrop, canDrop]
    );

  const t = useI18n();
  return (
    <EmptyNodeChildren ref={dropTargetRef} className={draggedOverHighlight}>
      {draggedOverDraggable
        ? t['com.affine.filing.drop-here']()
        : t['com.affine.rootAppSidebar.organize.empty-folder']()}
      {draggedOverDraggable && (
        <DropEffect
          position={draggedOverPosition}
          dropEffect={{
            effect:
              draggedOverDraggable.data.entity?.type === 'folder' ||
              draggedOverDraggable.data.from?.at ===
                'navigation-panel:organize:folder-node'
                ? 'move'
                : 'link',
            destination: name,
          }}
        />
      )}
    </EmptyNodeChildren>
  );
};
