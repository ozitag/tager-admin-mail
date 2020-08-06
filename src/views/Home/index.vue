<template>
  <navigation-grid :nav-items="navItemList" />
</template>

<script lang="ts">
import Vue from 'vue';
import { NavigationGridItem } from '@tager/admin-ui';
import { getEmailLogListUrl, getEmailTemplateListUrl } from '../../utils/paths';

export default Vue.extend({
  name: 'Home',
  data(): {
    emailNavItem: NavigationGridItem;
  } {
    return {
      emailNavItem: {
        name: 'E-Mail',
        linkList: [
          { url: getEmailTemplateListUrl(), text: 'Templates' },
          { url: getEmailLogListUrl(), text: 'Logs' },
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
