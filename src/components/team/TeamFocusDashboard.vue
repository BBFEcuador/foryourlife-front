<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useFocusDashboard from '@/composables/trainer/dashboard/useFocusDashboard';
import type { Team } from '@/models/Participants';
import { computed, ref, reactive } from 'vue';
import AgeChartByTeam from './AgeChartByTeam.vue';
import GenderChartByTeam from './GenderChartByTeam.vue';
import PaymentsStaffsByTeam from './PaymentsStaffsByTeam.vue';
import ParticipantAttendancesByTeam from './ParticipantAttendancesByTeam.vue';

interface props {
  team: Team;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useFocusDashboard(props.team.training!.id);

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
  <div v-show="isLoading || isComponentsLoading" class="text-center pa-4">
    <v-card elevation="0" rounded="xl">
      <v-card-text>
        <v-progress-circular indeterminate size="24" />
        <p class="text-caption mt-2">Cargando datos...</p>
      </v-card-text>
    </v-card>
  </div>
  <div v-if="isError" class="text-center pa-4">
    <v-card elevation="0" rounded="xl">
      <v-card-text>
        <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
          <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
          <p class="tw:text-lg text-center">Error al cargar los datos del dashboard de Focus</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-show="!isLoading && !isComponentsLoading">
    <VRow class="tw-gap-4">
      <!-- Columna izquierda -->
      <VCol cols="12" md="4" class="tw-flex tw-flex-col tw-gap-4">
        <AgeChartByTeam :data="data.ageDashboard" :loading="isLoading" @loaded="onComponentLoaded" />
        <GenderChartByTeam :data="data.genderByDay" :loading="isLoading" @loaded="onComponentLoaded" class="mt-4" />
      </VCol>
      <!-- Columna derecha -->
      <VCol cols="12" md="8">
        <PaymentsStaffsByTeam :data="data.paymentDashboard" @loaded="onComponentLoaded" />
        <ParticipantAttendancesByTeam :data="data.focusAttendanceDashboard" class="mt-4" @loaded="onComponentLoaded" />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped></style>
