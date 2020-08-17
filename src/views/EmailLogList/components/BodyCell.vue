<template>
  <div>
    <p v-if="isOpen" class="email-body" v-html="emailBody" />
    <base-button
      variant="outline-secondary"
      class="toggle-button"
      @click="toggleBody"
    >
      {{ isOpen ? 'Hide Body' : 'View Body' }}
    </base-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'EmailBodyCell',
  props: {
    emailBody: {
      type: String,
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
