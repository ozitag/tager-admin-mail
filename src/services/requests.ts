import { request, ResponseBody } from '@tager/admin-services';

import { EmailLog, EmailTemplate } from '../typings/model';

export function getTemplateList(): Promise<ResponseBody<Array<EmailTemplate>>> {
  return request.get({ path: '/mail/templates' });
}

export function getTemplate(
  alias: string
): Promise<ResponseBody<EmailTemplate>> {
  return request.get({ path: '/mail/templates', params: { alias } });
}

export type TemplateUpdatePayload = {
  subject: string;
  body: string;
  recipients: Array<string>;
};

export function updateTemplate(
  alias: string,
  payload: TemplateUpdatePayload
): Promise<ResponseBody<EmailTemplate>> {
  return request.put({
    path: '/mail/templates',
    body: payload,
    params: { alias },
  });
}

export function getLogList(): Promise<ResponseBody<Array<EmailLog>>> {
  return request.get({ path: '/mail/logs' });
}
