<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';
import { DayOfWeekLabels } from '@/models/OperativeAssistantYour';
import type { OperativeFocusPayments } from '@/models/OperativeAssistantFocus';

interface Props {
  data: OperativeFocusPayments | null;
  realParticipantsCount: number;
  isLoading: boolean;
}

const props = defineProps<Props>();
const groupBy = ref([{ key: 'week', order: 'asc' as const }]);
const metricDefinitions = [
  { label: 'Participantes Finales', key: 'finalParticipants' },
  { label: 'Your', key: 'yourPaymentsCount' },
  { label: 'Your+Life', key: 'yourPlusLifePaymentsCount' },
  { label: 'Pagos Totales', key: 'totalPaymentsCount' },
  { label: 'Pagos Parciales', key: 'pendingPaymentsCount' },
  { label: 'Acuerdos', key: 'agreedPaymentsCount' },
  { label: 'Posibilidad', key: 'possiblePaymentsCount' },
  { label: 'No Interesa', key: 'notInterestPaymentsCount' },
  { label: 'Cuadre', key: 'square' },
  { label: '% Pase', key: 'passPercentage', isPercent: true },
  { label: '% Proyectado', key: 'projected', isPercent: true }
];

const headers = computed(() => {
  const days = [{ title: 'Métrica', key: 'metricLabel', sortable: false, width: '200px', fixed: true }];
  Object.entries(DayOfWeekLabels).forEach(([key, label]) => {
    days.push({ title: label, key: key, sortable: true, width: '120px', fixed: false });
  });

  return days;
});

const flattenedData = computed(() => {
  if (!props.data?.focusWeeklyPaymentStats) return [];

  const rows: any[] = [];

  props.data.focusWeeklyPaymentStats.forEach((week) => {
    metricDefinitions.forEach((metric) => {
      const row: any = {
        week: week.weekNumber,
        metricLabel: metric.label,
        metricKey: metric.key,
        isPercent: metric.isPercent || false,
        id: `${week.weekNumber}-${metric.key}`
      };
      Object.keys(DayOfWeekLabels).forEach((dayKey) => {
        const dayData = week.focusWeeklyPayments[dayKey as keyof typeof week.focusWeeklyPayments];
        if (dayData) {
          if (metric.key === 'square') {
            row[dayKey] =
              props.realParticipantsCount -
              (dayData.totalPaymentsCount +
                dayData.pendingPaymentsCount +
                dayData.agreedPaymentsCount +
                dayData.possiblePaymentsCount +
                dayData.notInterestPaymentsCount);
          } else if (metric.key === 'projected') {
            row[dayKey] = dayData.projectedPercentage;
          } else if (metric.key === 'finalParticipants') {
            row[dayKey] = props.realParticipantsCount;
          } else {
            row[dayKey] = dayData[metric.key as keyof typeof dayData];
          }
        } else {
          row[dayKey] = 0;
        }
      });
      rows.push(row);
    });
  });
  return rows;
});

const getStatusColor = (value: number) => {
  if (value >= 80) return 'success';
  if (value >= 50) return 'warning';
  return 'error';
};
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi:cash" height="20" class="tw:text-indigo-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Estadísticas de pago semanales</h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de pagos por semana</p>
        </div>
      </div>
      <VDataTable
        :headers="headers"
        :items="flattenedData"
        :group-by="groupBy"
        :loading="isLoading"
        hover
        hide-group-header
        class="modern-table"
        items-per-page="-1"
        hide-default-footer
      >
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr class="group-header-row">
            <td :colspan="columns.length" @click="toggleGroup(item)" style="cursor: pointer">
              <div class="d-flex tw:gap-2 align-center">
                <Icon :icon="isGroupOpen(item) ? 'mdi:chevron-down' : 'mdi:chevron-right'" class="text-primary" height="20" />
                <div class="tw-flex tw-items-center tw-gap-2">
                  <span class="tw:text-sm tw:font-medium text-primary"> SEMANA {{ item.value }}</span>
                </div>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:item.metricLabel="{ item }">
          <div class="d-flex align-center py-2">
            <div class="day-indicator mr-3"></div>
            <span class="tw:text-sm tw:font-semibold tw:text-gray-700">{{ item.metricLabel }}</span>
          </div>
        </template>

        <template v-for="day in Object.keys(DayOfWeekLabels)" :key="day" v-slot:[`item.${day}`]="{ value, item }">
          <div v-if="item.isPercent" class="tw-min-w-[100px] py-1">
            <div class="d-flex justify-end tw-mb-1">
              <span :class="`tw:text-xs tw:font-bold text-${getStatusColor(value)}`">{{ value.toFixed(2) }}%</span>
            </div>
            <VProgressLinear :model-value="value" :color="getStatusColor(value)" height="4" rounded bg-color="grey-lighten-3" />
          </div>
          <span v-else class="tw:text-sm tw:font-medium tw:text-gray-800 text-center">
            <div class="text-center">{{ value }}</div>
          </span>
        </template>

        <template v-slot:loading>
          <div class="tw-py-12 text-center">
            <VProgressCircular indeterminate color="primary" width="2" />
            <p class="mt-3 tw-text-xs tw-text-gray-400 tw-uppercase tw-tracking-widest">Cargando datos...</p>
          </div>
        </template>
      </VDataTable>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.modern-table :deep(.v-data-table__td) {
  padding: 8px 12px !important;
}
.day-indicator {
  width: 4px;
  height: 16px;
  background-color: #663c84;
  border-radius: 4px;
  opacity: 0.5;
}

.modern-table {
  :deep(table) {
    border-collapse: separate;
    border-spacing: 0;
  }

  :deep(.v-data-table__th) {
    background-color: #f8fafc !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    font-weight: 700 !important;
    color: #475569 !important;
    border-bottom: 2px solid #e2e8f0 !important;
    height: 48px !important;
  }

  :deep(.v-data-table__tr) {
    transition: all 0.2s;
  }

  .group-header-row {
    background-color: #f0eff4 !important;
    td {
      padding: 8px 16px !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }
  }

  .day-indicator {
    width: 4px;
    height: 16px;
    background-color: #663c84;
    border-radius: 4px;
    opacity: 0.5;
  }

  :deep(.v-data-table__td) {
    font-size: 0.875rem !important;
    color: #334155 !important;
    border-bottom: 1px solid #f1f5f9 !important;
  }
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
