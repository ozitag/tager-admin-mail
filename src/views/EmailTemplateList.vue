<template>
  <page title="E-Mail Templates">
    <template v-slot:content>
      <base-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
        enumerable
      >
        <template v-slot:cell(recipients)="{ row }">
          <ul>
            <li v-for="(recipient, index) of row.recipients" :key="index">
              {{ recipient }}
            </li>
          </ul>
        </template>

        <template v-slot:cell(actions)="{ row }">
          <base-button
            variant="icon"
            title="Edit"
            :href="getEmailTemplateFormUrl({ templateId: row.id })"
          >
            <svg-icon name="edit"></svg-icon>
          </base-button>
        </template>
      </base-table>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ColumnDefinition } from '@tager/admin-ui';
import { Nullable } from '@tager/admin-services';

import { EmailTemplate } from '../typings/model';
import { getTemplateList } from '../services/requests';
import { getEmailTemplateFormUrl } from '../utils/paths';

const COLUMN_DEFS: Array<ColumnDefinition<EmailTemplate>> = [
  {
    id: 1,
    name: 'Name',
    field: 'name',
  },
  {
    id: 2,
    name: 'Subject',
    field: 'subject',
  },
  {
    id: 4,
    name: 'Recipients',
    field: 'recipients',
  },
  {
    id: 5,
    name: 'Actions',
    field: 'actions',
    style: { width: '80px', textAlign: 'center' },
    headStyle: { width: '80px', textAlign: 'center' },
  },
];

export default Vue.extend({
  name: 'EmailTemplateList',
  data(): {
    columnDefs: Array<ColumnDefinition<EmailTemplate>>;
    rowData: Array<EmailTemplate>;
    isRowDataLoading: boolean;
    errorMessage: Nullable<string>;
  } {
    return {
      columnDefs: COLUMN_DEFS,
      rowData: [],
      isRowDataLoading: false,
      errorMessage: null,
    };
  },
  mounted(): void {
    this.refreshTemplateList();
  },
  methods: {
    refreshTemplateList(): Promise<void> {
      this.isRowDataLoading = true;

      return getTemplateList()
        .then((response) => {
          this.rowData = response.data;
        })
        .catch(console.error)
        .finally(() => {
          this.isRowDataLoading = false;
        });
    },
    getEmailTemplateFormUrl,
  },
});
</script>

<style scoped lang="scss"></style>
