<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useAdminUsers from '@/composables/admin/user/useAdminUsers';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { VBtn } from 'vuetify/components';

const { isError, isFetching, users } = useAdminUsers();
const search = ref();
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Rol', value: 'role.name' },
  { title: 'Acciones', value: 'actions', width: 50 }
];
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
      <UiParentCard title="Lista de sedes">
        <v-data-table :headers="headers" :search="search" :items="users" :loading="isFetching">
          <template v-slot:top>
            <v-toolbar
              class="bg-surface tw-px-3"
              flat
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }"
              :delay="200"
              :duration="250"
            >
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card" :variant="'outlined'" />
              <v-spacer></v-spacer>
              <VBtn :to="{ name: 'users-admin-add' }" color="primary" variant="elevated"> crear </VBtn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn icon color="primary" size="small">
                <Icon icon="mdi-edit" height="18" />
              </v-btn>
              <v-btn small color="error" icon size="small">
                <Icon icon="mdi-delete" height="18" />
              </v-btn>
            </div>
          </template>
          <template v-slot:no-data>
            <tr>
              <td colspan="3">Sin datos</td>
            </tr>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped></style>
