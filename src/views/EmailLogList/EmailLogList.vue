<template>
  <Page :title="$i18n.t('mail:EMailLogs')" :header-buttons="[
      {
        text: $i18n.t('mail:testMail'),
        href: getTestMailUrl(),
      },
    ]">
    <DataTable
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
      :search-query="searchQuery"
      :pagination="{
        pageSize,
        pageNumber,
        pageCount,
        disabled: isRowDataLoading,
      }"
      @change="handleChange"
    >
      <template #cell(template)="{ row }">
        <template-cell :log="row" />
      </template>
      <template #cell(body)="{ row }">
        <body-cell :log="row" />
      </template>
      <template #cell(error)="{ row }">
        <error-cell :log="row" />
      </template>
      <template #cell(attachments)="{ row }">
        <attachments-cell :log="row" />
      </template>
    </DataTable>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ColumnDefinition, useDataTable, DataTable } from '@tager/admin-ui';
import { useI18n } from '@tager/admin-services';
import { Page } from '@tager/admin-layout';

import { EmailLog } from '../../typings/model';
import { getLogList } from '../../services/requests';
import { capitalizeWord } from '../../utils/common';
import { getTestMailUrl } from '../../utils/paths';

import BodyCell from './components/BodyCell.vue';
import ErrorCell from './components/ErrorCell.vue';
import TemplateCell from './components/TemplateCell.vue';
import AttachmentsCell from './components/AttachmentsCell.vue';

export default defineComponent({
  name: 'EmailLogList',
  methods: { getTestMailUrl },
  components: {
    Page,
    DataTable,
    BodyCell,
    ErrorCell,
    TemplateCell,
    AttachmentsCell,
  },
  setup() {
    const { t } = useI18n();

    const {
      isLoading: isRowDataLoading,
      rowData: logList,
      errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageNumber,
      pageCount,
    } = useDataTable<EmailLog>({
      fetchEntityList: (params) =>
        getLogList({
          query: params.searchQuery,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        }),
      initialValue: [],
      resourceName: 'Log list',
      pageSize: 250,
    });

    const columnDefs: Array<ColumnDefinition<EmailLog>> = [
      {
        id: 1,
        name: 'ID',
        field: 'id',
        style: { width: '50px', textAlign: 'center' },
        headStyle: { width: '50px', textAlign: 'center' },
      },
      { id: 2, name: t('mail:template'), field: 'template' },
      { id: 3, name: t('mail:recipient'), field: 'recipient' },
      { id: 4, name: t('mail:subject'), field: 'subject' },
      { id: 5, name: t('mail:body'), field: 'body' },
      {
        id: 6,
        name: t('mail:status'),
        field: 'status',
        format: ({ row }) => capitalizeWord(row.status),
      },
      { id: 7, name: t('mail:date'), field: 'createdAt', type: 'datetime' },
      { id: 8, name: t('mail:attachments'), field: 'attachments' },
      {
        id: 9,
        name: t('mail:error'),
        field: 'error',
        headStyle: { width: '300px' },
      },
    ];

    return {
      columnDefs,
      rowData: logList,
      isRowDataLoading,
      errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageNumber,
      pageCount,
    };
  },
});
</script>

<style scoped lang="scss"></style>
