<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {  PageLayout } from '@tager/admin-layout';
import { useI18n } from '@tager/admin-services';

import {
getTagerMailSidebar,

} from '../utils/paths';

export default defineComponent({
  name: 'App',
  components: {
    PageLayout,
  },
  setup() {
    const i18n = useI18n();

    return {
      sidebarMenuList: [getTagerMailSidebar(i18n)]
    };
  },
});
</script>

<style scoped lang="scss"></style>
