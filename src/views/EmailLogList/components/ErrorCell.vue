<template>
  <td class="error-cell" @click="toggleError">
    <p v-if="errorText" :class="{ open: isOpen }">
      {{ errorText }}
    </p>
  </td>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'EmailErrorCell',
  props: {
    log: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isOpen = ref<boolean>(false);

    function toggleError() {
      isOpen.value = !isOpen.value;
    }

    const errorText = computed(() => {
      if (
        typeof props.log.error === 'string' &&
        props.log.error.length > 80 &&
        !isOpen.value
      ) {
        return props.log.error.slice(0, 80) + '...';
      }

      return props.log.error;
    });

    return { isOpen, toggleError, errorText };
  },
});
</script>

<style scoped lang="scss">
.error-cell {
  cursor: pointer;
  width: 300px;

  p {
    max-width: 250px;
    word-break: break-word;
  }
}
</style>
