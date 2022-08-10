<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view/>
  </PageLayout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {MenuItemType, PageLayout} from "@tager/admin-layout";
import {ViewListIcon} from "@tager/admin-ui";
import {getEmailLogListUrl, getEmailTemplateListUrl} from '../utils/paths';
import {useI18n} from "@tager/admin-services";

export default defineComponent({
  name: 'App',
  components: {
    PageLayout,
  },
  setup() {
    const i18n = useI18n();

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'mail',
        text: i18n.t('mail:EMailNotifications'),
        icon: ViewListIcon,
        children: [
          {text: i18n.t('mail:templates'), url: getEmailTemplateListUrl()},
          {text: i18n.t('mail:logs'), url: getEmailLogListUrl()},
        ],
      },
    ];

    return {
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
