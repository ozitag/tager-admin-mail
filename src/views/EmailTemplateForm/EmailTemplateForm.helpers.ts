import { Nullable } from '@tager/admin-services';
import { EmailTemplate } from '../../typings/model';
import { OptionType } from '@tager/admin-ui';

export type FormValues = {
  subject: string;
  alias: string;
  body: string;
  recipients: string;
  cc: string;
  bcc: string;
  useServiceTemplate: boolean;
  serviceTemplate: Nullable<OptionType>;
  fromName: Nullable<string>;
  fromEmail: Nullable<string>;
  editorMode: Nullable<OptionType>;
};

export function convertEmailTemplateToFormValues(
  template: Nullable<EmailTemplate>,
  serviceTemplateOptions: Array<OptionType>,
  editorModeOptions: OptionType[]
): FormValues {
  const foundServiceTemplate =
    serviceTemplateOptions.find(
      (option) => option.value === template?.serviceTemplate
    ) ?? null;

  const foundEditorMode = editorModeOptions.find(
    ({ value }) => value === template?.editorMode
  );

  return {
    alias: template?.alias ?? '',
    subject: template?.subject ?? '',
    body: template?.body ?? '',
    recipients: template?.recipients.join(',') ?? '',
    cc: template?.cc.join(',') ?? '',
    bcc: template?.bcc.join(',') ?? '',
    useServiceTemplate: Boolean(foundServiceTemplate),
    serviceTemplate: foundServiceTemplate,
    fromName: template?.fromName ?? null,
    fromEmail: template?.fromEmail ?? null,
    editorMode: foundEditorMode ?? editorModeOptions[0],
  };
}
