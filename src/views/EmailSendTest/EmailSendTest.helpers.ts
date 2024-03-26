import { OptionType } from '@tager/admin-ui';
import { Nullable } from '@tager/admin-services';

import { SendTestEmailPayload } from '@/services/requests';

export type FormValues = {
  recipient: string;
  template: Nullable<OptionType<string>>;
  params: Record<string, string>;
};

export const INITIAL_VALUES: FormValues = {
  recipient: '',
  template: null,
  params: {},
};

export function convertFormValuesToSendPayload(
  formValues: FormValues
): SendTestEmailPayload {
  return {
    recipient: formValues.recipient,
    template: formValues.template?.value || null,
    params: Object.keys(formValues.params).map((param) => ({
      param,
      value: formValues.params[param],
    })),
  };
}
