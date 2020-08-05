import { request, ResponseBody } from '@tager/admin-services';

import { EmailLog, EmailTemplate } from '../typings/model';

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
  body: string;
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

export function getLogList(): Promise<ResponseBody<Array<EmailLog>>> {
  return request.get({ path: '/admin/mail/logs' });
}
