<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import ParticipantFilters from './ParticipantFilters.vue';
import type { Criteria, Filter } from '@/models/Criteria';

const showFilters = ref(false);
const showFiltersDrawer = ref(false);
const { lgAndUp } = useDisplay();
const { isParticipantsError, isParticipantsLoading, participants, criteriaMutations, refetchParticipants, data } = useParticipants();

const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel actual', value: 'participantLevel.courseLevel' },
  { title: 'Documento', value: 'profile.dni' },
  { title: 'Acciones', value: 'actions', width: 50 }
];

const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const onFilterSubmit = (criteria: Criteria) => {
  criteriaMutations.mutate(criteria);
};

const onFilterClear = () => {
  criteriaMutations.mutate({ filters: [] as Filter[], limit: 0, offset: 0 });
};
</script>
<template>
  <BaseBreadcrumb :title="'Participantes'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters">
      <UiParentCard title="Filtros">
        <PerfectScrollbar class="max-h d-flex flex-column ga-3">
          <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
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
            <VDataTable :items="participants" :loading="isParticipantsLoading || criteriaMutations.isPending.value" :headers="headers">
            </VDataTable>
          </v-card-text>
        </v-card>
      </div>
    </VCol>
    <Teleport to="body">
      <VNavigationDrawer temporary v-model="showFiltersDrawer">
        <UiParentCard title="Filtros">
          <ParticipantFilters />
        </UiParentCard>
      </VNavigationDrawer>
    </Teleport>
  </VRow>
</template>

<style scoped>
.max-h {
  max-height: 700px;
}
</style>
