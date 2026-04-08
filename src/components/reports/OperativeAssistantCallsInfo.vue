<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DashboardOperativeAssistantLife } from '@/models/OperativeAssistantLife';
import { CallStatus, CallStatusMeta, CallType, CallTypeMeta } from '@/models/OperativeAssistantLife';
import { Icon } from '@iconify/vue/dist/iconify.js';

interface Props {
  data: DashboardOperativeAssistantLife[];
  isLoading: boolean;
}

const props = defineProps<Props>();

const statusRows = Object.values(CallStatus);

// Columnas: Estado + Entrenamientos + Columna de Totales
const columns = computed(() => {
  const base = [{ title: 'Concepto / Estado', key: 'statusLabel', width: '250px', fixed: true }];

  const dynamic = props.data.map((item) => ({
    title: item.trainingName,
    key: item.trainingName,
    align: 'center' as const,
    minWidth: '120px'
  }));

  const totalColumn = [
    { title: 'TOTAL GENERAL', key: 'rowTotal', align: 'center' as const, width: '150px', class: 'bg-grey-lighten-3 font-weight-black' }
  ];

  return [...base, ...dynamic, ...totalColumn];
});

const tablesByCallType = computed(() => {
  return Object.values(CallType).map((type) => {
    const rows = [];

    // 1. FILA: Total Inscritos
    const enrollmentRow: any = { statusLabel: 'Total Inscritos', isHeader: true, type: 'enrollment', rowTotal: 0 };
    props.data.forEach((t) => {
      const val = t.weekendReport?.totalEnrollmentsCount || 0;
      enrollmentRow[t.trainingName] = val;
      enrollmentRow.rowTotal += val; // Suma horizontal
    });
    rows.push(enrollmentRow);

    // 2. FILAS: Estados de Llamadas
    statusRows.forEach((status) => {
      const rowData: any = {
        statusLabel: CallStatusMeta[status].label,
        statusKey: status,
        isStatus: true,
        rowTotal: 0
      };
      props.data.forEach((t) => {
        const info = t.callsInfoList.find((c) => c.callType === type);
        const statusVal = info?.statuses.find((s) => s.status === status);
        const count = statusVal ? Number(statusVal.totalCalls) : 0;
        rowData[t.trainingName] = count;
        rowData.rowTotal += count; // Suma horizontal
      });
      rows.push(rowData);
    });

    // 3. FILAS: Métricas Finales
    const metrics = [
      { key: 'cuadre', label: 'Cuadre' },
      { key: 'effectivenessPercentage', label: '% Efectividad' },
      { key: 'projectedCallsPercentage', label: '% Proyectado' }
    ];

    metrics.forEach((metric) => {
      const isPercentage = metric.key.includes('Percentage');
      const metricRow: any = {
        statusLabel: metric.label,
        isMetric: true,
        metricKey: metric.key,
        rowTotal: 0
      };

      let sumForAverage = 0;
      props.data.forEach((t) => {
        const info = t.callsInfoList.find((c) => c.callType === type);
        const val = info ? Number(info[metric.key as keyof typeof info]) || 0 : 0;
        metricRow[t.trainingName] = val;
        sumForAverage += val;
      });

      // Si es porcentaje, el total es el promedio; si es cuadre, es la suma.
      metricRow.rowTotal = isPercentage ? (sumForAverage / (props.data.length || 1)).toFixed(2) : sumForAverage;

      rows.push(metricRow);
    });

    return { type, rows };
  });
});

