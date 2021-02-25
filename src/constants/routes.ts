import { CustomRouteConfig } from '@tager/admin-layout';

import EmailTemplateList from '../views/EmailTemplateList';
import EmailTemplateForm from '../views/EmailTemplateForm.vue';
import EmailLogList from '../views/EmailLogList';

import { EMAIL_ROUTE_PATHS } from './paths';

export const EMAIL_TEMPLATE_LIST_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_LIST,
  component: EmailTemplateList,
  name: 'Templates',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('mail:home') },
      { url: route.path, text: t('mail:templates') },
    ],
  },
};

export const EMAIL_TEMPLATE_FORM_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_FORM,
  component: EmailTemplateForm,
  name: 'Template form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('mail:home') },
      { url: route.path, text: t('mail:templateForm') },
    ],
  },
};

export const EMAIL_LOG_LIST_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.LOG_LIST,
  component: EmailLogList,
  name: 'Logs',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('mail:home') },
      { url: route.path, text: t('mail:logs') },
    ],
  },
};
