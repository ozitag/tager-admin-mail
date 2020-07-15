import { Nullable } from '@tager/admin-services';

export type EmailTemplate = {
  alias: string;
  name: string;
  subject: string;
  body: string;
  recipients: Array<string>;
  variables: Array<{ key: string; label: string }>;
};

export type EmailLog = {
  id: number;
  template: string;
  recipient: string;
  subject: string;
  body: string;
  isDebug: boolean;
  status: 'SENDING' | 'SUCCESS' | 'FAILURE';
  error: Nullable<string>;
  createdAt: string;
  updatedAt: string;
};
