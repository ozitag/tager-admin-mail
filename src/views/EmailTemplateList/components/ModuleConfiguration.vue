<template>
  <div v-if="config" class="config-block">
    <h4>{{ $i18n.t('mail:configuration') }}:</h4>
    <ul class="option-list">
      <li>
        <span>{{ $i18n.t('mail:enabled') }}: </span>
        <span>{{ config.enabled }}</span>
      </li>
      <li>
        <span>{{ $i18n.t('mail:allowedEmails') }}: </span>
        <span>
          {{
            Array.isArray(config.allowedEmails)
              ? config.allowedEmails.join(', ')
              : config.allowedEmails
          }}
        </span>
      </li>
      <li>
        <span>{{ $i18n.t('mail:subjectTemplate') }}: </span>
        <span>{{ config.subjectTemplate }}</span>
      </li>
      <li>
        <span>{{ $i18n.t('mail:service') }}: </span>
        <span>{{ config.service }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { Nullable } from '@tager/admin-services';

import { EmailModuleConfig } from '../../../typings/model';
import useResource from '../../../hooks/useResource';
import { getEmailModuleConfiguration } from '../../../services/requests';

export default defineComponent({
  name: 'ModuleConfiguration',
  setup() {
    const [fetchModuleConfig, { data: moduleConfig }] = useResource<
      Nullable<EmailModuleConfig>
    >({
      fetchResource: getEmailModuleConfiguration,
      initialValue: null,
    });

    onMounted(() => {
      fetchModuleConfig();
    });

    return { config: moduleConfig };
  },
});
</script>

<style scoped lang="scss">
.config-block {
  margin-bottom: 1rem;
}

.option-list {
  padding-left: 1rem;
  list-style-type: disc;
}
</style>
