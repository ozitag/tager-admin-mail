<template>
  <div>
    <p>{{ template }}</p>
    <p v-if="serviceTemplate" class="service-template">
      Service Template: "{{ serviceTemplate }}"
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Nullable } from '@tager/admin-services';

type Props = Readonly<{
  template: Nullable<string>;
  serviceTemplate: Nullable<string>;
}>;

export default defineComponent<Props>({
  name: 'EmailTemplateCell',
  props: {
    template: {
      type: String,
      default: null,
    },
    serviceTemplate: {
      type: String,
      default: null,
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
