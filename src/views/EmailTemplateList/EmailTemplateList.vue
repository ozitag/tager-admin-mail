<template>
  <Page
    :title="$i18n.t('mail:EMailTemplates')"
    :header-buttons="[
      {
        text: $i18n.t('mail:testMail'),
        href: getTestMailUrl(),
      },
    ]">
    <ModuleConfiguration />

    <BaseTable
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
      enumerable
    >
      <template #cell(recipients)="{ row }">
        <ul>
          <li v-for="(recipient, index) of row.recipients" :key="index">
            {{ recipient }}
          </li>
        </ul>
      </template>

      <template #cell(actions)="{ row }">
        <BaseButton
          variant="icon"
          :title="$i18n.t('mail:edit')"
          :href="getEmailTemplateFormUrl({ templateId: row.id })"
        >
          <EditIcon />
        </BaseButton>
      </template>
    </BaseTable>
  </Page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import {
  BaseButton,
  BaseTable,
  ColumnDefinition,
  EditIcon,
} from '@tager/admin-ui';
import { useI18n } from '@tager/admin-services';
import { Page } from '@tager/admin-layout';

import { EmailTemplate } from '../../typings/model';
import { getTemplateList } from '../../services/requests';
import { getEmailTemplateFormUrl, getTestMailUrl } from '../../utils/paths';
import useResource from '../../hooks/useResource';

import ModuleConfiguration from './components/ModuleConfiguration.vue';

export default defineComponent({
  name: 'EmailTemplateList',
  methods: { getTestMailUrl },
  components: { EditIcon, BaseButton, BaseTable, Page, ModuleConfiguration },
  setup() {
    const { t } = useI18n();

    const [fetchTemplateList, { data: templateList, loading, error }] =
      useResource<Array<EmailTemplate>>({
        fetchResource: getTemplateList,
        initialValue: [],
      });

    onMounted(() => {
      fetchTemplateList();
    });

    const columnDefs: Array<ColumnDefinition<EmailTemplate>> = [
      {
        id: 0,
        name: t('mail:systemName'),
        field: 'alias',
      },
      {
        id: 1,
        name: t('mail:name'),
        field: 'name',
      },
      {
        id: 2,
        name: t('mail:subject'),
        field: 'subject',
      },
      {
        id: 4,
        name: t('mail:recipients'),
        field: 'recipients',
      },
      {
        id: 5,
        name: t('mail:actions'),
        field: 'actions',
        style: { width: '80px', textAlign: 'center' },
        headStyle: { width: '80px', textAlign: 'center' },
      },
    ];

    return {
      columnDefs,
      rowData: templateList,
      isRowDataLoading: loading,
      errorMessage: error,
      getEmailTemplateFormUrl,
    };
  },
});
</script>

<style scoped lang="scss"></style>
