<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';
import type { DeclarationStats } from '@/models/DashboardLife';
import useMasterLifeReport from '@/composables/admin/reports/useMasterlifeReport';
import LingererStats from '../team/LingererStats.vue';
import AtetendeeYourPayments from '../team/AttendeeYourPayments.vue';
import ParticipantsListLife from '../team/ParticipantsListLife.vue';
import GeneralTotalDeclarationsYour from '../team/GeneralTotalDeclarationsYour.vue';
import AttendanceLife from '../team/AttendanceLife.vue';
import AttendanceLifeGraduate from '../team/AttendanceLifeGraduate.vue';

interface props {
  trainingId: string;
  trainingDataName: string;
}
const props = defineProps<props>();
const { data, isLoading, isError } = useMasterLifeReport(props.trainingId);
const tab = ref('tab-'+props.trainingDataName);

const tabs = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return [];

  return data.value.map((item, index) => ({
    title: item.trainingName || `Entrenamiento ${index + 1}`,
    value: `tab-${item.trainingName}`,
    report: item
  }));
});

const getCardsByReport = (declarationStats?: DeclarationStats) => {
  return [
    {
      title: 'Participantes',
      accomplishment: declarationStats?.accomplishmentParticipant ?? 0,
      total: declarationStats?.participantCount ?? 0,
      indexEnrollment: declarationStats?.participantEnrollmentIndex ?? 0
    },
    {
      title: 'Master Lifes',
      accomplishment: declarationStats?.accomplishmentMasterLife ?? 0,
      total: declarationStats?.masterLifeCount ?? 0,
      indexEnrollment: declarationStats?.masterLifeEnrollmentIndex ?? 0
    },
    {
      title: 'Equipo',
      accomplishment: declarationStats?.accomplishmentTeam ?? 0,
      total: declarationStats?.teamCount ?? 0,
      indexEnrollment: declarationStats?.teamEnrollmentIndex ?? 0
    },
    {
      title: 'Enrolamiento',
      isSpecial: true,
      notEnrolled: declarationStats?.totalUsersNotEnrolledCount ?? 0,
      total: declarationStats?.totalUsersEnrollersCount ?? 0,
      percentageEnrolled: declarationStats?.totalUsersEnrollersPercentage ?? 0
    }
  ];
};

const formatPercentage = (value: number | undefined | null) => {
  const safeValue = value ?? 0;
  return `${Number(safeValue).toFixed(2)} %`;
};

const getColor = (value: number | undefined | null) => {
  const safeValue = value ?? 0;
  if (safeValue >= 100) return 'success';
  if (safeValue >= 81 && safeValue <= 99) return 'warning';
  return 'error';
};

const getColorIndexEnrollment = (trainingName: string, value: number | undefined | null) => {
  if (trainingName.toUpperCase().includes('FDS-1')) {
    const safeValue = value ?? 0;
    if (safeValue >= 1.2) return 'success';
  } else if (trainingName.toUpperCase().includes('FDS-2')) {
    const safeValue = value ?? 0;
    if (safeValue >= 1.3) return 'success';
  } else if (trainingName.toUpperCase().includes('FDS-3')) {
    const safeValue = value ?? 0;
    if (safeValue >= 1.5) return 'success';
  }
  return 'error';
};
</script>

