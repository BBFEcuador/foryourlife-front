<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useOperativeAssistantReport from '@/composables/admin/reports/useOperativeAssistantReport.ts';
import type { Team } from '@/models/Participants';
import { computed, ref, reactive } from 'vue';
import LifeSummary from './LifeSummary.vue';
import type { TrainingInfo } from '@/models/DashboardOperativeAssistant';

interface props {
  teamId: string;
  teamName: string;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useOperativeAssistantReport(computed(() => props.teamId));

console.log('OperativeAssistantDashboard - teamId:', data.value);

const selectedTraining = ref<TrainingInfo | null>(null);
const trainingItems = computed(() => data.value?.trainingInfo ?? []);

// Number of components pending to load
const componentsPending = ref(4);
const isComponentsLoading = ref(true);

function onComponentLoaded() {
  componentsPending.value--;
  // Cuando todos terminaron → quitar loading
  if (componentsPending.value === 0) {
    isComponentsLoading.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading" v-show="isLoading" class="text-center pa-4">
    <v-progress-circular indeterminate color="primary" class="tw:rounded-t-xl" size="80" width="8" />
  </div>
  <div v-if="isError" class="text-center pa-4">
    <v-card elevation="0" rounded="xl">
      <v-card-text>
        <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
          <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
          <p class="tw:text-lg text-center">Error al cargar los datos de Asistente Operativo</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-show="!isLoading">
    <VRow class="tw-gap-4" v-if="trainingItems.length > 0">
      <VCol cols="12" class="tw-flex tw-flex-col tw-gap-4">
        <v-divider class="mb-4" />
        <div class="d-flex tw:items-center">
          <Icon icon="mdi-filter-variant" height="24" class="mr-2" />
          <div class="tw:font-bold">Filtrar por entrenamiento:</div>
        </div>
        <v-chip-group selected-class="text-primary" mandatory column v-model="selectedTraining">
          <v-chip v-for="(item, index) in trainingItems" :key="index" :text="item?.teamName" :value="item">
            <template #prepend>
              <Icon icon="mdi-information-outline" class="mr-1"></Icon>
            </template>
          </v-chip>
        </v-chip-group>
      </VCol>
    </VRow>
    <LifeSummary v-if="selectedTraining?.courseLevel?.toUpperCase().includes('LIFE')" :trainingInfo="selectedTraining" />
  </div>
</template>

<style lang="scss" scoped></style>
