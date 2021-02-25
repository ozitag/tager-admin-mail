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
        :label="t('mail:subject')"
      />

      <form-field
        v-model="values.recipients"
        name="recipients"
        :error="errors.recipients"
        :label="t('mail:recipients')"
      />

      <form-field-checkbox
        v-model="values.useServiceTemplate"
        name="useServiceTemplate"
        :error="errors.useServiceTemplate"
        :label="t('mail:useServiceTemplate')"
      />
      <form-field-select
        v-if="values.useServiceTemplate"
        v-model="values.serviceTemplate"
        name="serviceTemplate"
        :error="errors.serviceTemplate"
        :label="t('mail:serviceTemplate')"
        :no-options-message="t('mail:noTemplates')"
        :options="serviceTemplateOptions"
      />
      <template v-else>
        <form-field-rich-text-input
          v-model="values.body"
          name="body"
          :error="errors.body"
          :label="t('mail:body')"
        />

        <div
          v-if="emailTemplate && emailTemplate.variables.length > 0"
          class="legend-vars"
        >
          <h4 class="title">{{ t('mail:templateVariables') }}</h4>
          <ul>
            <li v-for="variable of emailTemplate.variables" :key="variable.key">
              <span>{{ variable.label }}</span> -
              <span>
                {{ getKeyTemplate(variable.key) }}
              </span>
              <base-button
                variant="icon"
                :title="t('mail:copy')"
                @click="copyVarTemplate(variable.key)"
              >
                <svg-icon name="contentCopy" />
              </base-button>
            </li>
          </ul>
        </div>
      </template>
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
  SetupContext,
  watch,
} from '@vue/composition-api';
import useResource from '../hooks/useResource';
import { OptionType, useTranslation } from '@tager/admin-ui';

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
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    /** Service template list fetching */

    const [
      fetchServiceTemplateList,
      { data: serviceTemplateList, loading: isServiceTemplateListLoading },
    ] = useResource<Array<EmailServiceTemplate>>({
      fetchResource: getServiceTemplateList,
      initialValue: [],
    });

    /** Email template fetching */

    const templateId = computed<string>(
      () => context.root.$route.params.templateId
    );

    const [
      fetchEmailTemplate,
      { data: emailTemplate, loading: isTemplateLoading },
    ] = useResource<Nullable<EmailTemplate>>({
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

      const foundServiceTemplate =
        serviceTemplateOptions.find(
          (option) => option.value === template.serviceTemplate
        ) ?? null;

      return {
        subject: template.subject,
        body: template.body,
        recipients: template.recipients.join(','),
        useServiceTemplate: Boolean(foundServiceTemplate),
        serviceTemplate: foundServiceTemplate,
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
            title: t('mail:success'),
            body: t('mail:templateHasBeenSuccessfullyUpdated'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: t('mail:error'),
            body: t('mail:templateUpdateHasBeenFailed'),
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
        ? `${t('mail:EMailTemplate')} "${emailTemplate.value.name}"`
        : t('mail:EMailTemplate')
    );

    const isInitialLoading = computed<boolean>(
      () => isTemplateLoading.value || isServiceTemplateListLoading.value
    );

    return {
      t,
      templateListRoutePath: getEmailTemplateListUrl(),
      values,
      errors,
      pageTitle,
      copyVarTemplate,
      getKeyTemplate,
      submitForm,
      isSubmitting,
      isInitialLoading,
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
