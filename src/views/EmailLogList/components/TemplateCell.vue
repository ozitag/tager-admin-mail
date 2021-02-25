<template>
  <div>
    <p>{{ log.template }}</p>
    <p v-if="log.serviceTemplate" class="service-template">
      {{ $t('mail:serviceTemplate') }}: "{{ log.serviceTemplate }}"
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { EmailLog } from '../../../typings/model';

type Props = Readonly<{ log: EmailLog }>;

export default defineComponent<Props>({
  name: 'EmailTemplateCell',
  props: {
    log: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped>
.service-template {
  font-size: 0.85rem;
  font-style: italic;
}
</style>
