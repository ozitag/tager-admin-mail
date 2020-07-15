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

      <form-field-rich-text-input
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
import Vue from 'vue';
import { convertRequestErrorToMap, Nullable } from '@tager/admin-services';

import {
  getTemplate,
  TemplateUpdatePayload,
  updateTemplate,
} from '../services/requests';
import { EmailTemplate } from '../typings/model';
import { EMAIL_ROUTE_PATHS } from '../constants/paths';

type FormValues = { subject: string; body: string; recipients: string };

export default Vue.extend({
  name: 'EmailTemplateForm',
  data(): {
    emailTemplate: Nullable<EmailTemplate>;
    values: FormValues;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isInitialLoading: boolean;
    templateListRoutePath: string;
  } {
    return {
      emailTemplate: null,
      values: { subject: '', body: '', recipients: '' },
      errors: {},
      isSubmitting: false,
      isInitialLoading: false,
      templateListRoutePath: EMAIL_ROUTE_PATHS.TEMPLATE_LIST,
    };
  },
  computed: {
    templateAlias(): string {
      return this.$route.params.templateAlias;
    },
    pageTitle(): string {
      return this.emailTemplate
        ? `E-Mail template "${this.emailTemplate.name}"`
        : 'E-Mail template';
    },
  },
  mounted(): void {
    this.isInitialLoading = true;

    getTemplate(this.templateAlias)
      .then((response) => {
        this.values = this.convertEmailTemplateToFormValues(response.data);
        this.emailTemplate = response.data;
      })
      .catch(console.error)
      .finally(() => {
        this.isInitialLoading = false;
      });
  },
  methods: {
    convertEmailTemplateToFormValues(template: EmailTemplate): FormValues {
      return {
        subject: template.subject,
        body: template.body,
        recipients: template.recipients.join(','),
      };
    },
    submitForm() {
      this.isSubmitting = true;

      const body: TemplateUpdatePayload = {
        ...this.values,
        recipients: this.values.recipients
          .split(',')
          .map((recipient) => recipient.trim())
          .filter(Boolean),
      };

      updateTemplate(this.templateAlias, body)
        .then(() => {
          this.errors = {};
          this.$router.push(EMAIL_ROUTE_PATHS.TEMPLATE_LIST);

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: 'Template has been successfully updated',
          });
        })
        .catch((error) => {
          console.error(error);
          this.errors = convertRequestErrorToMap(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Template update has been failed',
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    getKeyTemplate(key: string): string {
      return `{{${key}}}`;
    },
    copyVarTemplate(key: string) {
      navigator.clipboard
        .writeText(this.getKeyTemplate(key))
        .catch(console.error);
    },
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
