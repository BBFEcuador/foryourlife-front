<script setup lang="ts">
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import type { Criteria, Filter } from '@/models/Criteria';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { router } from '@/router';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ParticipantFilters from '../participants/ParticipantFilters.vue';

const { data, isError, isLoading, criteriaMutations, refetchTeams, teamsData } = useAdminTeams();
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
  {
    title: 'Inicio de Clase',
    value: 'trainingData.startDate',
    width: '150',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Equipo',
    value: 'name',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Entrenador',
    value: 'trainer.name',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Nivel',
    value: 'training.courseLevel',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Sede',
    value: 'training.campus.city',
    width: '150',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Ajustes',
    value: 'actions',
    width: '100',
    align: 'center' as const,
    sortable: false
  }
]);

const refreshTeams = async () => {
  search.value = '';
  await refetchTeams();
};

const addTeam = () => {
  router.push({ name: 'teams-admin-add' });
};

const removeParticipantSelected = (item: string) => {
  router.push({ name: 'teams-admin-update', params: { id: item } })
};

const getLevelColor = (level: string) => {
  const colors = {
    'FOCUS': 'success',
    'YOUR': 'warning',
    'LIFE': 'error',
    'LIFE_1': 'facebook',
    'LIFE_2': 'twitter',
    'LIFE_3': 'linkedin',
    'LIFE_GRADUATE': 'darkinfo',
  };
  return colors[level] || 'gray';
};

const getLevelIcon = (level: string) => {
  const icons = {
    'FOCUS': 'tabler:circle-number-1',
    'YOUR': 'tabler:circle-number-2',
    'LIFE': 'tabler:circle-number-3',
    'LIFE_1': 'tabler:circle-number-4',
    'LIFE_2': 'tabler:circle-number-5',
    'LIFE_3': 'tabler:circle-number-6',
    'LIFE_GRADUATE': 'fluent:hat-graduation-sparkle-16-regular',
  };
  return icons[level] || 'mdi:help-circle';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};


watch(criteriaMutations.isError, () => {
  if (criteriaMutations.isError.value) {

  }
})

</script>

