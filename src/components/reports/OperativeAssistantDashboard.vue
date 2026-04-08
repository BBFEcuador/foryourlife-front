<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref, reactive, watch } from 'vue';
import type { TrainingInfo } from '@/models/DashboardOperativeAssistant';
import useOperativeAssistantReport from '@/composables/admin/reports/useOperativeAssistantReport.ts';
import OperativeAssistantSummary from './OperativeAssistantSummary.vue';

interface props {
  teamId: string;
  teamName: string;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useOperativeAssistantReport(computed(() => props.teamId));

const selectedTraining = ref<TrainingInfo | null>(null);
const trainingItems = computed(() => data.value?.trainingInfo ?? []);

watch(
  trainingItems,
  (newItems) => {
    if (!newItems || newItems.length === 0) {
      selectedTraining.value = null;
    }
  },
  { immediate: true }
);


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
        <div class="text-center tw:justify-center tw:block">
          <v-slide-group show-arrows class="tw:justify-center" v-model="selectedTraining">
            <v-slide-group-item v-for="(item, index) in trainingItems" :key="index" :value="item" v-slot="{ isSelected, toggle }">
              <v-btn :color="isSelected ? 'primary' : 'default'" class="ma-2" rounded @click="toggle">
                {{ item?.teamName }}
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </VCol>
    </VRow>
    <OperativeAssistantSummary v-if="selectedTraining" :trainingInfo="selectedTraining" />
  </div>
</template>

<style lang="scss" scoped>
.tw\:block {
  display: block !important;
}
</style>
