import { MenuItemType } from '@tager/admin-layout';

import { EMAIL_ROUTE_PATHS } from './paths';

export const EMAIL_MENU_ITEM: MenuItemType = {
  id: 'mail',
  name: 'E-Mail Notifications',
  path: '',
  icon: 'email',
  children: [
    { name: 'Templates', path: EMAIL_ROUTE_PATHS.TEMPLATE_LIST },
    { name: 'Logs', path: EMAIL_ROUTE_PATHS.LOG_LIST },
  ],
};
