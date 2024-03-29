import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { configStore, i18n, i18nPlugin } from '@tager/admin-services';
import { createRouter } from '@tager/admin-layout';
import '@tager/admin-ui/css';
import '@tager/admin-layout/css';
import '@tager/admin-dynamic-field/css';

import { applyTranslations } from '../locales/apply';
import {
  EMAIL_LOG_LIST_ROUTE,
  EMAIL_TEMPLATE_FORM_ROUTE,
  EMAIL_TEMPLATE_LIST_ROUTE,
  EMAIL_TEST_ROUTE,
} from '../constants/routes';

import { OZITAG_CONFIG } from './config';
import App from './App.vue';
import { populateEnvironment } from './env';

populateEnvironment();

configStore.setConfig(OZITAG_CONFIG);

const router = createRouter(
  {
    routes: [
      EMAIL_LOG_LIST_ROUTE,
      EMAIL_TEMPLATE_FORM_ROUTE,
      EMAIL_TEMPLATE_LIST_ROUTE,
      EMAIL_TEST_ROUTE,
    ],
  },
  { useTitleSync: false }
);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(i18nPlugin);
app.use(pinia);

applyTranslations();

i18n.init({ debug: true, lng: 'ru' }).then(() => {
  app.mount('#app');
});
