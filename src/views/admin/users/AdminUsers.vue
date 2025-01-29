<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useAdminUsers from '@/composables/admin/useAdminUsers';
import { ref } from 'vue';

const {} = useAdminUsers();
const breadcrumbs = ref([
  {
    title: 'Others',
    disabled: false,
    href: '#'
  }
]);
</script>
<template>
  <BaseBreadcrumb :title="'Usuarios'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Lista de usuarios"> </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped></style>
