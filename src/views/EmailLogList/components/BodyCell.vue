<template>
  <div>
    <p v-if="isOpen" class="email-body" v-html="log.body" />
    <base-button
      variant="outline-secondary"
      class="toggle-button"
      @click="toggleBody"
    >
      {{ isOpen ? $t('mail:hideBody') : $t('mail:viewBody') }}
    </base-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { EmailLog } from '../../../typings/model';

type Props = Readonly<{ log: EmailLog }>;

export default defineComponent<Props>({
  name: 'EmailBodyCell',
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
