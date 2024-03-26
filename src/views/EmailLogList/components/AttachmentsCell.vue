<template>
  <ul>
    <li v-for="(attachment, index) of log.attachments" :key="index">
      <a :href="attachment.url" target="_blank">{{ attachment.name }}</a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmailAttachmentsCell',
  props: {
    log: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
a {
  color: var(--primary);

  &:hover {
    text-decoration: underline;
  }
}
</style>