<template>
  <div v-if="isLoading" class="text-center pa-12">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    <p class="text-caption mt-4">Cargando datos...</p>
  </div>
  <div v-else-if="isError" class="text-center pa-12">
    <v-card variant="flat" border class="rounded-xl text-center pa-8">
      <div class="d-flex align-center justify-center">
        <Icon icon="solar:danger-bold-duotone" class="text-warning text-center mb-4" height="48" />
      </div>
      <p class="text-h6">Error al cargar los datos</p>
    </v-card>
  </div>
  <div v-else>
    <v-tabs v-model="tab" align-tabs="center" color="primary" class="border-b mt-2">
      <v-tab v-for="item in tabs" :key="item.value" :value="item.value" class="text-none font-weight-bold">
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="mt-6">
      <v-tabs-window-item v-for="item in tabs" :key="item.value" :value="item.value">
        <div class="mb-4 d-flex align-center flex-wrap ga-2">
          <div class="d-flex align-center ga-4 text-medium-emphasis flex-wrap">
            <div class="d-flex align-center ga-1">
              <Icon icon="mdi-signal" height="20" color="primary" class="text-primary" />
              <p class="tw:text-sm tw:text-gray-500 mb-0">
                {{ item?.report.courseLevel }}
              </p>
            </div>
            <v-divider vertical length="20" class="d-none d-md-flex"></v-divider>
            <div class="d-flex align-center ga-1 tw:text-nowrap">
              <Icon icon="mdi-account-tie" height="20" color="primary" class="text-primary" />
              <p class="tw:text-sm tw:text-gray-500 mb-0">{{ item?.report.trainerName }}</p>
            </div>
            <v-divider vertical length="20" class="d-none d-md-flex"></v-divider>
            <div class="d-flex align-center ga-1 tw:text-nowrap">
              <Icon icon="mdi-calendar-range" height="20" color="primary" class="text-primary" />
              <p class="tw:text-sm tw:text-gray-500 mb-0">{{ item?.report.trainingDate }}</p>
            </div>
          </div>
          <v-divider class="flex-grow-1 ms-4"></v-divider>
        </div>
        <div v-if="!item.report.courseLevel.toUpperCase().includes('GRADUADO')">
          <VRow class="mb-1">
            <VCol v-for="card in getCardsByReport(item.report.declarationStats)" :key="card.title" cols="12" sm="6" md="3">
              <v-alert border="start" border-color="primary" elevation="1" class="tw:bg-white h-100">
                <div>
                  <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">{{ card.title }}</h4>
                  <h3 class="text-h3 heading text-primary">
                    {{ card.total }}
                  </h3>
                  <template v-if="!card.isSpecial">
                    <div class="mb-2">
                      <p class="tw:text-sm text-grey">Total General</p>
                    </div>
                    <div class="d-flex ga-2 tw:justify-between align-center mb-1">
                      <span class="text-caption tw:text-xs font-weight-bold">% Cumplimiento</span>
                      <VChip size="small" :color="getColor(card.accomplishment)" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class=" ">{{ formatPercentage(card.accomplishment) }}</span>
                        </div>
                      </VChip>
                    </div>
                    <div class="d-flex ga-2 tw:justify-between align-center">
                      <span class="text-caption font-weight-bold">idx. Enrolamiento</span>

                      <VChip size="small" :color="getColorIndexEnrollment(item.title, card.indexEnrollment)" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class=" ">{{ card.indexEnrollment?.toFixed(2) }}</span>
                        </div>
                      </VChip>
                    </div>
                  </template>
                  <template v-else>
                    <div class="mb-4">
                      <p class="tw:text-sm text-grey">Enrolados</p>
                    </div>
                    <div class="d-flex ga-2 tw:justify-between align-center mb-1">
                      <span class="text-caption tw:text-xs font-weight-bold">% Enrolados</span>
                      <VChip size="small" color="primary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class=" ">{{ formatPercentage(card.percentageEnrolled || 0) }}</span>
                        </div>
                      </VChip>
                    </div>
                    <div class="d-flex ga-2 tw:justify-between align-center mb-1">
                      <span class="text-caption tw:text-xs font-weight-bold">Sin enrolar</span>
                      <VChip size="small" color="secondary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class=" ">{{ card.notEnrolled }}</span>
                        </div>
                      </VChip>
                    </div>
                  </template>
                </div>
              </v-alert>
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12" md="8">
              <v-scroll-x-transition group appear>
                <AttendanceLife key="attendance-life" :data="item.report.lifeAttendanceDashboard" />
                <ParticipantsListLife key="participants-list" :data="item.report.users" class="mt-4" />
              </v-scroll-x-transition>
            </VCol>
            <VCol cols="12" md="4">
              <v-scroll-x-transition group appear>
                <AtetendeeYourPayments key="attendee-payments" :data="item.report.previousTrainingStats" />
                <GeneralTotalDeclarationsYour key="general-total" :data="item.report.declarationStats" class="mt-4" />
                <LingererStats key="lingerer-stats" :data="item.report.lingererStats" :small="true" class="mt-4" />
              </v-scroll-x-transition>
            </VCol>
          </VRow>
        </div>
        <div v-else>
          <v-scroll-x-transition group appear>
            <AttendanceLifeGraduate key="attendance-life-graduate" :data="item.report.lifeAttendanceDashboard" />
          </v-scroll-x-transition>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style lang="scss" scoped>
.tw\:bg-white {
  background-color: var(--tw-color-white) !important /* #fff = #ffffff */;
}
</style>
