<template>
  <page :title="t('mail:EMailLogs')">
    <template v-slot:content>
      <data-table
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
        <template v-slot:cell(template)="{ row }">
          <template-cell :log="row" />
        </template>
        <template v-slot:cell(body)="{ row }">
          <body-cell :log="row" />
        </template>
        <template v-slot:cell(error)="{ row }">
          <error-cell :log="row" />
        </template>
        <template v-slot:cell(attachments)="{ row }">
          <attachments-cell :log="row" />
        </template>
      </data-table>
    </template>
  </page>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import {
  ColumnDefinition,
  useDataTable,
  useTranslation,
} from '@tager/admin-ui';

import { EmailLog } from '../../typings/model';
import { getLogList } from '../../services/requests';
import { capitalizeWord } from '../../utils/common';
import BodyCell from './components/BodyCell.vue';
import ErrorCell from './components/ErrorCell.vue';
import TemplateCell from './components/TemplateCell.vue';
import AttachmentsCell from './components/AttachmentsCell.vue';

export default defineComponent({
  name: 'EmailLogList',
  components: { BodyCell, ErrorCell, TemplateCell, AttachmentsCell },
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

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
      context,
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
        useCustomDataCell: true,
        headStyle: { width: '300px' },
      },
    ];

    return {
      t,
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
