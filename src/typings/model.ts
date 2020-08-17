import { Nullable } from '@tager/admin-services';

export type EmailTemplate = {
  id: number;
  alias: string;
  name: string;
  subject: string;
  body: string;
  recipients: Array<string>;
  variables: Array<{ key: string; label: string }>;
  serviceTemplate: Nullable<string>;
};

export type EmailServiceTemplate = { value: string; label: string };

export type EmailLog = {
  id: number;
  template: Nullable<string>;
  serviceTemplate: Nullable<string>;
  recipient: string;
  subject: string;
  body: string;
  isDebug: boolean;
  status: 'SENDING' | 'SUCCESS' | 'FAILURE';
  error: Nullable<string>;
  createdAt: string;
  updatedAt: string;
  attachments: Array<{ name: string; url: string }>;
};

export type EmailModuleConfig = {
  enabled: boolean;
  allowedEmails: Array<string> | string;
  subjectTemplate: string;
  service: string;
};
