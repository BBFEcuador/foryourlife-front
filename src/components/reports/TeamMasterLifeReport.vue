<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useMasterLifeReport from '@/composables/admin/reports/useMasterlifeReport';
import type { Team } from '@/models/Participants';
import type { TrainingMasterLifeDashboard } from '@/models/Training';
import { computed, ref, reactive } from 'vue';

interface props {
  trainingId: string;
  trainingDataName: string;
}
const search = ref<string>('');
const props = defineProps<props>();
const { data, isLoading } = useMasterLifeReport(props.trainingId);
const trainingsByFilter = computed(() => {
  const trainings: TrainingMasterLifeDashboard[] = data.value || [];
  const matchName = props.trainingDataName;
  return trainings.sort((a, b) => {
    if (a.trainingName === matchName && b.trainingName !== matchName) return -1;
    if (a.trainingName !== matchName && b.trainingName === matchName) return 1;
    return 0;
  });
});

const participantHeaders = [
  { title: 'Rol', value: 'userEntity', sortable: true },
  { title: 'Nombre', value: 'userName', sortable: true },
  { title: 'Declaración', value: 'thirdPromise', sortable: true },
  { title: 'Fichas', value: 'achievedCount', sortable: true },
  { title: 'Pagos', value: 'paidCount', sortable: true }
];

const showParticipants = reactive<Record<number, boolean>>({});

function toggleParticipants(index: number) {
  showParticipants[index] = !showParticipants[index];
}

const panel = reactive<Record<number, number[]>>({});

function setPanel(index: number, val: unknown) {
  const v = val as number | number[] | undefined;
  if (v === undefined || v === null) {
    panel[index] = [];
    return;
  }
  panel[index] = Array.isArray(v) ? v : [v];
}

const calculateValue = (item: TrainingMasterLifeDashboard) => {
  const attendanceSum = (item.attendanceDashboard?.masterSundayCount ?? 0) + (item.attendanceDashboard?.sundayCount ?? 0);
  const promiseSum = (item.promiseDashboard?.totalMasterLifePaid ?? 0) + (item.promiseDashboard?.totalPaid ?? 0);
  if (promiseSum === 0) return 0;
  return attendanceSum / promiseSum;
};

const getColor = (item: TrainingMasterLifeDashboard) => {
  const value = calculateValue(item);
  if (value > 1.22) return 'tw:text-green-600';
  if (value >= 1 && value <= 1.22) return 'tw:text-yellow-500';
  return 'tw:text-red-600';
};
</script>

