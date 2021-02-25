<template>
  <page :title="t('mail:EMailTemplates')">
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
            :title="t('mail:edit')"
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
import { defineComponent, onMounted, SetupContext } from '@vue/composition-api';
import { ColumnDefinition, useTranslation } from '@tager/admin-ui';

import { EmailTemplate } from '../../typings/model';
import { getTemplateList } from '../../services/requests';
import { getEmailTemplateFormUrl } from '../../utils/paths';
import useResource from '../../hooks/useResource';
import ModuleConfiguration from './components/ModuleConfiguration.vue';

export default defineComponent({
  name: 'EmailTemplateList',
  components: { ModuleConfiguration },
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

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

    const columnDefs: Array<ColumnDefinition<EmailTemplate>> = [
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
      t,
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
