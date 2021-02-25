<template>
  <navigation-grid :nav-items="navItemList" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
} from '@vue/composition-api';
import { NavigationGridItem, useTranslation } from '@tager/admin-ui';

import { getEmailLogListUrl, getEmailTemplateListUrl } from '../utils/paths';

export default defineComponent({
  name: 'Home',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    const emailNavItem = ref<NavigationGridItem>({
      name: 'E-Mail',
      linkList: [
        { url: getEmailTemplateListUrl(), text: t('mail:templates') },
        { url: getEmailLogListUrl(), text: t('mail:logs') },
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
