import { compile } from 'path-to-regexp';

import { ViewListIcon } from '@tager/admin-ui';
import { MenuItemType } from '@tager/admin-layout';
import { I18nContext } from '@tager/admin-services';

import { EMAIL_ROUTE_PATHS } from '../constants/paths';

export function getEmailTemplateListUrl(): string {
  return EMAIL_ROUTE_PATHS.TEMPLATE_LIST;
}

export function getEmailTemplateFormUrl(params: {
  templateId: string;
}): string {
  return compile(EMAIL_ROUTE_PATHS.TEMPLATE_FORM)(params);
}

export function getEmailLogListUrl(): string {
  return EMAIL_ROUTE_PATHS.LOG_LIST;
}

export function getTestMailUrl(): string {
  return EMAIL_ROUTE_PATHS.TEST_MAIL;
}

export function getTagerMailSidebar(i18n: I18nContext): MenuItemType {
  return {
    id: 'mail',
    text: i18n.t('mail:EMailNotifications'),
    icon: ViewListIcon,
    children: [
      { text: i18n.t('mail:templates'), url: getEmailTemplateListUrl() },
      { text: i18n.t('mail:logs'), url: getEmailLogListUrl() },
      { text: i18n.t('mail:testMail'), url: getTestMailUrl() },
    ],
  };
}
