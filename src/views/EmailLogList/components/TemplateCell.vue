<template>
  <div>
    <p>{{ log.template }}</p>
    <p v-if="log.serviceTemplate" class="service-template">
      {{ $i18n.t('mail:serviceTemplate') }}: "{{ log.serviceTemplate }}"
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
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
