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
      <field-value
          v-if="!isCreation"
          :label="t('mail:systemName')"
          type="text"
          :text="values.alias"
      />

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

      <form-field
          v-model="values.cc"
          name="cc"
          :error="errors.cc"
          :label="t('mail:cc')"
      />

      <form-field
          v-model="values.bcc"
          name="bcc"
          :error="errors.bcc"
          :label="t('mail:bcc')"
      />

      <form-field
          v-model="values.fromName"
          name="fromName"
          :error="errors.fromName"
          :label="t('mail:fromName')"
      />

      <form-field
          v-model="values.fromEmail"
          name="fromEmail"
          :error="errors.fromEmail"
          :label="t('mail:fromEmail')"
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
        <form-field-message-template
            v-model="values.body"
            :label="t('mail:body')"
            :variable-list="emailTemplate ? emailTemplate.variables : []"
            :error="errors.body"
            type="richText"
            name="body"
        />
      </template>


    </form>
  </page>
</template>

<script lang="ts">
import {convertRequestErrorToMap, Nullable} from '@tager/admin-services';

import {
  getServiceTemplateList,
  getTemplate,
  TemplateUpdatePayload,
  updateTemplate,
} from '../services/requests';
import {EmailServiceTemplate, EmailTemplate} from '../typings/model';
import {getEmailTemplateListUrl} from '../utils/paths';
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import useResource from '../hooks/useResource';
import {OptionType, useTranslation} from '@tager/admin-ui';

type FormValues = {
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
};

const INITIAL_VALUES: FormValues = {
  alias: '',
  subject: '',
  body: '',
  recipients: '',
  cc: '',
  bcc: '',
  useServiceTemplate: false,
  serviceTemplate: null,
  fromName: null,
  fromEmail: null,
};

export default defineComponent({
  name: 'EmailTemplateForm',
  setup(props, context: SetupContext) {
    const {t} = useTranslation(context);

    /** Service template list fetching */

    const [
      fetchServiceTemplateList,
      {data: serviceTemplateList, loading: isServiceTemplateListLoading},
    ] = useResource<Array<EmailServiceTemplate>>({
      fetchResource: getServiceTemplateList,
      initialValue: [],
    });

    /** Email template fetching */

    const templateId = computed<string>(
        () => context.root.$route.params.templateId
    );

    const isCreation = computed(() => templateId.value === 'create');

    const [
      fetchEmailTemplate,
      {data: emailTemplate, loading: isTemplateLoading},
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
        alias: template.alias,
        body: template.body,
        recipients: template.recipients.join(','),
        cc: template.cc ? template.cc.join(',') : '',
        bcc: template.bcc ? template.bcc.join(',') : '',
        useServiceTemplate: Boolean(foundServiceTemplate),
        serviceTemplate: foundServiceTemplate,
        fromName: template.fromName,
        fromEmail: template.fromEmail,
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
        fromName: values.value.fromName,
        fromEmail: values.value.fromEmail,
        recipients: values.value.recipients
            .split(',')
            .map((recipient) => recipient.trim())
            .filter(Boolean),
        cc: values.value.cc ? values.value.cc
            .split(',')
            .map((recipient) => recipient.trim())
            .filter(Boolean) : [],
        bcc: values.value.bcc ? values.value.bcc
            .split(',')
            .map((recipient) => recipient.trim())
            .filter(Boolean) : [],
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
      isCreation,
      templateListRoutePath: getEmailTemplateListUrl(),
      values,
      errors,
      pageTitle,
      submitForm,
      isSubmitting,
      isInitialLoading,
      emailTemplate,
      serviceTemplateOptions: serviceTemplateList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
