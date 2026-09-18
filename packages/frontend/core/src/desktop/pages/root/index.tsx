import { NotificationCenter } from '@affine/component';
import { DefaultServerService } from '@affine/core/modules/cloud';
import { FrameworkScope, useService } from '@toeverything/infra';
import { Outlet } from 'react-router-dom';

import { GlobalDialogs } from '../../dialogs';
import { CustomThemeModifier } from './custom-theme';
import { FindInPagePopup } from './find-in-page/find-in-page-popup';

export const RootWrapper = () => {
  const defaultServerService = useService(DefaultServerService);
  return (
    <FrameworkScope scope={defaultServerService.server.scope}>
      <GlobalDialogs />
      <NotificationCenter />
      <Outlet />
      <CustomThemeModifier />
      {BUILD_CONFIG.isElectron && <FindInPagePopup />}
    </FrameworkScope>
  );
};
