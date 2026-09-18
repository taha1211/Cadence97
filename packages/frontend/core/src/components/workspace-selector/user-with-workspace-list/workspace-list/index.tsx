import {
  type WorkspaceMetadata,
  WorkspaceService,
  WorkspacesService,
} from '@affine/core/modules/workspace';
import {
  useLiveData,
  useService,
  useServiceOptional,
} from '@toeverything/infra';
import { useCallback } from 'react';

import { WorkspaceCard } from '../../workspace-card';
import * as styles from './index.css';

export const AFFiNEWorkspaceList = ({
  onEventEnd,
  onClickWorkspace,
}: {
  onClickWorkspace?: (workspace: WorkspaceMetadata) => void;
  onEventEnd?: () => void;
  showEnableCloudButton?: boolean;
}) => {
  const workspaces = useLiveData(
    useService(WorkspacesService).list.workspaces$
  );
  const onClick = useCallback(
    (workspace: WorkspaceMetadata) => {
      onClickWorkspace?.(workspace);
      onEventEnd?.();
    },
    [onClickWorkspace, onEventEnd]
  );
  return <WorkspaceList items={workspaces} onClick={onClick} />;
};

interface WorkspaceListProps {
  items: WorkspaceMetadata[];
  onClick: (workspace: WorkspaceMetadata) => void;
  onSettingClick?: (workspace: WorkspaceMetadata) => void;
  onEnableCloudClick?: (meta: WorkspaceMetadata) => void;
}

interface SortableWorkspaceItemProps extends Omit<WorkspaceListProps, 'items'> {
  workspaceMetadata: WorkspaceMetadata;
}

const SortableWorkspaceItem = ({
  workspaceMetadata,
  onClick,
  onSettingClick,
  onEnableCloudClick,
}: SortableWorkspaceItemProps) => {
  const handleClick = useCallback(() => {
    onClick(workspaceMetadata);
  }, [onClick, workspaceMetadata]);

  const currentWorkspace = useServiceOptional(WorkspaceService)?.workspace;

  return (
    <WorkspaceCard
      className={styles.workspaceCard}
      infoClassName={styles.workspaceCardInfoContainer}
      workspaceMetadata={workspaceMetadata}
      onClick={handleClick}
      avatarSize={22}
      active={currentWorkspace?.id === workspaceMetadata.id}
      onClickOpenSettings={onSettingClick}
      onClickEnableCloud={onEnableCloudClick}
    />
  );
};

export const WorkspaceList = (props: WorkspaceListProps) => {
  const workspaceList = props.items;

  return workspaceList.map(item => (
    <SortableWorkspaceItem key={item.id} {...props} workspaceMetadata={item} />
  ));
};
