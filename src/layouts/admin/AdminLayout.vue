<template>
  <v-app>
    <LoaderWrapper />
    <RouterView />
  </v-app>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import LoaderWrapper from '../dashboard/LoaderWrapper.vue';
</script>
