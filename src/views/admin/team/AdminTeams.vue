<script setup lang="ts">
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import type { Criteria, Filter } from '@/models/Criteria';
import TeamFilters from './TeamFilters.vue';

const { data, isError, isLoading, criteriaMutations, refetchTeams } = useAdminTeams();

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);

const showFilters = ref(false);
const showFiltersDrawer = ref(false);
const { lgAndUp } = useDisplay();

const onFilterSubmit = (criteria: Criteria) => {
  criteriaMutations.mutate(criteria);
};

const onFilterClear = () => {
  criteriaMutations.mutate({ filters: [] as Filter[], limit: 0, offset: 0 });
};
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
},
{
  name: 'Nombre2',
  email: 'correo2',
  phone: 'telefono2',
  participantLevel: { courseLevel: 'nivel2' },
},
{
  name: 'Nombre3',
  email: 'correo3',
  phone: 'telefono3',
  participantLevel: { courseLevel: 'nivel3' },
},
{
  name: 'Nombre4',
  email: 'correo4',
  phone: 'telefono4',
  participantLevel: { courseLevel: 'nivel3' },
},
]
</script>

<template>
  <BaseBreadcrumb :title="'Equipos'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters">
      <UiParentCard title="Filtros">
        <PerfectScrollbar class="max-h d-flex flex-column ga-3">
          <TeamFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
        </PerfectScrollbar>
      </UiParentCard>
    </VCol>
    <VCol cols="12" :lg="showFilters ? 12 : 9">
      <div class="d-flex flex-column ga-4">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <div class="w-full d-flex">
              <VTextField placeholder="buscar" hide-details>
                <template #prepend-inner>
                  <Icon icon="material-symbols:search" />
                </template>
              </VTextField>
              <VSpacer />
              <VBtn variant="text" @click="showFilters = !showFilters" v-if="lgAndUp">
                <template #prepend>
                  <Icon icon="material-symbols:filter-alt" height="16" />
                </template>
                <p>Filtros</p>
              </VBtn>
              <VBtn variant="text" @click="showFiltersDrawer = !showFiltersDrawer" v-else>
                <template #prepend>
                  <Icon icon="material-symbols:filter-alt" height="16" />
                </template>
                <p>Filtros</p>
              </VBtn>
            </div>
          </v-card-text>
        </v-card>
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTable :items="teams" :headers="headers">
            </VDataTable>
          </v-card-text>
        </v-card>
      </div>
    </VCol>  
  </VRow>
</template>

<style scoped></style>
