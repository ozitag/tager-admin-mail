<template>
  <navigation-grid :nav-items="navItemList" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { NavigationGridItem } from '@tager/admin-ui';

import { getEmailLogListUrl, getEmailTemplateListUrl } from '../utils/paths';

export default defineComponent({
  name: 'Home',
  setup() {
    const emailNavItem = ref<NavigationGridItem>({
      name: 'E-Mail',
      linkList: [
        { url: getEmailTemplateListUrl(), text: 'Templates' },
        { url: getEmailLogListUrl(), text: 'Logs' },
      ],
    });

    const navItemList = computed<Array<NavigationGridItem>>(() => [
      emailNavItem.value,
    ]);

    return { navItemList };
  },
});
</script>

<style scoped lang="scss"></style>
