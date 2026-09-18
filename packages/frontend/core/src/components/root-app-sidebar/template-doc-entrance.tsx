import { Menu, MenuSeparator } from '@affine/component';
import {
  TemplateListMenuAdd,
  TemplateListMenuContentScrollable,
} from '@affine/core/modules/template-doc/view/template-list-menu';
import { useI18n } from '@affine/i18n';
import track from '@affine/track';
import { TemplateIcon } from '@blocksuite/icons/rc';
import { useCallback, useState } from 'react';

import { SidebarDockItem } from './sidebar-dock';

export const TemplateDocEntrance = () => {
  const t = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const onMenuOpenChange = useCallback((open: boolean) => {
    if (open) track.$.sidebar.template.openTemplateListMenu();
    setMenuOpen(open);
  }, []);

  return (
    <Menu
      rootOptions={{ open: menuOpen, onOpenChange: onMenuOpenChange }}
      contentOptions={{
        side: 'top',
        align: 'start',
        sideOffset: 8,
        collisionPadding: 8,
        style: { width: 280 },
      }}
      items={
        <TemplateListMenuContentScrollable
          asLink
          suffixItems={
            <>
              <MenuSeparator />
              <TemplateListMenuAdd />
            </>
          }
        />
      }
    >
      <SidebarDockItem
        data-testid="sidebar-template-doc-entrance"
        icon={<TemplateIcon />}
        label={t['Template']()}
        active={menuOpen}
      />
    </Menu>
  );
};