const formatPercentage = (value: string) => {
  return `${Number(value).toFixed(2)} %`;
};
const openedPanel = ref(0);
</script>
<template>
  <div v-if="!isLoading">
    <v-card variant="flat" elevation="1" rounded="lg">
      <v-card-text class="pa-3">
        <div class="tw:flex tw:items-center tw:gap-3 mb-3">
          <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-purple-50 tw:flex tw:items-center tw:justify-center">
            <Icon icon="mdi:phone" height="20" class="text-primary" />
          </div>
          <div>
            <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Lista de información de llamadas</h4>
            <p class="tw:text-sm tw:text-gray-500">Listado de llamadas por tipo</p>
          </div>
        </div>
      </v-card-text>
      <v-expansion-panels multiple v-model="openedPanel" variant="default" class="bg-transparent tw:rounded-lg " rounded="lg">
        <v-expansion-panel v-for="table in tablesByCallType" :key="table.type" class="custom-panel tw:rounded-lg" rounded="lg">
          <v-expansion-panel-title collapse-color="primary" class="tw:rounded-lg" rounded="lg">
            <div class="d-flex align-center">
              <Icon :icon="CallTypeMeta[table.type].icon" :color="CallTypeMeta[table.type].color" height="20" class="me-2" />
              <span class="text-subtitle-1 font-weight-bold text-uppercase text-grey-darken-3">
                {{ CallTypeMeta[table.type].label }}
              </span>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0 tw:rounded-lg border-0" rounded="lg">
            <VDataTable
              :headers="columns"
              :items="table.rows"
              item-value="statusLabel"
              items-per-page="-1"
              hide-default-footer
              class="custom-table"
              hover
              density="comfortable"
            >
              <template #[`item.statusLabel`]="{ item }">
                <div
                  :class="{
                    'font-weight-bold text-primary': item.isHeader,
                    'font-weight-bold text-primary ': item.isMetric,
                    'tw:text-sm tw:font-semibold tw:text-gray-700 ml-4': item.isStatus
                  }"
                  class="d-flex tw:items-center"
                >
                  <Icon
                    v-if="item.isStatus"
                    :icon="CallStatusMeta[item.statusKey as CallStatus].icon"
                    :color="CallStatusMeta[item.statusKey as CallStatus].color"
                    size="16"
                    class="me-2"
                  />
                  {{ item.statusLabel }}
                </div>
              </template>

              <template v-for="training in data" :key="training.trainingName" #[`item.${training.trainingName}`]="{ item }">
                <template v-if="item.metricKey === 'effectivenessPercentage' || item.metricKey === 'projectedCallsPercentage'">
                  <VChip size="small" :color="item.metricKey === 'effectivenessPercentage' ? 'primary' : 'orange-darken-1'" variant="tonal">
                    <div class="tw:text-sm tw:font-medium">
                      {{ formatPercentage(item[training.trainingName]) }}
                    </div>
                  </VChip>
                </template>
                <template v-else-if="item.isHeader || item.metricKey === 'cuadre'">
                  <span class="tw:text-sm tw:font-medium tw:text-gray-800">{{ item[training.trainingName] }}</span>
                </template>
                <template v-else>
                  <div class="tw:text-sm tw:font-medium tw:text-gray-800">
                    {{ item[training.trainingName] }}
                  </div>
                </template>
              </template>

              <template #[`item.rowTotal`]="{ item }">
                <div class="tw:text-sm tw:font-bold text-center text-primary">
                  {{ item.metricKey?.includes('Percentage') ? formatPercentage(item.rowTotal) : item.rowTotal }}
                </div>
              </template>
            </VDataTable>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>

  <div v-else class="d-flex justify-center py-12">
    <VProgressCircular indeterminate color="primary" size="50" />
  </div>
</template>

<style scoped>
.custom-table :deep(thead th) {
  /* background-color: #37474f !important;
  color: white !important;
  font-weight: 800 !important; */
}

/* Resaltar la última columna de totales */
.custom-table :deep(td:last-child) {
  background-color: #ece7f0;
  border-left: 2px solid #c5b5d0 !important;
}

/* .custom-table :deep(tbody tr:nth-of-type(1)) {
  background-color: #f1f8e9;
} */

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
  /* font-size: 0.875rem; */
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

.v-expansion-panel--active :deep(.v-expansion-panel-title) {
  background-color: #f0eff4 !important;
  color: #6b4ea8;
  transition: background-color 0.3s ease;
}

/* Quita la elevación y bordes por defecto del contenedor */
.v-expansion-panels {
  border: none !important;
}

/* Añade el borde inferior a cada panel excepto al último si lo prefieres */
.custom-panel {
  border-bottom: 1px solid #e2e8f0 !important; /* Un gris suave (slate-200) */
  border-radius: 0 !important; /* Mantiene las esquinas rectas para el borde */
}

/* Quita el borde del último panel para que se vea limpio al final */
.custom-panel:last-child {
  border-bottom: none !important;
}

/* Opcional: Asegura que el fondo del texto del panel no tenga padding extra */
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}
.v-expansion-panel__shadow {
  box-shadow: none !important;
}
</style>
