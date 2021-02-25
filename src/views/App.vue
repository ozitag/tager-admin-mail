<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';

import { MenuItemType } from '@tager/admin-layout';
import { getEmailLogListUrl, getEmailTemplateListUrl } from '../utils/paths';
import { useTranslation } from '@tager/admin-ui';

export default defineComponent({
  name: 'App',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'mail',
        text: t('mail:EMailNotifications'),
        icon: 'email',
        children: [
          { text: t('mail:templates'), url: getEmailTemplateListUrl() },
          { text: t('mail:logs'), url: getEmailLogListUrl() },
        ],
      },
    ];

    return {
      t,
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
