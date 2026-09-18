import type { SettingTab } from '@affine/core/modules/dialogs/constant';
import { useI18n } from '@affine/i18n';
import { PropertyIcon, SaveIcon, SettingsIcon } from '@blocksuite/icons/rc';

import type { SettingSidebarItem, SettingState } from '../types';
import { WorkspaceSettingDetail } from './preference';
import { WorkspaceSettingProperties } from './properties';
import { WorkspaceSettingStorage } from './storage';

export const WorkspaceSetting = ({
  activeTab,
  onCloseSetting,
}: {
  activeTab: SettingTab;
  scrollAnchor?: string;
  onCloseSetting: () => void;
  onChangeSettingState: (settingState: SettingState) => void;
}) => {
  switch (activeTab) {
    case 'workspace:preference':
      return <WorkspaceSettingDetail onCloseSetting={onCloseSetting} />;
    case 'workspace:properties':
      return <WorkspaceSettingProperties />;
    case 'workspace:storage':
      return <WorkspaceSettingStorage onCloseSetting={onCloseSetting} />;
    default:
      return <WorkspaceSettingDetail onCloseSetting={onCloseSetting} />;
  }
};

export const useWorkspaceSettingList = (): SettingSidebarItem[] => {
  const t = useI18n();
  return [
    {
      key: 'workspace:preference',
      title: t['com.affine.settings.workspace.preferences'](),
      icon: <SettingsIcon />,
      testId: 'workspace-setting:preference',
    },
    {
      key: 'workspace:properties',
      title: t['com.affine.settings.workspace.properties'](),
      icon: <PropertyIcon />,
      testId: 'workspace-setting:properties',
    },
    {
      key: 'workspace:storage',
      title: t['Storage'](),
      icon: <SaveIcon />,
      testId: 'workspace-setting:storage',
    },
  ];
};