<template>
  <v-card variant="flat" elevation="0" class="bg-transparent" rounded="0" :loading="isLoading">
    <v-card-text class="pa-0">
      <div v-if="isLoading" class="text-center pa-4">
        <v-progress-circular indeterminate size="24" />
        <p class="text-caption mt-2">Cargando datos...</p>
      </div>
      <div v-else-if="trainingsByFilter.length > 0">
        <div v-for="(item, index) in trainingsByFilter" :key="index" class="tw:mb-6">
          <v-expansion-panels
            :model-value="panel[index] ?? (index === 0 ? [0] : [])"
            @update:modelValue="(val) => setPanel(index, val)"
            elevation="0"
            class="tw:rounded-2xl tw:overflow-hidden mb-3"
          >
            <v-expansion-panel class="tw:bg-white shadow-sm">
              <!-- Header del panel -->
              <v-expansion-panel-title class="hover:tw:bg-gray-50 tw:transition-colors tw:rounded-xl">
                <div class="tw:flex tw:items-center tw:gap-4">
                  <div class="tw:w-12 tw:h-12 tw:rounded-xl tw:bg-purple-50 tw:flex tw:items-center tw:justify-center">
                    <Icon icon="mdi:calendar-month" height="24" class="tw:text-purple-600" />
                  </div>
                  <div class="tw:flex tw:flex-col">
                    <h3 class="tw:text-base tw:font-semibold tw:text-gray-900 tw:leading-tight">
                      {{ item?.trainingName || 'Sin nombre' }}
                    </h3>
                    <p class="tw:text-sm tw:text-gray-500 tw:mt-1 tw:flex tw:items-center tw:gap-2">
                      <Icon icon="mdi:account-tie" height="14" />
                      {{ item?.trainerName || 'Sin entrenador' }}
                    </p>
                  </div>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="tw:px-6 tw:pb-6">
                <!-- Tabla de Asistencia y Declaración por Días -->
                <div class="mt-4 mb-8">
                  <div class="tw:flex tw:items-center tw:gap-3 mb-4">
                    <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-amber-50 tw:flex tw:items-center tw:justify-center">
                      <Icon icon="mdi:calendar-check" height="20" class="tw:text-amber-600" />
                    </div>
                    <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Registro por Días</h4>
                    <v-spacer></v-spacer>
                    <div
                      v-if="
                        item.attendanceDashboard?.masterSundayCount != null &&
                        item.attendanceDashboard?.sundayCount != null &&
                        item.promiseDashboard?.totalMasterLifePaid != null &&
                        item.promiseDashboard?.totalPaid != null
                      "
                      :class="getColor(item)"
                      class="tw:ml-auto tw:text-lg"
                    >
                      {{ calculateValue(item).toFixed(2) }}
                    </div>
                  </div>

                  <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:overflow-hidden tw:shadow-sm">
                    <div class="tw:overflow-x-auto">
                      <v-table striped="even" class="w-full border-table border-gray-300">
                        <thead>
                          <tr class="tw:bg-gray-50">
                            <th class="tw:text-xs tw:font-medium tw:text-gray-500 tw:sticky tw:left-0 tw:bg-white tw:z-10"></th>
                            <th
                              colspan="3"
                              class="text-center tw:text-xs tw:font-semibold tw:text-blue-700 tw:uppercase tw:bg-blue-50 tw:border-l tw:border-gray-300"
                            >
                              Día 1
                            </th>
                            <th
                              colspan="3"
                              class="text-center tw:text-xs tw:font-semibold tw:text-emerald-700 tw:uppercase tw:bg-emerald-50 tw:border-l tw:border-gray-300"
                            >
                              Día 2
                            </th>
                            <th
                              colspan="3"
                              class="text-center tw:text-xs tw:font-semibold tw:text-orange-700 tw:uppercase tw:bg-orange-50 tw:border-l tw:border-gray-300"
                            >
                              Día 3
                            </th>
                          </tr>
                          <tr class="tw:border-t tw:text-center tw:border-gray-200">
                            <th
                              class="tw:px-4 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:text-gray-500 tw:sticky tw:left-0 tw:bg-white tw:z-10"
                            ></th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-blue-25 tw:border-l tw:border-gray-300">
                              MasterLifes
                            </th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-blue-25">Participantes</th>
                            <th class="tw:text-xs tw:font-semibold tw:text-blue-700 tw:bg-blue-100 tw:border-l tw:border-blue-200">
                              Total
                            </th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-emerald-25 tw:border-l tw:border-gray-200">
                              MasterLifes
                            </th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-emerald-25">Participantes</th>
                            <th class="tw:text-xs tw:font-semibold tw:text-emerald-700 tw:bg-emerald-100 tw:border-l tw:border-emerald-200">
                              Total
                            </th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-orange-25 tw:border-l tw:border-gray-300">
                              MasterLifes
                            </th>
                            <th class="tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-orange-25">Participantes</th>
                            <th class="tw:text-xs tw:font-semibold tw:text-orange-700 tw:bg-orange-100 tw:border-l tw:border-orange-200">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody class="tw:divide-y tw:divide-gray-100">
                          <tr class="tw:transition-colors tw:border-b-gray-300">
                            <td class="tw:text-sm tw:font-medium tw:text-gray-700 tw:sticky tw:left-0 tw:bg-white tw:z-10">Asistencia</td>
                            <td class="text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.attendanceDashboard?.masterFridayCount ?? 0 }}
                            </td>
                            <td class="text-center tw:text-lg tw:text-gray-600">{{ item.attendanceDashboard?.fridayCount ?? 0 }}</td>
                            <td
                              class="text-center tw:text-lg tw:font-semibold tw:text-blue-700 tw:bg-blue-50 tw:border-l tw:border-blue-200"
                            >
                              {{ (item.attendanceDashboard?.masterFridayCount ?? 0) + (item.attendanceDashboard?.fridayCount ?? 0) }}
                            </td>
                            <td class="text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.attendanceDashboard?.masterSaturdayCount ?? 0 }}
                            </td>
                            <td class="text-center tw:text-lg tw:text-gray-600">{{ item.attendanceDashboard?.saturdayCount ?? 0 }}</td>
                            <td
                              class="text-center tw:text-lg tw:font-semibold tw:text-emerald-700 tw:bg-emerald-50 tw:border-l tw:border-emerald-200"
                            >
                              {{ (item.attendanceDashboard?.masterSaturdayCount ?? 0) + (item.attendanceDashboard?.saturdayCount ?? 0) }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.attendanceDashboard?.masterSundayCount ?? 0 }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600">
                              {{ item.attendanceDashboard?.sundayCount ?? 0 }}
                            </td>
                            <td
                              class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:font-semibold tw:text-orange-700 tw:bg-orange-50 tw:border-l tw:border-orange-200"
                            >
                              {{ (item.attendanceDashboard?.masterSundayCount ?? 0) + (item.attendanceDashboard?.sundayCount ?? 0) }}
                            </td>
                          </tr>
                          <tr class="hover:tw:bg-gray-50 tw:transition-colors">
                            <td class="tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:text-gray-700 tw:sticky tw:left-0 tw:bg-white tw:z-10">
                              Declaración
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.promiseDashboard?.totalFirstMasterLifePromise ?? 0 }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600">
                              {{ item.promiseDashboard?.totalFirstPromise ?? 0 }}
                            </td>
                            <td
                              class="tw:px-3 tw:py-3 tw:text-center tw:text- tw:font-semibold tw:text-blue-700 tw:bg-blue-50 tw:border-l tw:border-blue-200"
                            >
                              {{
                                (item.promiseDashboard?.totalFirstMasterLifePromise ?? 0) + (item.promiseDashboard?.totalFirstPromise ?? 0)
                              }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.promiseDashboard?.totalSecondMasterLifePromise ?? 0 }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600">
                              {{ item.promiseDashboard?.totalSecondPromise ?? 0 }}
                            </td>
                            <td
                              class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:font-semibold tw:text-emerald-700 tw:bg-emerald-50 tw:border-l tw:border-emerald-200"
                            >
                              {{
                                (item.promiseDashboard?.totalSecondMasterLifePromise ?? 0) +
                                (item.promiseDashboard?.totalSecondPromise ?? 0)
                              }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600 tw:border-l tw:border-gray-300">
                              {{ item.promiseDashboard?.totalThirdMasterLifePromise ?? 0 }}
                            </td>
                            <td class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:text-gray-600">
                              {{ item.promiseDashboard?.totalThirdPromise ?? 0 }}
                            </td>
                            <td
                              class="tw:px-3 tw:py-3 tw:text-center tw:text-lg tw:font-semibold tw:text-orange-700 tw:bg-orange-50 tw:border-l tw:border-orange-200"
                            >
                              {{
                                (item.promiseDashboard?.totalThirdMasterLifePromise ?? 0) + (item.promiseDashboard?.totalThirdPromise ?? 0)
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </div>
                </div>

                <!-- Tabla de Pagos -->
                <div class="mb-8">
                  <div class="tw:flex tw:items-center tw:gap-3 mb-4">
                    <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-green-50 tw:flex tw:items-center tw:justify-center">
                      <Icon icon="mdi:cash-multiple" height="20" class="tw:text-green-600" />
                    </div>
                    <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resumen de Pagos</h4>
                  </div>

                  <div class="tw:rounded-xl tw:border tw:border-gray-200 tw:overflow-hidden tw:shadow-sm">
                    <v-table striped="even" class="w-full border-table border-gray-300">
                      <thead>
                        <tr class="">
                          <th
                            class="text-left tw:text-xs tw:font-semibold tw:text-gray-600 tw:uppercase tw:border-r tw:border-gray-300"
                          ></th>
                          <th
                            class="text-center tw:text-xs tw:font-semibold tw:text-green-700 tw:bg-green-50 tw:border-r tw:border-gray-300"
                          >
                            MasterLifes
                          </th>
                          <th
                            class="text-center tw:text-xs tw:font-semibold tw:text-green-700 tw:bg-green-50 tw:border-r tw:border-gray-300"
                          >
                            Participantes
                          </th>
                          <th
                            class="text-center tw:text-xs tw:font-semibold tw:text-green-700 tw:border-l tw:border-green-300 tw:bg-green-200"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody class="tw:divide-y tw:divide-gray-100 tw:bg-white">
                        <tr class="hover:tw:bg-gray-50 tw:transition-colors">
                          <td class="tw:text-sm tw:font-medium tw:text-gray-700 tw:border-r tw:border-gray-300">Declaración</td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalMasterLifePromise ?? 0 }}
                          </td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalThirdPromise ?? 0 }}
                          </td>
                          <td
                            class="tw:text-center tw:text-lg tw:font-semibold tw:text-green-700 tw:bg-green-50 tw:border-l tw:border-green-300"
                          >
                            {{ (item.promiseDashboard?.totalMasterLifePromise ?? 0) + (item.promiseDashboard?.totalThirdPromise ?? 0) }}
                          </td>
                        </tr>
                        <tr class="hover:tw:bg-gray-50 tw:transition-colors">
                          <td class="tw:text-sm tw:font-medium tw:text-gray-700 tw:border-r tw:border-gray-300">Fichas</td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalMasterLifeAchieved ?? 0 }}
                          </td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalAchieved ?? 0 }}
                          </td>
                          <td class="tw:text-center tw:text-lg tw:font-semibold tw:text-green-700 tw:bg-green-50">
                            {{ (item.promiseDashboard?.totalMasterLifeAchieved ?? 0) + (item.promiseDashboard?.totalAchieved ?? 0) }}
                          </td>
                        </tr>
                        <tr class="hover:tw:bg-gray-50 tw:transition-colors">
                          <td class="tw:text-sm tw:font-medium tw:text-gray-700 tw:border-r tw:border-gray-300">Pagos</td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalMasterLifePaid ?? 0 }}
                          </td>
                          <td class="tw:text-center tw:text-lg tw:text-gray-600 tw:border-r tw:border-gray-300">
                            {{ item.promiseDashboard?.totalPaid ?? 0 }}
                          </td>
                          <td class="tw:text-center tw:text-lg tw:font-semibold tw:text-green-700 tw:bg-green-50">
                            {{ (item.promiseDashboard?.totalMasterLifePaid ?? 0) + (item.promiseDashboard?.totalPaid ?? 0) }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </div>

                <!-- Lista de Participantes -->
                <div>
                  <div class="tw:flex tw:items-center tw:justify-between mb-4">
                    <div class="tw:flex tw:items-center tw:gap-3">
                      <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
                        <Icon icon="mdi:account-group" height="20" class="tw:text-indigo-600" />
                      </div>
                      <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Lista de Participantes</h4>
                    </div>
                    <v-btn size="small" variant="outlined" color="indigo" class="tw:rounded-lg" @click="toggleParticipants(index)">
                      <Icon :icon="showParticipants[index] ? 'mdi:chevron-up' : 'mdi:chevron-down'" height="18" class="tw:mr-1" />
                      {{ showParticipants[index] ? 'Ocultar Participantes' : 'Ver Participantes' }}
                    </v-btn>
                  </div>

                  <v-expand-transition>
                    <div v-show="showParticipants[index]">
                      <v-data-table
                        :headers="participantHeaders"
                        :items="item.users"
                        :search="search"
                        hide-default-footer
                        class="modern-table tw:rounded-xl tw:border tw:border-gray-200 tw:overflow-hidden"
                      >
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
                              placeholder="Buscar Participantes..."
                              variant="outlined"
                              density="compact"
                              class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
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
                          </v-toolbar>
                        </template>
                        <template v-slot:item.userName="{ item }">
                          <div class="tw:flex tw:items-center tw:gap-3 tw:py-1">
                            <div
                              class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-gradient-to-br tw:from-indigo-100 tw:to-purple-100 tw:flex tw:items-center tw:justify-center"
                            >
                              <Icon icon="mdi:account" class="tw:text-indigo-600" height="18" />
                            </div>
                            <span class="tw:font-medium tw:text-gray-800">{{ item.userName || '-' }}</span>
                          </div>
                        </template>
                        <template v-slot:item.userEntity="{ item }">
                          <v-chip
                            size="small"
                            :color="item.userEntity === 'Master Life' ? 'purple' : 'indigo'"
                            variant="flat"
                            class="tw:font-medium"
                          >
                            {{ item.userEntity || '-' }}
                          </v-chip>
                        </template>
                        <template v-slot:item.thirdPromise="{ item }">
                          <div class="tw:text-center tw:w-full tw:text-lg">
                            <span class="tw:text-gray-700">{{ item.thirdPromise ?? '-' }}</span>
                          </div>
                        </template>
                        <template v-slot:item.achievedCount="{ item }">
                          <div class="tw:text-center tw:w-full tw:text-lg">
                            <span class="tw:text-gray-700">{{ item.achievedCount ?? '-' }}</span>
                          </div>
                        </template>
                        <template v-slot:item.paidCount="{ item }">
                          <div class="tw:text-center tw:w-full tw:text-lg">
                            <span class="tw:text-gray-700">{{ item.paidCount ?? '-' }}</span>
                          </div>
                        </template>
                        <template #no-data>
                          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12">
                            <Icon icon="mdi:account-off-outline" height="48" class="tw:text-gray-300 tw:mb-4" />
                            <div v-if="search">
                              <p class="tw:text-lg">No se encontraron participantes</p>
                              <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
                            </div>
                            <div v-else>
                              <p class="tw:text-sm tw:text-gray-500">No hay participantes registrados</p>
                            </div>
                          </div>
                        </template>
                      </v-data-table>
                    </div>
                  </v-expand-transition>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
      <!-- Contenido del dashboard -->
      <div v-else v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="150" :duration="400">
        <v-card elevation="0" rounded="xl">
          <v-card-text>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
              <Icon icon="mdi-clipboard-remove-outline" height="48" class="tw:mb-4" />
              <p class="tw:text-lg text-center">No hay datos disponibles para el dashboard de Life</p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.modern-table {
  :deep(.v-data-table__wrapper) {
    border-radius: 0.75rem;
  }

  :deep(thead) {
    background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
  }

  :deep(tbody) {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background-color: #fafbfc !important;
      }

      td {
        color: #374151 !important;
        font-size: 0.875rem !important;
        padding: 0.875rem 1rem !important;
        border-bottom: 1px solid #f3f4f6 !important;
      }
    }
  }
}
// Colores personalizados de fondo para días
.tw\:bg-blue-25 {
  background-color: #eff6ff;
}

.tw\:bg-emerald-25 {
  background-color: #ecfdf5;
}

.tw\:bg-orange-25 {
  background-color: #fff7ed;
}

.tw\:text-blue-700 {
  color: #1d4ed8 !important;
}
.tw\:text-emerald-700 {
  color: #059669 !important;
}
.tw\:text-orange-700 {
  color: #c2410c !important;
}
.tw\:border-b-gray-300 {
  border-color: #d1d5db !important;
  border-bottom-color: #d1d5dc !important;
  border-bottom-style: var(--tw-border-style);
  border-bottom-width: 1px;
}

// Animaciones sutiles
.v-expansion-panel {
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03);
  }
}

.v-expansion-panel.v-expansion-panel--active .v-expansion-panel-title {
  background-color: #eeeeee;
}
</style>
