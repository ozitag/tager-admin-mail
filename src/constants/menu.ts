import { MenuItemType } from '@tager/admin-layout';

import { getEmailLogListUrl, getEmailTemplateListUrl } from '../utils/paths';

export const EMAIL_MENU_ITEM: MenuItemType = {
  id: 'mail',
  name: 'E-Mail Notifications',
  path: '',
  icon: 'email',
  children: [
    { name: 'Templates', path: getEmailTemplateListUrl() },
    { name: 'Logs', path: getEmailLogListUrl() },
  ],
};
