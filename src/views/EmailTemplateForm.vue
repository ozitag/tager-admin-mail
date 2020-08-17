<template>
  <page
    :title="pageTitle"
    :is-content-loading="isInitialLoading"
    :footer="{
      backHref: templateListRoutePath,
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <form novalidate @submit.prevent>
      <form-field
        v-model="values.subject"
        name="subject"
        :error="errors.subject"
        label="Subject"
      />

      <form-field
        v-model="values.recipients"
        name="recipients"
        :error="errors.recipients"
        label="Recipients"
      />

      <form-field-checkbox
        v-model="values.useServiceTemplate"
        name="useServiceTemplate"
        :error="errors.useServiceTemplate"
        label="Use Service Template"
      />
      <form-field-select
        v-if="values.useServiceTemplate"
        v-model="values.serviceTemplate"
        name="serviceTemplate"
        :error="errors.serviceTemplate"
        label="Service Template"
        no-options-message="No templates"
        :options="serviceTemplateOptions"
      />
      <form-field-rich-text-input
        v-else
        v-model="values.body"
        name="body"
        :error="errors.body"
        label="Body"
      />

      <div
        v-if="emailTemplate && emailTemplate.variables.length > 0"
        class="legend-vars"
      >
        <h4 class="title">Template variables</h4>
        <ul>
          <li v-for="variable of emailTemplate.variables" :key="variable.key">
            <span>{{ variable.label }}</span> -
            <span>
              {{ getKeyTemplate(variable.key) }}
            </span>
            <base-button
              variant="icon"
              title="Copy"
              @click="copyVarTemplate(variable.key)"
            >
              <svg-icon name="contentCopy" />
            </base-button>
          </li>
        </ul>
      </div>
    </form>
  </page>
</template>

<script lang="ts">
import { convertRequestErrorToMap, Nullable } from '@tager/admin-services';

import {
  getServiceTemplateList,
  getTemplate,
  TemplateUpdatePayload,
  updateTemplate,
} from '../services/requests';
import { EmailServiceTemplate, EmailTemplate } from '../typings/model';
import { getEmailTemplateListUrl } from '../utils/paths';
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import useResource from '../hooks/useResource';
import { OptionType } from '@tager/admin-ui';

type FormValues = {
  subject: string;
  body: string;
  recipients: string;
  useServiceTemplate: boolean;
  serviceTemplate: Nullable<OptionType>;
};

const INITIAL_VALUES: FormValues = {
  subject: '',
  body: '',
  recipients: '',
  useServiceTemplate: false,
  serviceTemplate: null,
};

export default defineComponent({
  name: 'EmailTemplateForm',
  setup(props, context) {
    /** Service template list fetching */

    const [
      fetchServiceTemplateList,
      { data: serviceTemplateList },
    ] = useResource<Array<EmailServiceTemplate>>({
      fetchResource: getServiceTemplateList,
      initialValue: [],
    });

    /** Email template fetching */

    const templateId = computed<string>(
      () => context.root.$route.params.templateId
    );

    const [fetchEmailTemplate, { data: emailTemplate, loading }] = useResource<
      Nullable<EmailTemplate>
    >({
      fetchResource: () => getTemplate(templateId.value),
      initialValue: null,
    });

    onMounted(() => {
      fetchEmailTemplate();
      fetchServiceTemplateList();
    });

    watch(templateId, fetchEmailTemplate);

    /** Form related logic */

    function convertEmailTemplateToFormValues(
      template: Nullable<EmailTemplate>,
      serviceTemplateOptions: Array<OptionType>
    ): FormValues {
      if (!template) return INITIAL_VALUES;

      return {
        subject: template.subject,
        body: template.body,
        recipients: template.recipients.join(','),
        useServiceTemplate: false,
        serviceTemplate:
          serviceTemplateOptions.find(
            (option) => option.value === template.serviceTemplate
          ) ?? null,
      };
    }

    const values = ref<FormValues>(INITIAL_VALUES);
    const errors = ref<Record<string, string>>({});
    const isSubmitting = ref<boolean>(false);

    watch([emailTemplate, serviceTemplateList], () => {
      values.value = convertEmailTemplateToFormValues(
        emailTemplate.value,
        serviceTemplateList.value
      );
    });

    function submitForm() {
      isSubmitting.value = true;

      const body: TemplateUpdatePayload = {
        subject: values.value.subject,
        body: values.value.useServiceTemplate ? null : values.value.body,
        serviceTemplate:
          values.value.useServiceTemplate && values.value.serviceTemplate
            ? values.value.serviceTemplate.value
            : null,
        recipients: values.value.recipients
          .split(',')
          .map((recipient) => recipient.trim())
          .filter(Boolean),
      };

      updateTemplate(templateId.value, body)
        .then(() => {
          errors.value = {};
          context.root.$router.push(getEmailTemplateListUrl());

          context.root.$toast({
            variant: 'success',
            title: 'Success',
            body: 'Template has been successfully updated',
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Template update has been failed',
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    /** Misc */

    function getKeyTemplate(key: string): string {
      return `{{${key}}}`;
    }

    function copyVarTemplate(key: string) {
      navigator.clipboard.writeText(getKeyTemplate(key)).catch(console.error);
    }

    const pageTitle = computed<string>(() =>
      emailTemplate.value
        ? `E-Mail template "${emailTemplate.value.name}"`
        : 'E-Mail template'
    );

    return {
      templateListRoutePath: getEmailTemplateListUrl(),
      values,
      errors,
      pageTitle,
      copyVarTemplate,
      getKeyTemplate,
      submitForm,
      isSubmitting,
      isInitialLoading: loading,
      emailTemplate,
      serviceTemplateOptions: serviceTemplateList,
    };
  },
});
</script>

<style scoped lang="scss">
.legend-vars {
  h4 {
    margin-bottom: 0.5rem;
  }
  ul {
    display: inline-block;
    padding-left: 1.2rem;
    list-style-type: decimal;

    li:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }

  button {
    margin-left: 0.5rem;
  }
}
</style>
