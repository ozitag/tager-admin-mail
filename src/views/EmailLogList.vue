<template>
  <page title="E-Mail Logs">
    <template v-slot:content>
      <base-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
      >
        <template v-slot:cell(body)="{ row }">
          <p v-html="row.body" />
        </template>
        <template v-slot:cell(error)="{ row }">
          <td class="error-cell" @click="toggleError(row.id)">
            <p
              v-if="row.error"
              :class="{ open: rowIdsWithOpenErrors.includes(row.id) }"
            >
              {{
                formatError(row.error, rowIdsWithOpenErrors.includes(row.id))
              }}
            </p>
          </td>
        </template>
      </base-table>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ColumnDefinition, formatBoolean } from '@tager/admin-ui';
import { Nullable } from '@tager/admin-services';

import { EmailLog } from '../typings/model';
import { getLogList } from '../services/requests';
import { capitalizeWord } from '../utils/common';

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
  {
    id: 8,
    name: 'Is debug?',
    field: 'isDebug',
    format: ({ row }) => formatBoolean(row.isDebug),
  },
  {
    id: 9,
    name: 'Error',
    field: 'error',
    useCustomDataCell: true,
    headStyle: { width: '300px' },
  },
];

export default Vue.extend({
  name: 'EmailTemplateList',
  data(): {
    columnDefs: Array<ColumnDefinition<EmailLog>>;
    rowData: Array<EmailLog>;
    isRowDataLoading: boolean;
    errorMessage: Nullable<string>;
    rowIdsWithOpenErrors: Array<number>;
  } {
    return {
      columnDefs: COLUMN_DEFS,
      rowData: [],
      isRowDataLoading: false,
      errorMessage: null,
      rowIdsWithOpenErrors: [],
    };
  },
  mounted(): void {
    this.refreshLogList();
  },
  methods: {
    refreshLogList(): Promise<void> {
      this.isRowDataLoading = true;

      return getLogList()
        .then((response) => {
          this.rowData = response.data;
        })
        .catch(console.error)
        .finally(() => {
          this.isRowDataLoading = false;
        });
    },
    toggleError(rowId: number) {
      if (this.rowIdsWithOpenErrors.includes(rowId)) {
        this.rowIdsWithOpenErrors = this.rowIdsWithOpenErrors.filter(
          (id) => id !== rowId
        );
      } else {
        this.rowIdsWithOpenErrors.push(rowId);
      }
    },
    formatError(error: string, isOpen: boolean) {
      if (error.length > 80 && !isOpen) {
        return error.slice(0, 80) + '...';
      }

      return error;
    },
  },
});
</script>

<style scoped lang="scss">
.error-cell {
  cursor: pointer;
  width: 300px;

  p {
    max-width: 250px;
    word-break: break-word;
  }
}
</style>
