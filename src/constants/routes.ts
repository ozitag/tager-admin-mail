import { CustomRouteConfig } from '@tager/admin-layout';

import EmailTemplateList from '../views/EmailTemplateList.vue';
import EmailTemplateForm from '../views/EmailTemplateForm.vue';
import EmailLogList from '../views/EmailLogList.vue';

import { EMAIL_ROUTE_PATHS } from './paths';

const HOME_BREADCRUMB = { path: '/', label: 'Home' };

export const EMAIL_TEMPLATE_LIST_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_LIST,
  component: EmailTemplateList,
  name: 'Templates',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: 'Templates' },
    ],
  },
};

export const EMAIL_TEMPLATE_FORM_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.TEMPLATE_FORM,
  component: EmailTemplateForm,
  name: 'Template form',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: 'Template form' },
    ],
  },
};

export const EMAIL_LOG_LIST_ROUTE: CustomRouteConfig = {
  path: EMAIL_ROUTE_PATHS.LOG_LIST,
  component: EmailLogList,
  name: 'Logs',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: 'Logs' },
    ],
  },
};
