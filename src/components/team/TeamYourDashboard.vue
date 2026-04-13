<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useYourDashboard from '@/composables/trainer/dashboard/useYourDashboard';
import type { Team } from '@/models/Participants';
import { computed, ref, reactive } from 'vue';
// import AgeChartByTeam from './AgeChartByTeam.vue';
// import GenderChartByTeam from './GenderChartByTeam.vue';
// import PaymentsStaffsByTeam from './PaymentsStaffsByTeam.vue';
import ParticipantAttendancesByTeam from '../team/ParticipantAttendancesByTeam.vue';
import LingererStats from '../team/LingererStats.vue';
import NextParticipantsTrainingStats from '../team/NextParticipantsTrainingStats.vue';
import PaymentsStaffsByTeamYour from '../team/PaymentsStaffsByTeamYour.vue';
import LifeRecoveryPaymentsStats from '../team/LifeRecoveryPaymentsStats.vue';
import AttendeeLifePayments from '../team/AttendeeLifePayments.vue';

interface props {
  team: Team;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useYourDashboard(props.team.training!.id);
const cards = ref([
  {
    title: 'Participantes Iniciales',
    value: computed(() => data.value?.attendance?.initialPx ?? 0),
    icon: 'mdi-cash-multiple',
    color: 'orange'
  },
  {
    title: 'Total Your',
    value: computed(() => data.value?.attendance?.totalFocus ?? 0),
    icon: 'mdi-account-group-outline',
    color: 'primary'
  },
  {
    title: 'Rezagados',
    value: computed(() => data.value?.attendance?.totalLingerer ?? 0),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  },
  {
    title: 'Desertores',
    value: computed(() => data.value?.attendance?.totalDistorter ?? 0),
    percentage: computed(() => Number(data.value?.attendance?.distortionPercentage ?? 0).toFixed(2)),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  }
]);
</script>

<template>
  <v-fade-transition mode="out-in">
    <div v-if="isLoading" class="text-center pa-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-caption mt-4">Cargando datos...</p>
    </div>
    <div v-else-if="isError" class="text-center pa-4">
      <v-scale-transition appear>
        <v-card elevation="0" rounded="xl">
          <v-card-text>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
              <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
              <p class="tw:text-lg text-center">Error al cargar los datos del dashboard de Your</p>
            </div>
          </v-card-text>
        </v-card>
      </v-scale-transition>
    </div>
    <div v-else>
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

      <div class="mb-4 d-flex align-center mt-3 flex-wrap ga-2">
        <div class="d-flex align-center ga-4 text-medium-emphasis flex-wrap">
          <div class="d-flex align-center ga-1">
            <Icon icon="mdi-calendar-range" height="20" class="text-primary" />
            <p class="tw:text-sm tw:text-gray-500 mb-0 tw:text-nowrap">
              {{ data?.trainingDate }}
            </p>
          </div>
        </div>
        <v-divider class="flex-grow-1 ms-4"></v-divider>
      </div>

      <VRow class="tw-gap-4 mb-2">
        <v-slide-y-transition group appear>
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
        </v-slide-y-transition>
      </VRow>
      <VRow class="tw-gap-4">
        <!-- Columna izquierda -->
        <VCol cols="12" md="8">
          <v-scroll-x-transition group appear>
            <PaymentsStaffsByTeamYour key="payment-staff" :data="data.paymentYourDashboard" />
            <ParticipantAttendancesByTeam key="participant-attendance" :data="data.attendance" class="mt-4" />
          </v-scroll-x-transition>
        </VCol>
        <!-- Columna derecha -->
        <VCol cols="12" md="4" class="tw-flex tw-flex-col tw-gap-4">
          <v-scroll-x-transition group appear>
            <NextParticipantsTrainingStats key="next-training" :data="data.nextTrainingAttendance" />
            <AttendeeLifePayments key="attendee-payments" :data="data.previousTrainingStats" class="mt-4" />
            <LifeRecoveryPaymentsStats key="recovery-payments" :data="data.yourRecoveryPaymentStats" class="mt-4" />
            <LingererStats key="lingerer-stats" :data="data.lingererStats" :small="true" class="mt-4" />
          </v-scroll-x-transition>
        </VCol>
      </VRow>
    </div>
  </v-fade-transition>
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
