<template>
  <div v-if="config" class="config-block">
    <ToggleSection :label="$i18n.t('mail:configuration')">
      <table>
        <tbody>
          <tr>
            <td>
              {{ $i18n.t('mail:enabled') }}
            </td>
            <td>
              {{ config.enabled ? $i18n.t('mail:Yes') : $i18n.t('mail:No') }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $i18n.t('mail:allowedEmails') }}
            </td>
            <td>
              {{
                Array.isArray(config.allowedEmails)
                  ? config.allowedEmails.join(', ')
                  : config.allowedEmails
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $i18n.t('mail:subjectTemplate') }}
            </td>
            <td>
              {{ config.subjectTemplate }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $i18n.t('mail:service') }}
            </td>
            <td>
              {{ config.service }}
            </td>
          </tr>
        </tbody>
      </table>
    </ToggleSection>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { ToggleSection } from '@tager/admin-ui';
import { Nullable } from '@tager/admin-services';

import { EmailModuleConfig } from '../../../typings/model';
import useResource from '../../../hooks/useResource';
import { getEmailModuleConfiguration } from '../../../services/requests';

export default defineComponent({
  name: 'ModuleConfiguration',
  components: {
    ToggleSection,
  },
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

  table {
    max-width: 600px;

    td:first-child {
      font-weight: bold;
      width: 200px;
    }
  }
}
</style>