<template>
  <BaseBreadcrumb :title="'Equipos'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters" v-motion :initial="{ opacity: 0, x: 20 }"
      :enter="{ opacity: 1, x: 0 }" :delay="100">
      <VCard variant="flat" class="tw:rounded-xl tw:bg-white tw:shadow-sm">
        <UiParentCard title="Filtros">
          <PerfectScrollbar class="tw:max-h-[700px] d-flex flex-column ga-3">
            <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
          </PerfectScrollbar>
        </UiParentCard>
      </VCard>
    </VCol>
    <VCol cols="12" :lg="showFilters ? 12 : 9">
      <div class="d-flex flex-column ga-4">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTable :items="teamsData" :headers="headers" :loading="isLoading" :search="search" hover
              class="tw:rounded-xl elevation-0 !tw:border !tw:border-gray-100">
              <template #top>
                <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                  :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                  <div class="tw:flex-1 tw:max-w-md tw:relative">
                    <VTextField v-model="search" placeholder="Buscar equipos..." variant="outlined"
                      density="comfortable" hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
                      bg-color="white">
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
                          </div>
                        </div>
                      </template>
                      <template #append v-if="search">
                        <VBtn icon variant="text" size="small" @click="search = ''"
                          class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                          <Icon icon="mdi:close" height="18" />
                        </VBtn>
                      </template>
                    </VTextField>
                  </div>
                  <VSpacer />
                  <VBtn variant="tonal" class="mr-2 tw:bg-secondary/5 hover:tw:bg-secondary/10 tw:transition-all"
                    color="secondary" @click="showFilters = !showFilters" v-if="lgAndUp">
                    <div class="tw:relative">
                      <Icon icon="mdi:filter-variant" class="mr-2" />
                      <div
                        class="tw:absolute tw:-right-1 tw:-top-1 tw:w-2 tw:h-2 tw:bg-secondary tw:rounded-full tw:animate-pulse">
                      </div>
                    </div>
                    Filtros
                  </VBtn>
                  <VBtn variant="tonal" class="mr-2 tw:bg-secondary/5 hover:tw:bg-secondary/10 tw:transition-all"
                    color="secondary" @click="showFiltersDrawer = !showFiltersDrawer" v-else>
                    <div class="tw:relative">
                      <Icon icon="mdi:filter-variant" class="mr-2" />
                      <div
                        class="tw
                        <template #default></template>:absolute tw:-right-1 tw:-top-1 tw:w-2 tw:h-2 tw:bg-secondary tw:rounded-full tw:animate-pulse">
                      </div>
                    </div>
                    Filtros
                  </VBtn>
                  <VBtn variant="elevated" color="primary"
                    class="tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:bg-gradient-to-r tw:from-primary tw:to-primary-darken-1"
                    @click="addTeam">
                    <div class="tw:relative">
                      <Icon icon="mdi:account-group-outline" class="mr-2" />
                      <div
                        class="tw:absolute tw:inset-0 tw:bg-white tw:opacity-25 tw:blur-sm tw:rounded-full tw:animate-pulse">
                      </div>
                    </div>
                    Nuevo Equipo
                  </VBtn>
                </v-toolbar>
              </template>

              <template #item.name="{ item }">
                <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap group">
                  <Icon icon="mdi:account-group"
                    class="tw:text-primary tw:transition-transform group-hover:tw:scale-110" />
                  <div
                    class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-10 tw:transition-opacity">
                  </div>
                  <div>
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                      item.name }}</span>
                    <div class="tw:text-xs  group-hover:tw:opacity-100">{{ item.trainingData?.name }}</div>
                  </div>
                </div>
              </template>

              <template #item.trainer.name="{ item }">
                <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap group">
                  <div class="tw:bg-amber-50 tw:p-2 tw:rounded-lg tw:transition-all group-hover:tw:bg-amber-100">
                    <Icon icon="mdi:account-tie"
                      class="tw:text-amber-600 tw:transition-transform group-hover:tw:scale-110" />
                  </div>
                  <div>
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-amber-600 tw:transition-colors">{{
                      item.trainer.name }}</span>
                    <div
                      class="tw:text-xs tw:text-gray-500 group-hover:tw:opacity-100 tw:transition-opacity">
                      {{ item.trainer.email }}</div>
                  </div>
                </div>
              </template>

              <template #item.training.courseLevel="{ item }">
                <div class="tw:flex tw:items-center tw:gap-2 group">
                  <VChip :color="getLevelColor(item.training.courseLevel)" variant="flat"
                    class="!tw:font-medium tw:min-w-[120px] !tw:justify-center tw:transition-all group-hover:tw:shadow-md group-hover:tw:scale-105"
                    size="small">
                    <div class="tw:relative">
                      <Icon :icon="getLevelIcon(item.training.courseLevel)" height="20"
                        class="mr-2 tw:transition-transform group-hover:tw:scale-110" />
                    </div>
                    <div v-if="item.training.courseLevel === 'LIFE_GRADUATE'">GRADUADO</div>
                  </VChip>
                </div>
              </template>

              <template #item.training.campus.city="{ item }">
                <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap group">
                  <div class="tw:bg-blue-50 tw:p-2 tw:rounded-lg tw:transition-all group-hover:tw:bg-blue-100">
                    <Icon icon="mdi:map-marker"
                      class="tw:text-blue-600 tw:transition-transform group-hover:tw:scale-110" />
                  </div>
                  <span class="tw:font-medium tw:text-gray-700 group-hover:tw:text-blue-600 tw:transition-colors">{{
                    item.training.campus.city }}</span>
                </div>
              </template>

              <template #item.trainingData.startDate="{ item }">
                <div v-if="item.trainingData" class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap group">
                  <div class="tw:bg-green-50 tw:p-2 tw:rounded-lg tw:transition-all group-hover:tw:bg-green-100">
                    <Icon icon="mdi:calendar-clock"
                      class="tw:text-green-600 tw:transition-transform group-hover:tw:scale-110" />
                  </div>
                  <div>
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-green-600 tw:transition-colors">{{
                      formatDate(item.trainingData.startDate) }}</span>
                  </div>
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="tw:flex tw:items-center tw:justify-center tw:gap-3">
                  <VBtn icon variant="text" color="error" height="38"
                    class="!tw:bg-red-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-red-100 tw:transition-all group"
                    v-tooltip="'Quitar participantes'" @click="removeParticipantSelected(item.id)">
                    <div class="tw:relative">
                      <Icon icon="material-symbols:edit-outline-rounded" class="tw:transition-transform group-hover:tw:scale-110" />
                      <div
                        class="tw:absolute tw:inset-0 tw:bg-red-500 tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity">
                      </div>
                    </div>
                  </VBtn>
                  <!-- <VBtn icon variant="text" color="info" height="38"
                    class="!tw:bg-blue-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-blue-100 tw:transition-all group"
                    v-tooltip="'Ver detalles'" @click="viewTeamDetails(item.id)">
                    <div class="tw:relative">
                      <Icon icon="mdi:eye" class="tw:transition-transform group-hover:tw:scale-110" />
                      <div
                        class="tw:absolute tw:inset-0 tw:bg-blue-500 tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity">
                      </div>
                    </div>
                  </VBtn> -->
                </div>
              </template>

              <template #loading>
                <VProgressLinear color="primary" indeterminate class="tw:rounded-t-xl" height="2" />
                <div class="tw:flex tw:justify-center tw:py-12 tw:bg-gray-50/30">
                  <div class="tw:flex tw:items-center tw:gap-4 tw:bg-white tw:px-6 tw:py-4 tw:rounded-2xl tw:shadow-lg">
                    <VProgressCircular indeterminate color="primary" size="24" width="3" />
                    <div>
                      <p class="tw:font-medium tw:text-gray-700">Cargando equipos</p>
                      <p class="tw:text-sm tw:text-gray-500">Por favor espere...</p>
                    </div>
                  </div>
                </div>
              </template>

              <template #no-data>
                <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:bg-gray-50/30">
                  <div
                    class="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-gray-100 tw:to-transparent tw:opacity-50">
                  </div>
                  <div class="tw:relative tw:z-10">
                    <Icon icon="mdi:account-group" height="64" class="tw:text-gray-400 tw:mb-2" />
                    <div class="tw:absolute tw:-top-1 tw:-right-1">
                      <div class="tw:relative">
                        <Icon icon="mdi:close-circle" class="tw:text-red-500" height="24" />
                        <div class="tw:absolute tw:inset-0 tw:bg-red-500 tw:opacity-25 tw:blur-sm tw:rounded-full">
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 class="tw:text-xl tw:font-medium tw:text-gray-700 tw:mb-2">No se encontraron equipos</h3>
                  <p class="tw:text-gray-500">Intenta con otros términos de búsqueda</p>
                  <VBtn variant="text" color="primary" class="tw:mt-4" :loading="isLoading" @click="refreshTeams">
                    <div class="tw:relative">
                      <Icon icon="mdi:refresh" class="mr-2 tw:transition-transform hover:tw:rotate-180" />
                      <div
                        class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-20">
                      </div>
                    </div>
                    Recargar equipos
                  </VBtn>
                </div>
              </template>
            </VDataTable>
          </v-card-text>
        </v-card>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}
</style>
