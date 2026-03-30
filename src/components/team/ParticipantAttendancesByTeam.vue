<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Attendance } from '@/models/DashboardYour';
import type { FocusAttendanceDashboard } from '@/models/DashboardFocus';
import { computed, ref } from 'vue';

interface Props {
  data?: Attendance | FocusAttendanceDashboard;
  totalTrainings?: string[];
}
const props = defineProps<Props>();
const search = ref('');
const filterByTraining = ref<string | null>(null);
const headers = [
  { title: 'Nombre', value: 'userName', sortable: true },
  { title: 'Viernes', value: 'fridayAttendance', sortable: true },
  { title: 'Sábado', value: 'saturdayAttendance', sortable: true },
  { title: 'Domingo', value: 'sundayAttendance', sortable: true }
];

const attendances = computed(() => {
  const data = props.data?.attendances ?? [];
  if (filterByTraining.value) {
    return data.filter((attendance) => attendance.forTrainingName === filterByTraining.value);
  }
  return data;
});
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-check" height="20" class="tw:text-indigo-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">
            Resúmen de Asistencias por Participantes
          </h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de asistencias por participantes</p>
        </div>
      </div>

      <v-data-table :items="attendances" :headers="headers" :search="search" hover fixed-header class="" dense>
        <template v-slot:top>
          <v-toolbar
            class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
            flat
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="200"
            :duration="250"
          >
            <VTextField
              v-model="search"
              placeholder="Buscar Participante..."
              variant="outlined"
              density="compact"
              class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
              clearable
              hide-details
            >
              <template #prepend-inner>
                <div class="tw:relative">
                  <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                  <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                </div>
              </template>
            </VTextField>
            <v-spacer></v-spacer>
            <v-select
              v-model="filterByTraining"
              placeholder="Invitados"
              :items="props.totalTrainings"
              clearable
              chips
              density="compact"
              variant="outlined"
              class="tw:rounded-lg tw:bg-white/80"
              hide-details
            ></v-select>
          </v-toolbar>
        </template>
        <template #item.userName="{ item }">
          <div class="tw:flex tw:items-center tw:gap-3 tw:py-1">
            <v-avatar variant="tonal" size="32" color="secondary" class="mr-3">
              <span class="text-caption font-weight-bold"><Icon icon="mdi:account" class="secondary" height="18" /></span>
            </v-avatar>
            <span class="tw:font-medium tw:text-gray-800"
              >{{ item.userName ?? '' }}
              <p class="tw:text-sm tw:font-light">{{ item.forTrainingName ?? '' }}</p>
            </span>
          </div>
        </template>
        <template #item.fridayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.fridayAttendance === 'ASISTIO',
                'tw:text-red-700': item.fridayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.fridayAttendance
              }"
              :icon="
                item.fridayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.fridayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-minus-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
        <template #item.saturdayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.saturdayAttendance === 'ASISTIO',
                'tw:text-red-700': item.saturdayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.saturdayAttendance
              }"
              :icon="
                item.saturdayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.saturdayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-minus-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
        <template #item.sundayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.sundayAttendance === 'ASISTIO',
                'tw:text-red-700': item.sundayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.sundayAttendance
              }"
              :icon="
                item.sundayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.sundayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-minus-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.tw\:bg-indigo-50 {
  background-color: var(--tw-color-indigo-50) !important /* oklch(0.962 0.018 272.314) */;
}
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
  color: #334155;
  padding: 16px;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: background-color 0.2s ease;
}
</style>
