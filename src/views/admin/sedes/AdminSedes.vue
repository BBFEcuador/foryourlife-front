<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useCampus from '@/composables/admin/useCampus';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';

const { campus, isError, isFetching } = useCampus();
const search = ref();

const breadcrumbs = ref([
  {
    title: 'Administrativo',
    disabled: false,
    href: '#'
  }
]);

const headers = [
  { title: 'País', value: 'country', class: 'my-header-style' },
  { title: 'Ciudad', value: 'city' },
  { title: 'Dirección', value: 'address' },
  { title: 'Teléfono', value: 'phone' },
  { title: 'Acciones', value: 'actions' }
];

const editCampus = () => {};

const deleteCampus = () => {};
</script>
<template>
  <BaseBreadcrumb :title="'Sedes'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de sedes">
        <v-data-table :headers="headers" :search="search" :items="campus" :loading="isFetching">
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
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card">
                <Icon icon="mdi-magnify" height="18"></Icon>
              </VTextField>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn icon color="primary" @click="editCampus()">
                <Icon icon="mdi-edit" height="18" />
              </v-btn>
              <v-btn small color="error" @click="deleteCampus()" icon>
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

<style scoped>
.custom-card {
  max-width: 400px;
}
</style>
