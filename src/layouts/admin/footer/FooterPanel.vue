<script setup lang="ts">
import { shallowRef } from 'vue';

const footerLink = shallowRef([
  {
    title: 'Home',
    link: 'https://ableproadmin.com/vue/'
  },
  {
    title: 'Documentation',
    link: 'https://phoenixcoded.gitbook.io/able-pro/v/vue/'
  },
  {
    title: 'Support',
    link: 'https://phoenixcoded.authordesk.app/'
  }
]);
</script>
<template>
  <v-footer class="px-0 footer">
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <p class="text-caption mb-0">
          © 2025 Focus Your Life
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>
