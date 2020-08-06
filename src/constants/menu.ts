import { MenuItemType } from '@tager/admin-layout';

import { getEmailLogListUrl, getEmailTemplateListUrl } from '../utils/paths';

export const EMAIL_MENU_ITEM: MenuItemType = {
  id: 'mail',
  text: 'E-Mail Notifications',
  icon: 'email',
  children: [
    { text: 'Templates', url: getEmailTemplateListUrl() },
    { text: 'Logs', url: getEmailLogListUrl() },
  ],
};
