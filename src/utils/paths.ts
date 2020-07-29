import { compile } from 'path-to-regexp';

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
