import Vue from 'vue';
import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import {
  AdminLayoutPlugin,
  createRouter,
  CustomRoute,
  CustomRouteConfig,
} from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import {
  EMAIL_LOG_LIST_ROUTE,
  EMAIL_TEMPLATE_FORM_ROUTE,
  EMAIL_TEMPLATE_LIST_ROUTE,
} from './constants/routes';
import config from './config/config.json';
import App from './views/App.vue';
import Home from './views/Home/index.vue';

configStore.setConfig(config);

Vue.use(AdminUiPlugin);
Vue.use(AdminLayoutPlugin);

export const HOME_ROUTE: CustomRouteConfig = {
  path: '/',
  component: Home,
  name: 'Home',
  meta: {
    getBreadcrumbs: (route: CustomRoute) => [{ path: '/', label: route.name }],
  },
};

const router = createRouter(
  {
    routes: [
      HOME_ROUTE,
      EMAIL_TEMPLATE_LIST_ROUTE,
      EMAIL_TEMPLATE_FORM_ROUTE,
      EMAIL_LOG_LIST_ROUTE,
    ],
  },
  { useTitleSync: false }
);

i18n.init().then(() => {
  Vue.use(i18n.getPlugin());

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
});
