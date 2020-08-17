<template>
  <page title="E-Mail Templates">
    <template v-slot:content>
      <module-configuration />
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
import { defineComponent, onMounted } from '@vue/composition-api';
import { ColumnDefinition } from '@tager/admin-ui';

import { EmailTemplate } from '../../typings/model';
import { getTemplateList } from '../../services/requests';
import { getEmailTemplateFormUrl } from '../../utils/paths';
import useResource from '../../hooks/useResource';
import ModuleConfiguration from './components/ModuleConfiguration.vue';

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

export default defineComponent({
  name: 'EmailTemplateList',
  components: { ModuleConfiguration },
  setup() {
    const [
      fetchTemplateList,
      { data: templateList, loading, error },
    ] = useResource<Array<EmailTemplate>>({
      fetchResource: getTemplateList,
      initialValue: [],
    });

    onMounted(() => {
      fetchTemplateList();
    });

    return {
      columnDefs: COLUMN_DEFS,
      rowData: templateList,
      isRowDataLoading: loading,
      errorMessage: error,
      getEmailTemplateFormUrl,
    };
  },
});
</script>

<style scoped lang="scss"></style>
