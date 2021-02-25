import { i18n } from '@tager/admin-services';
import EN from './locales/en';
import RU from './locales/ru';

i18n.addTranslations('en', 'mail', EN);
i18n.addTranslations('ru', 'mail', RU);

export * from './constants/routes';
export * from './constants/menu';
export * from './utils/paths';
