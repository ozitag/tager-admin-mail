<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { EMAIL_MENU_ITEM } from '../constants/menu';

export default defineComponent({
  name: 'App',
  setup() {
    return {
      sidebarMenuList: [EMAIL_MENU_ITEM],
    };
  },
});
</script>

<style scoped lang="scss"></style>
