import type { RouteRecordRaw } from 'vue-router';

import EmailTemplateList from '../views/EmailTemplateList';
import EmailSendTest from '../views/EmailSendTest';
import EmailLogList from '../views/EmailLogList';
import EmailTemplateForm from '../views/EmailTemplateForm';

import { EMAIL_ROUTE_PATHS } from './paths';

export const EMAIL_TEMPLATE_LIST_ROUTE: RouteRecordRaw = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_LIST,
  component: EmailTemplateList,
  name: 'Templates',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('mail:home') },
      { url: route.path, text: i18n.t('mail:templates') },
    ],
  },
};

export const EMAIL_TEMPLATE_FORM_ROUTE: RouteRecordRaw = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_FORM,
  component: EmailTemplateForm,
  name: 'Template form',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('mail:home') },
      { url: route.path, text: i18n.t('mail:templateForm') },
    ],
  },
};

export const EMAIL_LOG_LIST_ROUTE: RouteRecordRaw = {
  path: EMAIL_ROUTE_PATHS.LOG_LIST,
  component: EmailLogList,
  name: 'Logs',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('mail:home') },
      { url: route.path, text: i18n.t('mail:logs') },
    ],
  },
};

export const EMAIL_TEST_ROUTE: RouteRecordRaw = {
  path: EMAIL_ROUTE_PATHS.TEST_MAIL,
  component: EmailSendTest,
  name: 'Email_TEST',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('mail:home') },
      { url: route.path, text: i18n.t('mail:testMail') },
    ],
  },
};
