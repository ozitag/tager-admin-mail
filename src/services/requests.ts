import { Nullable, request, ResponseBody } from '@tager/admin-services';

import {
  EmailLog,
  EmailModuleConfig,
  EmailServiceTemplate,
  EmailTemplate,
} from '../typings/model';

export function getTemplateList(): Promise<ResponseBody<Array<EmailTemplate>>> {
  return request.get({ path: '/admin/mail/templates' });
}

export function getTemplate(
  templateId: number | string
): Promise<ResponseBody<EmailTemplate>> {
  return request.get({ path: `/admin/mail/templates/${templateId}` });
}

export type TemplateUpdatePayload = {
  subject: string;
  body: Nullable<string>;
  serviceTemplate: Nullable<string>;
  recipients: Array<string>;
};

export function updateTemplate(
  templateId: string | number,
  payload: TemplateUpdatePayload
): Promise<ResponseBody<EmailTemplate>> {
  return request.put({
    path: `/admin/mail/templates/${templateId}`,
    body: payload,
  });
}

export function getLogList(params?: {
  query?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Array<EmailLog>>> {
  return request.get({ path: '/admin/mail/logs', params });
}

export function getEmailModuleConfiguration(): Promise<
  ResponseBody<EmailModuleConfig>
> {
  return request.get({ path: '/admin/mail/info' });
}

export function getServiceTemplateList(): Promise<
  ResponseBody<Array<EmailServiceTemplate>>
> {
  return request.get({ path: '/admin/mail/service-templates' });
}
