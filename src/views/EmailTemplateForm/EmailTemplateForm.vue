<template>
  <Page :title="pageTitle" :is-content-loading="isInitialLoading">
    <form novalidate @submit.prevent>
      <FieldValue
        v-if="!isCreation"
        :label="$i18n.t('mail:systemName')"
        type="text"
        :value="values.alias"
      />

      <FormField
        v-model:value="values.subject"
        name="subject"
        :error="errors.subject"
        :label="$i18n.t('mail:subject')"
      />

      <FormField
        v-model:value="values.recipients"
        name="recipients"
        :error="errors.recipients"
        :label="$i18n.t('mail:recipients')"
      />

      <FormField
        v-model:value="values.cc"
        name="cc"
        :error="errors.cc"
        :label="$i18n.t('mail:cc')"
      />

      <FormField
        v-model:value="values.bcc"
        name="bcc"
        :error="errors.bcc"
        :label="$i18n.t('mail:bcc')"
      />

      <FormField
        v-mode:value="values.fromName"
        name="fromName"
        :error="errors.fromName"
        :label="$i18n.t('mail:fromName')"
      />

      <FormField
        v-model:value="values.fromEmail"
        name="fromEmail"
        :error="errors.fromEmail"
        :label="$i18n.t('mail:fromEmail')"
      />

      <FormFieldCheckbox
        v-model:checked="values.useServiceTemplate"
        name="useServiceTemplate"
        :error="errors.useServiceTemplate"
        :label="$i18n.t('mail:useServiceTemplate')"
      />

      <FormFieldSelect
        v-if="values.useServiceTemplate"
        v-model:value="values.serviceTemplate"
        name="serviceTemplate"
        :error="errors.serviceTemplate"
        :label="$i18n.t('mail:serviceTemplate')"
        :no-options-message="$i18n.t('mail:noTemplates')"
        :options="serviceTemplateOptions"
      />

      <template v-else>
        <FormFieldSelect
          v-model:value="values.editorMode"
          name="editorMode"
          :error="errors.editorMode"
          :label="$i18n.t('mail:editorMode')"
          :no-options-message="$i18n.t('mail:noTemplates')"
          :options="editorModeOptions"
        />

        <FormFieldMessageTemplate
          v-if="isVisualEditorMode"
          v-model:value="values.body"
          :label="$i18n.t('mail:body')"
          :variable-list="emailTemplate ? emailTemplate.variables : []"
          :error="errors.body"
          type="richText"
          name="body"
        />
        <Code v-if="isCodeEditorMode" v-model:value="values.body" />
      </template>
    </form>
    <template #footer>
      <FormFooter
        :back-href="templateListRoutePath"
        :is-submitting="isSubmitting"
        :is-creation="true"
        :submit-label="
          isCreation ? $i18n.t('mail:create') : $i18n.t('mail:save')
        "
        @submit="submitForm"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  convertRequestErrorToMap,
  Nullable,
  useI18n,
  useToast,
  navigateBack,
} from '@tager/admin-services';
import {
  Code,
  FieldValue,
  FormField,
  FormFieldCheckbox,
  FormFieldMessageTemplate,
  FormFieldSelect,
  FormFooter,
  OptionType,
} from '@tager/admin-ui';
import { Page } from '@tager/admin-layout';

import {
  getServiceTemplateList,
  getTemplate,
  TemplateUpdatePayload,
  updateTemplate,
} from '../../services/requests';
import { EmailServiceTemplate, EmailTemplate } from '../../typings/model';
import { getEmailTemplateListUrl } from '../../utils/paths';
import useResource from '../../hooks/useResource';

import {
  convertEmailTemplateToFormValues,
  FormValues,
} from './EmailTemplateForm.helpers';

enum EditorMode {
  Visual = 'VISUAL',
  Code = 'CODE',
}

export default defineComponent({
  name: 'EmailTemplateForm',
  components: {
    Code,
    FormFooter,
    FormFieldMessageTemplate,
    FormFieldSelect,
    FormFieldCheckbox,
    FormField,
    FieldValue,
    Page,
  },
  setup() {
    const { t } = useI18n();

    const toast = useToast();
    const router = useRouter();
    const route = useRoute();

    /** Editor mode **/

    const editorModeOptions = computed<OptionType[]>(() => [
      {
        label: t('mail:visual'),
        value: EditorMode.Visual,
      },
      {
        label: t('mail:code'),
        value: EditorMode.Code,
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

    const templateId = computed(
      () => route.params.templateId as string | undefined
    );

    const isCreation = computed(() => templateId.value === 'create');

    const [
      fetchEmailTemplate,
      { data: emailTemplate, loading: isTemplateLoading },
    ] = useResource<Nullable<EmailTemplate>>({
      fetchResource: () => {
        if (templateId.value && !isCreation.value) {
          return getTemplate(templateId.value);
        }

        return Promise.resolve({ data: null });
      },
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

      updateTemplate(templateId.value || '', body)
        .then(() => {
          errors.value = {};
          navigateBack(router, getEmailTemplateListUrl());

          toast.show({
            variant: 'success',
            title: t('mail:success'),
            body: t('mail:templateHasBeenSuccessfullyUpdated'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          toast.show({
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
      () => values.value.editorMode?.value === EditorMode.Visual
    );

    const isCodeEditorMode = computed(
      () => values.value.editorMode?.value === EditorMode.Code
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
