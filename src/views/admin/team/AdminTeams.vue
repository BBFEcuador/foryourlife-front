<script setup lang="ts">
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';

const {data, isError, isLoading} = useAdminTeams();

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);

const headers = ref([
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' },
  { title: 'Acciones', value: 'actions', width: 50 }
]);
const teams = [{
  name: 'Nombre1',
  email: 'correo1',
  phone: 'telefono1',
  participantLevel: { courseLevel: 'nivel1' },
}]
</script>

<template>
  <BaseBreadcrumb :title="'Equipos'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTable :items="teams"
              :headers="headers">
            </VDataTable>
          </v-card-text>
        </v-card>
</template>

<style scoped></style>
