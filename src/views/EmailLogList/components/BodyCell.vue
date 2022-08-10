<template>
  <div>
    <p v-if="isOpen" class="email-body" v-html="log.body" />
    <BaseButton
      variant="outline-secondary"
      class="toggle-button"
      @click="toggleBody"
    >
      {{ isOpen ? $i18n.t('mail:hideBody') : $i18n.t('mail:viewBody') }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { BaseButton } from '@tager/admin-ui';

export default defineComponent({
  name: 'EmailBodyCell',
  components: { BaseButton },
  props: {
    log: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isOpen = ref<boolean>(false);

    function toggleBody() {
      isOpen.value = !isOpen.value;
    }

    return { isOpen, toggleBody };
  },
});
</script>

<style scoped>
.toggle-button {
  white-space: nowrap;
}

.email-body {
  margin-bottom: 1rem;
}
</style>
