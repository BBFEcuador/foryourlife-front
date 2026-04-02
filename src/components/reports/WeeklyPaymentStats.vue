<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';
import type { OperativeYourPayments } from '@/models/OperativeAssistantYour';
import { DayOfWeekLabels } from '@/models/OperativeAssistantYour';

interface Props {
  data: OperativeYourPayments | null;
  isLoading: boolean;
}

const props = defineProps<Props>();
const groupBy = ref([{ key: 'week', order: 'asc' as const }]);

const headers = [
  { title: 'Día de la Semana', key: 'day', sortable: true, width: '200px' },
  { title: 'Pagos Final', key: 'final', align: 'center' as const },
  { title: 'Pagos en Acuerdo', key: 'agreed', align: 'center' as const },
  { title: 'Pagos Totales', key: 'total', align: 'center' as const },
  { title: '% Pase', key: 'passPercentage', align: 'center' as const, width: '180px' },
  { title: '% Proyectado', key: 'projected', align: 'center' as const, width: '180px' }
];

const flattenedData = computed(() => {
  if (!props.data?.weeklyPaymentStats) return [];

  return props.data.weeklyPaymentStats.flatMap((week) => {
    return Object.entries(week.weeklyPayments).map(([day, values]) => ({
      week: week.weekNumber,
      day: day,
      final: values.finalPaymentsCount,
      agreed: values.agreedPaymentsCount,
      total: values.totalPaymentsCount,
      passPercentage: values.passPaymentsPercentage,
      projected: values.projectedPaymentsPercentage,
      id: `${week.weekNumber}-${day}`
    }));
  });
});

// Función para determinar color según porcentaje
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

        <template v-slot:item.day="{ value }">
          <div class="d-flex align-center py-2">
            <div class="day-indicator mr-3"></div>
            <span class="tw:text-sm tw:font-medium tw:text-gray-800">{{ DayOfWeekLabels[value as keyof typeof DayOfWeekLabels] }}</span>
          </div>
        </template>

        <template v-slot:item.final="{ value }">
          <span class="tw:text-sm tw:font-medium tw:text-gray-800">{{ value }}</span>
        </template>

        <template v-slot:item.agreed="{ value }">
          <span class="tw:text-sm tw:font-medium tw:text-gray-800">{{ value }}</span>
        </template>

        <template v-slot:item.total="{ value }">
          <span class="tw:text-sm tw:font-medium tw:text-gray-800">{{ value }}</span>
        </template>

        <template v-slot:item.passPercentage="{ item }">
          <div class="tw-min-w-[120px] py-2">
            <div class="d-flex justify-end tw-mb-1">
              <span :class="`tw:text-sm  tw:font-medium text-${getStatusColor(item.passPercentage)}`"> {{ item.passPercentage.toFixed(2) }}% </span>
            </div>
            <VProgressLinear
              :model-value="item.passPercentage"
              :color="getStatusColor(item.passPercentage)"
              height="6"
              rounded
              bg-color="grey-lighten-3"
            />
          </div>
        </template>

        <template v-slot:item.projected="{ item }">
          <div class="tw-min-w-[120px] py-2">
            <div class="d-flex justify-end tw-mb-1">
              <span :class="`tw-text-sm  tw:font-medium text-${getStatusColor(item.projected)}`"> {{ item.projected.toFixed(2) }}% </span>
            </div>
            <VProgressLinear
              :model-value="item.projected"
              :color="getStatusColor(item.projected)"
              height="6"
              rounded
              bg-color="grey-lighten-3"
            />
          </div>
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
.modern-table {
  /* Quitar bordes internos por defecto de Vuetify */
  :deep(table) {
    border-collapse: separate;
    border-spacing: 0;
  }

  /* Estilo de la cabecera */
  :deep(.v-data-table__th) {
    background-color: #f8fafc !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    font-weight: 700 !important;
    color: #475569 !important;
    border-bottom: 2px solid #e2e8f0 !important;
    height: 48px !important;
  }

  /* Filas de datos */
  :deep(.v-data-table__tr) {
    transition: all 0.2s;
  }

  /* Estilo fila de grupo */
  .group-header-row {
    background-color: #f0eff4 !important;
    td {
      padding: 8px 16px !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }
  }

  /* Indicador decorativo al lado del día */
  .day-indicator {
    width: 4px;
    height: 16px;
    background-color: #663c84;
    border-radius: 4px;
    opacity: 0.5;
  }

  /* Ajuste de celdas */
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
