<template>
  <Page :title="$i18n.t('mail:testMail')" :is-content-loading="isLoading">
    <form novalidate @submit.prevent>
      <FormField
        v-model:value="values.recipient"
        label="E-Mail"
        type="text"
        :error="errors.recipient"
      />
      <FormFieldSelect
        v-model:value="values.template"
        :label="$i18n.t('mail:template')"
        :options="templateOptions"
        :error="errors.template"
      />
      <table v-if="params.length">
        <tbody>
          <tr v-for="param in params" :key="param.key">
            <td>{{ param.label }}</td>
            <td>
              <BaseInput v-model:value="values.params[param.key]" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>

    <template v-if="!isLoading" #footer>
      <FormFooter
        :back-href="getEmailLogListUrl()"
        :is-submitting="isSubmitting"
        :is-creation="false"
        :submit-label="$i18n.t('mail:send')"
        :submit-and-exit-label="$i18n.t('mail:sendAndExit')"
        @submit="submitForm"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@tager/admin-layout';
import {
  FormField,
  FormFooter,
  FormFieldSelect,
  OptionType,
  BaseInput,
  TagerFormSubmitEvent,
} from '@tager/admin-ui';
import {
  convertRequestErrorToMap,
  useI18n,
  useResource,
  useToast,
} from '@tager/admin-services';

import { getTemplateList, sendTestEmail } from '@/services/requests';
import { EmailTemplate } from '@/typings/model';

import { getEmailLogListUrl } from '../../utils/paths';

import {
  convertFormValuesToSendPayload,
  FormValues,
  INITIAL_VALUES,
} from './EmailSendTest.helpers';

export default defineComponent({
  name: 'EmailSendTest',
  components: { FormFooter, FormField, FormFieldSelect, Page, BaseInput },
  setup: () => {
    const isSubmitting = ref<boolean>(false);
    const values = ref<FormValues>(INITIAL_VALUES);

    const toast = useToast();
    const router = useRouter();
    const { t } = useI18n();

    const [
      fetchTemplateList,
      { data: templateList, loading: isTemplateListLoading },
    ] = useResource<Array<EmailTemplate>>({
      fetchResource: getTemplateList,
      initialValue: [],
    });

    const errors = ref<Record<string, string>>({});

    const submitForm = async (e: TagerFormSubmitEvent) => {
      errors.value = {};
      try {
        isSubmitting.value = true;
        await sendTestEmail(convertFormValuesToSendPayload(values.value));

        if (e.type === 'save_exit') {
          router.push(getEmailLogListUrl());
        } else {
        }

        toast.show({
          variant: 'success',
          title: t('mail:success'),
          body: t('mail:testEmailSuccess'),
        });
      } catch (error: any) {
        errors.value = convertRequestErrorToMap(error);
        toast.show({
          variant: 'danger',
          title: t('mail:success'),
          body: t('mail:testEmailFailure'),
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    const templateOptions = computed<Array<OptionType<string>>>(() =>
      templateList.value.map((item) => ({
        label: item.name,
        value: item.alias,
      }))
    );

    const params = computed<Array<{ key: string; label: string }>>(() => {
      const found = templateList.value.find(
        (item) => item.alias === (values.value.template?.value || 0)
      );
      return found?.variables || [];
    });

    onMounted(() => fetchTemplateList());

    const isLoading = computed(() => isTemplateListLoading.value);

    watch(
      () => values.value.template,
      () => (values.value.params = {})
    );

    return {
      isLoading,
      submitForm,
      isSubmitting,
      values,
      errors,
      templateOptions,
      params,
    };
  },
  methods: { getEmailLogListUrl },
});
</script>
