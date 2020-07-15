<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue';

import { EMAIL_MENU_ITEM } from '../constants/menu';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      sidebarMenuList: [EMAIL_MENU_ITEM],
    };
  },
});
</script>

<style scoped lang="scss"></style>
