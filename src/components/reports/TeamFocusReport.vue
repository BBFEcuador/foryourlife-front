<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useFocusReport from '@/composables/admin/reports/useFocusReport';
import type { Team } from '@/models/Participants';
import { computed, ref, reactive } from 'vue';
import AgeChartByTeam from '../team/AgeChartByTeam.vue';
import GenderChartByTeam from '../team/GenderChartByTeam.vue';
import PaymentsStaffsByTeam from '../team/PaymentsStaffsByTeam.vue';
import ParticipantAttendancesByTeam from '../team/ParticipantAttendancesByTeam.vue';
import LingererStats from '../team/LingererStats.vue';
import WeekendGuestStats from '../team/WeekendGuestStats.vue';
import NextParticipantsTrainingStats from '../team/NextParticipantsTrainingStats.vue';
import CityChartByTeam from '../team/CityChartByTeam.vue';

interface props {
  trainingId: string;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useFocusReport(props.trainingId);
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

const cards = ref([
  {
    title: 'Participantes Iniciales',
    value: computed(() => data.value?.focusAttendanceDashboard?.initialPx ?? 0),
    icon: 'mdi-cash-multiple',
    color: 'orange'
  },
  {
    title: 'Total Focus',
    value: computed(() => data.value?.focusAttendanceDashboard?.totalFocus ?? 0),
    icon: 'mdi-account-group-outline',
    color: 'primary'
  },
  {
    title: 'Rezagados',
    value: computed(() => data.value?.focusAttendanceDashboard?.totalLingerer ?? 0),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  },
  {
    title: 'Desertores',
    value: computed(() => data.value?.focusAttendanceDashboard?.totalDistorter ?? 0),
    percentage: computed(() => data.value?.focusAttendanceDashboard?.distortionPercentage ?? 0),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  }
]);
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
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <div class="text-overline text-primary mb-1 mt-3">Entrenamiento</div>
        <h2 class="text-h4 font-weight-bold text-grey-darken-4">
          {{ data?.trainingName }}
        </h2>
      </v-col>
      <v-col cols="12" md="6" sm="12" class="d-flex align-end justify-end">
        <slot name="actions"></slot>
      </v-col>
    </v-row>

    <div class="mb-4 d-flex align-center mt-3">
      <div class="d-flex align-center ga-4 text-medium-emphasis">
        <div class="d-flex align-center ga-1">
          <Icon icon="mdi-account-tie" height="20" color="primary" />
          <p class="tw:text-sm tw:text-gray-500 mb-0">
            {{ data?.trainerName }}
          </p>
        </div>
        <v-divider vertical length="20"></v-divider>
        <div class="d-flex align-center ga-1">
          <Icon icon="mdi-calendar-range" height="20" />
          <p class="tw:text-sm tw:text-gray-500 mb-0 tw:text-nowrap">
            {{ data?.trainingDate }}
          </p>
        </div>
      </div>
      <v-divider class="flex-grow-1 ms-4"></v-divider>
    </div>
    <VRow class="tw-gap-4 mb-2">
      <v-col v-for="card in cards" :key="card.title" cols="12" md="3" sm="6">
        <v-alert border="start" border-color="primary" elevation="1" class="tw:bg-white pb-2 h-100">
          <div>
            <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">{{ card.title }}</h4>
            <h3 class="text-h3 heading text-primary">
              {{ card.value }}
            </h3>
            <div v-if="card.title == 'Desertores'" class="text-end mt-1">
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <v-chip v-bind="props" class="font-weight-semibold" style="font-size: 0.75rem">
                    <Icon icon="mdi-walk" class="mr-2" width="16" />
                    {{ card.percentage }} %
                  </v-chip>
                </template>
                Porcentaje de desertores
              </v-tooltip>
            </div>
          </div>
        </v-alert>
      </v-col>
    </VRow>
    <VRow class="tw-gap-4">
      <VCol cols="12" md="4" class="tw-flex tw-flex-col tw-gap-4">
        <NextParticipantsTrainingStats :data="data.nextTrainingAttendance" :loading="isLoading" @loaded="onComponentLoaded" />
        <AgeChartByTeam :data="data.ageDashboard" :loading="isLoading" @loaded="onComponentLoaded" class="mt-4" />
        <GenderChartByTeam :data="data.genderByDay" :loading="isLoading" @loaded="onComponentLoaded" class="mt-4" />
        <CityChartByTeam :data="data.cityParticipantDashboard" :loading="isLoading" @loaded="onComponentLoaded" class="mt-4" />
        <WeekendGuestStats :data="data.lifeWeekendAssistants" :loading="isLoading" @loaded="onComponentLoaded" class="mt-4" />
      </VCol>
      <VCol cols="12" md="8">
        <PaymentsStaffsByTeam :data="data.paymentFocusDashboard" @loaded="onComponentLoaded" />
        <ParticipantAttendancesByTeam
          :data="data.focusAttendanceDashboard"
          :totalTrainings="data.totalTrainings"
          class="mt-4"
          @loaded="onComponentLoaded"
        />
        <LingererStats :data="data.lingererStats" class="mt-4" @loaded="onComponentLoaded" />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.tw\:bg-white {
  background-color: var(--tw-color-white) !important /* #fff = #ffffff */;
}
.half-circle {
  transform: rotate(-90deg);
  clip-path: inset(0 0 50% 0);
}
</style>
