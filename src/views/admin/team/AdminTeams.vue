<script setup lang="ts">
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import type { Criteria, Filter } from '@/models/Criteria';
import TeamFilters from './TeamFilters.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { router } from '@/router';
import type { Participant } from '@/models/Participants';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const { data, isError, isLoading, criteriaMutations, refetchTeams,teamsData } = useAdminTeams();
const search = ref()

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
  { title: 'Nombre', value: 'name', class: 'my-header-style', sortable: true },
  { title: 'Entrenador', value: 'trainer.name', sortable: true },
  { title: 'Correo', value: 'trainer.email', sortable: true },
  { title: 'Inicio de Clase', value: 'trainingData.startDate', sortable: true },
  { title: 'Fin de Clase', value: 'trainingData.endDate', sortable: true },
  { title: 'Quitar participantes', value: 'actions' }
]);

const refreshTeams = () => {
  refetchTeams();
};

const addTeam = () => {
  router.push({ name: 'teams-admin-add' });
};

const removeParticipantSelected = (item: string) => {
  router.push({ name: 'teams-admin-update', params: {id: item}})
};

watch(criteriaMutations.isError,() => {
  if (criteriaMutations.isError.value) {
    
  }
})

</script>

<template>
  <BaseBreadcrumb :title="'Equipos'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters">
      <UiParentCard title="Filtros">
        <PerfectScrollbar class="tw:max-h-[700px] d-flex flex-column ga-3">
          <TeamFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
        </PerfectScrollbar>
      </UiParentCard>
    </VCol>
    <VCol cols="12" :lg="showFilters ? 12 : 9">
      <div class="d-flex flex-column ga-4">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <div class="w-full d-flex">
              <VBtn variant="text" color="primary" @click="refreshTeams">
                <template #prepend>
                  <Icon icon="material-symbols:refresh" height="25" />
                </template>
              </VBtn>
              <VTextField placeholder="buscar" hide-details v-model="search">
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
              <VBtn color="secondary" variant="text" @click="addTeam">
                <Icon icon="weui:add-friends-filled" height="20" class="mr-2" />Nuevo Equipo
              </VBtn>
            </div>
          </v-card-text>
        </v-card>
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTable :items="teamsData" :headers="headers" :loading="isLoading" :search="search">
              <template #item.actions="{ item }">
                <VBtn icon color="error" small @click="removeParticipantSelected(item.id)">
                  <Icon icon="material-symbols:group-remove-outline" />
                </VBtn>
              </template>
            </VDataTable>
          </v-card-text>
        </v-card>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped></style>
