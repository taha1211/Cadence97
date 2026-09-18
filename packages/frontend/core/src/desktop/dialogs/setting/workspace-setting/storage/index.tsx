import {
  SettingHeader,
  SettingRow,
  SettingWrapper,
} from '@affine/component/setting-components';
import { WorkspaceService } from '@affine/core/modules/workspace';
import { useI18n } from '@affine/i18n';
import { useService } from '@toeverything/infra';

import { DesktopExportPanel } from './export';

export const WorkspaceSettingStorage = (_props: {
  onCloseSetting: () => void;
}) => {
  const t = useI18n();
  const workspace = useService(WorkspaceService).workspace;
  return (
    <>
      <SettingHeader
        title={t['Storage']()}
        subtitle="Your workspace is stored on this device."
      />
      <SettingWrapper title="Local storage">
        <SettingRow
          name="Keep a copy of your work"
          desc="Open a document and choose Export to save it as Markdown, HTML, PNG, or a snapshot. Choose Print to save a PDF. Browser data can be removed when you clear site data or when the device runs out of space."
        />
        {BUILD_CONFIG.isElectron && (
          <DesktopExportPanel workspace={workspace} />
        )}
      </SettingWrapper>
    </>
  );
};
