<template>
  <page title="E-Mail Logs">
    <template v-slot:content>
      <base-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
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
      </base-table>
    </template>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { ColumnDefinition } from '@tager/admin-ui';

import { EmailLog } from '../../typings/model';
import { getLogList } from '../../services/requests';
import { capitalizeWord } from '../../utils/common';
import BodyCell from './components/BodyCell.vue';
import ErrorCell from './components/ErrorCell.vue';
import TemplateCell from './components/TemplateCell.vue';
import useResource from '../../hooks/useResource';
import AttachmentsCell from './components/AttachmentsCell.vue';

const COLUMN_DEFS: Array<ColumnDefinition<EmailLog>> = [
  {
    id: 1,
    name: 'ID',
    field: 'id',
    style: { width: '50px', textAlign: 'center' },
    headStyle: { width: '50px', textAlign: 'center' },
  },
  { id: 2, name: 'Template', field: 'template' },
  { id: 3, name: 'Recipient', field: 'recipient' },
  { id: 4, name: 'Subject', field: 'subject' },
  { id: 5, name: 'Body', field: 'body' },
  {
    id: 6,
    name: 'Status',
    field: 'status',
    format: ({ row }) => capitalizeWord(row.status),
  },
  { id: 7, name: 'Date', field: 'createdAt', type: 'datetime' },
  { id: 8, name: 'Attachments', field: 'attachments' },
  {
    id: 9,
    name: 'Error',
    field: 'error',
    useCustomDataCell: true,
    headStyle: { width: '300px' },
  },
];

export default defineComponent({
  name: 'EmailTemplateList',
  components: { BodyCell, ErrorCell, TemplateCell, AttachmentsCell },
  setup() {
    const [fetchLogList, { data: logList, loading, error }] = useResource<
      Array<EmailLog>
    >({
      fetchResource: getLogList,
      initialValue: [],
    });

    onMounted(() => {
      fetchLogList();
    });

    return {
      columnDefs: COLUMN_DEFS,
      rowData: logList,
      isRowDataLoading: loading,
      errorMessage: error,
    };
  },
});
</script>

<style scoped lang="scss"></style>