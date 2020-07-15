<template>
  <navigation-grid :nav-items="navItemList" />
</template>

<script lang="ts">
import Vue from 'vue';
import { NavigationGridItem } from '@tager/admin-ui';

import { EMAIL_ROUTE_PATHS } from '../../constants/paths';

export default Vue.extend({
  name: 'Home',
  data(): {
    emailNavItem: NavigationGridItem;
  } {
    return {
      emailNavItem: {
        name: 'E-Mail',
        linkList: [
          { href: EMAIL_ROUTE_PATHS.TEMPLATE_LIST, label: 'Templates' },
          { href: EMAIL_ROUTE_PATHS.LOG_LIST, label: 'Logs' },
        ],
      },
    };
  },
  computed: {
    navItemList(): Array<NavigationGridItem> {
      return [this.emailNavItem];
    },
  },
});
</script>

<style scoped lang="scss"></style>
