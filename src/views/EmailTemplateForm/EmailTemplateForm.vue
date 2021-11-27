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
        <form-field-select
          v-model="values.editorMode"
          name="editorMode"
          :error="errors.editorMode"
          :label="t('mail:editorMode')"
          :no-options-message="t('mail:noTemplates')"
          :options="editorModeOptions"
        />

        <form-field-message-template
          v-if="isVisualEditorMode"
          v-model="values.body"
          :label="t('mail:body')"
          :variable-list="emailTemplate ? emailTemplate.variables : []"
          :error="errors.body"
          type="richText"
          name="body"
        />

        <form-field-code v-if="isCodeEditorMode" v-model="values.body" />
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
} from '../../services/requests';
import { EmailServiceTemplate, EmailTemplate } from '../../typings/model';
import { getEmailTemplateListUrl } from '../../utils/paths';
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import useResource from '../../hooks/useResource';
import { OptionType, useTranslation } from '@tager/admin-ui';
import {
  convertEmailTemplateToFormValues,
  FormValues,
} from './EmailTemplateForm.helpers';

export default defineComponent({
  name: 'EmailTemplateForm',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    /** Editor mode **/

    const editorModeOptions = computed<OptionType[]>(() => [
      {
        label: t('mail:visual'),
        value: 'VISUAL',
      },
      {
        label: t('mail:code'),
        value: 'CODE',
      },
    ]);

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

    const isCreation = computed(() => templateId.value === 'create');

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

    watch(templateId, () => {
      fetchEmailTemplate();
    });

    /** Form related logic */

    const values = ref<FormValues>(
      convertEmailTemplateToFormValues(
        emailTemplate.value,
        serviceTemplateList.value,
        editorModeOptions.value
      )
    );
    const errors = ref<Record<string, string>>({});
    const isSubmitting = ref<boolean>(false);

    watch([emailTemplate, serviceTemplateList], () => {
      values.value = convertEmailTemplateToFormValues(
        emailTemplate.value,
        serviceTemplateList.value,
        editorModeOptions.value
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
        cc: values.value.cc
          ? values.value.cc
              .split(',')
              .map((recipient) => recipient.trim())
              .filter(Boolean)
          : [],
        bcc: values.value.bcc
          ? values.value.bcc
              .split(',')
              .map((recipient) => recipient.trim())
              .filter(Boolean)
          : [],
        editorMode: values.value.editorMode?.value ?? null,
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

    const isVisualEditorMode = computed(
      () => values.value.editorMode?.value === 'VISUAL'
    );

    const isCodeEditorMode = computed(
      () => values.value.editorMode?.value === 'Code'
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
      isVisualEditorMode,
      isCodeEditorMode,
      editorModeOptions,
    };
  },
});
</script>

<style scoped lang="scss"></style>
