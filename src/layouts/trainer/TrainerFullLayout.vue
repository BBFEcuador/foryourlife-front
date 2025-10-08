<script setup lang="ts">
import { useCustomizerStore } from '../../stores/customizer';
import FooterPanel from './footer/FooterPanel.vue';

import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import LoaderWrapper from './LoaderWrapper.vue';
import VerticalTrainerHeader from '@/layouts/trainer/vertical-header/VerticalTrainerHeader.vue';

const customizer = useCustomizerStore();
</script>

<template>
  <v-locale-provider>
    <v-app
      :theme="customizer.actTheme"
      :class="[
        customizer.actTheme,
        customizer.fontTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
        customizer.inputBg ? 'inputWithbg' : ''
      ]"
    >
      <v-main class="page-wrapper">
        <v-container fluid>
          <div>
            <LoaderWrapper />
            <RouterView />
          </div>
        </v-container>
        <v-container fluid class="pt-0">
          <div>
            <FooterPanel />
          </div>
        </v-container>
      </v-main>
      <VerticalSidebarVue />
      <VerticalTrainerHeader />
    </v-app>
  </v-locale-provider>
</template>
