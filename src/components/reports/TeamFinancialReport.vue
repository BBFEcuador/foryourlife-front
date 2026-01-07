<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import useFinancialReport from '@/composables/admin/reports/useFinancialReport';
import { computed, ref, reactive, watch } from 'vue';
import type { WeeklyPaymentStats, DailyPaymentStats } from '@/models/DashboardFinancial';
import { DayOfWeekLabels } from '@/models/DashboardFinancial';

interface props {
  trainingId: string;
  courseLevel: string;
}

const props = defineProps<props>();
const { data, isLoading, isError } = useFinancialReport(props.trainingId);

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

function formatCurrency(value: number) {
  if (typeof value !== 'number') return '-';
  return `$ ${value.toFixed(2)}`;
}

const typePayments: Record<string, string> = {
  TRA: 'Transferencia',
  TC: 'Tarjeta de Crédito/Débito',
  EF: 'Efectivo',
  CQ: 'Cheque'
};
const getPaymentMethodName = (code: string | undefined): string => {
  if (!code) return '-';
  return typePayments[code] || '-';
};
const getPaymentMethodIcon = (code: string | undefined): string => {
  if (!code) return 'mdi-credit-card-multiple';
  switch (code) {
    case 'TRA':
      return 'mdi-bank-transfer';
    case 'TC':
      return 'mdi-credit-card-multiple';
    case 'EF':
      return 'mdi-cash';
    case 'CQ':
      return 'mdi-cheque';
    default:
      return 'mdi-credit-card-multiple';
  }
};
const getPaymentMethodIconClass = (code: string | undefined): string => {
  if (!code) return 'tw:text-gray-600';
  switch (code) {
    case 'TRA':
      return 'tw:text-blue-600';
    case 'TC':
      return 'tw:text-green-600';
    case 'EF':
      return 'tw:text-yellow-600';
    case 'CQ':
      return 'tw:text-purple-600';
    default:
      return 'tw:text-gray-600';
  }
};

// Tabla de pagos
const weeklyPaymentList = computed<WeeklyPaymentStats[]>(() => {
  return data.value.weeklyPaymentStats || [];
});

// const trainingItems = computed(() => data.value?.trainingInfo ?? []);
const tab = ref(weeklyPaymentList.value?.[0]?.weekNumber ?? null);

// const days

const headers = computed(() => {
  const week = weeklyPaymentList.value?.[0]; // toma la primera semana como base
  if (!week) return [];

  // forzamos que sean claves de DayOfWeek
  const days = Object.keys(week.statsPerDay) as (keyof typeof week.statsPerDay)[];

  return [
    { title: 'Métrica', key: 'metric' },
    ...days.map((d) => ({
      title: DayOfWeekLabels[d],
      key: d
    }))
  ];
});

const tableRows = computed(() => {
  const week = weeklyPaymentList.value?.[0];
  if (!week) return [];
  const days = Object.keys(week.statsPerDay) as (keyof typeof week.statsPerDay)[];
  var metrics: (keyof DailyPaymentStats)[] = [];
  if (props.courseLevel.includes('YOUR')) {
    metrics = ['participantsFinal', 'totalPayments', 'finalPayments', 'passPercent', 'projectedPercent'];
  } else {
    metrics = ['participantsFinal', 'yourCount', 'yourLifeCount', 'totalPayments', 'partialPayments', 'passPercent', 'projectedPercent'];
  }

  return metrics.map((metric) => {
    const row: Record<string, any> = { metric };

    days.forEach((day) => {
      const value = week.statsPerDay[day][metric];

      if (metric === 'passPercent' || metric === 'projectedPercent') {
        // Si es porcentaje, formateamos con 2 decimales y agregamos '%'
        row[day] = value !== undefined && value !== null ? value.toFixed(2) + ' %' : '-';
      } else {
        // Para otros valores, mostramos el número o '-' si no existe
        row[day] = value ?? '-';
      }

      if (props.courseLevel.includes('YOUR') && metric === 'finalPayments' && value === undefined) {
        row[day] = week.statsPerDay[day]['totalPayments'] + week.statsPerDay[day]['partialPayments'];
      } else {
        row[day] = value ?? '-';
      }
    });
    return row;
  });
});

watch(
  weeklyPaymentList,
  (list) => {
    if (list && list.length > 0) {
      tab.value = list[0].weekNumber; // siempre el primer tab
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-show="isLoading" class="text-center pa-4">
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
          <p class="tw:text-lg text-center">Error al cargar los datos del dashboard financiero</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-show="!isLoading">
    <VRow>
      <VCol cols="12" sm="6" md="3" class="mb-4">
        <v-alert border="start" border-color="primary" elevation="1" class="deep-purple">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-purple-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-cash-multiple" height="20" class="tw:text-purple-800" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Total</h4>
            </div>
          </div>
          <div class="mr-6 tw:text-2xl tw:font-bold tw:text-gray-700 text-end">
            {{ formatCurrency(data.trainingTotalIncome) }}
            <p class="tw:text-xs tw:text-light-500">Ingresos Acumulados</p>
          </div>
        </v-alert>
      </VCol>
      <VCol cols="12" sm="6" md="3" class="mb-4">
        <v-alert border="start" border-color="secondary" elevation="1" class="bg-white">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-gray-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-cash-clock" height="20" class="tw:text-gray-800" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Pendiente</h4>
            </div>
          </div>
          <div class="mr-6 tw:text-2xl tw:font-bold tw:text-gray-700 text-end">
            {{ formatCurrency(data.pendingPaymentsAmount) }}
            <p class="tw:text-xs tw:text-light-500">Ingresos Pendientes</p>
          </div>
        </v-alert>
      </VCol>
      <VCol cols="12" sm="6" md="3" class="mb-4">
        <v-alert border="start" border-color="success" elevation="1" class="bg-white">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-green-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-check-circle-outline" height="20" class="tw:text-green-800" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Pagos Completados</h4>
            </div>
          </div>
          <div class="mr-6 tw:text-2xl tw:font-bold tw:text-gray-700 text-end">
            {{ data.totalCompletedPayments }}
            <p class="tw:text-xs tw:text-light-500">Completados</p>
          </div>
        </v-alert>
      </VCol>
      <VCol cols="12" sm="6" md="3" class="mb-4">
        <v-alert border="start" border-color="warning" elevation="1" class="bg-white">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-yellow-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-timer-sand" height="20" class="tw:text-yellow-800" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Pagos Pendientes</h4>
            </div>
          </div>
          <div class="mr-6 tw:text-2xl tw:font-bold tw:text-gray-700 text-end">
            {{ data.totalPendingPayments }}
            <p class="tw:text-xs tw:text-light-500">Pendientes</p>
          </div>
        </v-alert>
      </VCol>
    </VRow>

    <div class="tw:flex tw:items-center tw:gap-3 mb-3 mt-3">
      <div>
        <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Métodos de Pago</h4>
        <p class="tw:text-sm tw:text-gray-500">Listado de métodos de pago</p>
      </div>
    </div>

    <VRow v-if="data.paymentMethodSummary && data.paymentMethodSummary.length === 0" class="mb-3">
      <VCol cols="12" md="3" sm="6">
        <v-card class="mt-2" color="secondary" variant="tonal">
          <v-card-text class="pa-3">
            <div class="tw:flex tw:justify-center tw:items-center mt-6">
              <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-white tw:flex tw:items-center tw:justify-center">
                <Icon icon="mdi-credit-card-off" height="20" class="" />
              </div>
            </div>
            <div class="tw-text-center tw-text-gray-500 tw:py-6 mb-6 mt-1 pa-4 text-center">
              No existen<br />
              métodos de pago
            </div>
          </v-card-text>
        </v-card>
      </VCol>
    </VRow>

    <v-slide-group show-arrows>
      <v-slide-group-item v-for="(method, key) in data.paymentMethodSummary" :key="key">
        <v-card class="mb-3 ma-3" style="width: 225px">
          <v-card-text class="pa-3">
            <div class="tw:flex tw:items-center tw:gap-3 mb-3">
              <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
                <Icon
                  :icon="getPaymentMethodIcon(method.paymentMethod.code)"
                  height="20"
                  :class="getPaymentMethodIconClass(method.paymentMethod.code)"
                />
              </div>
              <div>
                <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:tracking-wide">
                  {{ getPaymentMethodName(method.paymentMethod.code) }}
                </h4>
              </div>
            </div>
            <div v-if="method.paymentMethod.code === 'TRA' && method.paymentMethod.bank" class="tw-mb-2">
              <v-alert>
                <v-alert-text class="tw-text-xs">
                  <h4 class="tw:text-xs tw:text-light-500 tw:font-bold">Detalles Bancarios</h4>
                  <div class="tw:flex tw:items-center tw:gap-3 mt-2">
                    <Icon icon="mdi-bank" height="20" />
                    <div>
                      <h4 class="tw-font-medium">{{ method.paymentMethod.bank.name }}</h4>
                      <p class="tw:text-sm tw:text-gray-500">{{ method.paymentMethod.bank.number }}</p>
                    </div>
                  </div>
                </v-alert-text>
              </v-alert>
            </div>
            <v-divider class="mt-4"></v-divider>
            <VRow class="mt-1">
              <VCol cols="6" class="tw-text-center">
                <p class="tw:text-xs tw:text-light-500 tw:whitespace-nowrap">Transacciones</p>
                <p class="tw:text-lg tw:font-bold tw:text-gray-700 tw:whitespace-nowrap">
                  {{ method.transactionCount }}
                </p>
              </VCol>
              <VCol cols="6" class="tw-text-center">
                <p class="tw:text-xs tw:text-light-500 tw:whitespace-nowrap text-end">Total</p>
                <p class="tw:text-lg tw:font-bold tw:text-gray-700 text-end text-primary tw:whitespace-nowrap">
                  {{ formatCurrency(method.totalAmount) }}
                </p>
              </VCol>
            </VRow>
          </v-card-text>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <div class="tw:flex tw:items-center tw:gap-3 mb-4 mt-3">
      <div>
        <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Seguimiento de Pagos</h4>
        <p class="tw:text-sm tw:text-gray-500">Listado de seguimiento de Pagos</p>
      </div>
    </div>

    <VRow v-if="!courseLevel?.includes('LIFE')">
      <VCol cols="12">
        <v-card rounded="lg">
          <v-card-text>
            <!-- tabla de pagos -->
            <div class="d-flex flex-row">
              <v-tabs v-model="tab" color="primary" direction="vertical" style="background-color: #ece7f0">
                <v-tab
                  v-for="(item, index) in weeklyPaymentList"
                  :key="item.weekNumber"
                  :text="`Semana ${item.weekNumber}`"
                  :value="item.weekNumber"
                >
                  <template #prepend>
                    <Icon icon="mdi-calendar-week" height="22" class="tw:text-primary" />
                  </template>
                </v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="(item, index) in weeklyPaymentList" :key="item.weekNumber" :value="item.weekNumber">
                  <v-card flat>
                    <v-card-text>
                      <VDataTable :headers="headers" :items="tableRows" class="mt-4" hide-default-footer>
                        <!-- Primera columna personalizada -->
                        <template #item.metric="{ item }">
                          <div class="metric-cell">
                            <span class="nowrap tw:font-semibold">
                              {{
                                item.metric === 'participantsFinal'
                                  ? 'Participantes Finales'
                                  : item.metric === 'yourCount'
                                    ? 'YOUR'
                                    : item.metric === 'yourLifeCount'
                                      ? 'YOUR + LIFE'
                                      : item.metric === 'totalPayments'
                                        ? 'Pagos Totales'
                                        : item.metric === 'finalPayments'
                                          ? 'Total Pagos Finales'
                                          : item.metric === 'partialPayments'
                                            ? 'Pagos Parciales'
                                            : item.metric === 'passPercent'
                                              ? '% Pase'
                                              : item.metric === 'projectedPercent'
                                                ? '% Proyectado'
                                                : item.metric
                              }}
                            </span>
                          </div>
                        </template>
                      </VDataTable>
                    </v-card-text>
                  </v-card>
                </v-tabs-window-item>
              </v-tabs-window>
            </div>
          </v-card-text>
        </v-card>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.deep-purple {
  background-color: white !important;
}
.bg-white {
  background-color: white !important;
}

.nowrap {
  white-space: nowrap;
}
:deep(.v-data-table td:has(.metric-cell)) {
  background-color: #f8fafc;
  color: #64748b !important;
}

/* 🔹 PRIMERA COLUMNA STICKY (HEADER + CELDAS) */
:deep(.v-data-table th:first-child),
:deep(.v-data-table td:first-child) {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: #f8fafc;
  text-align: start !important;
}

/* Header por encima de las celdas */
:deep(.v-data-table th:first-child) {
  z-index: 3;
}

/* Headers */
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

/* Celdas */
.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
  text-align: center !important;
}

/* Hover sin romper sticky */
.v-data-table :deep(.v-data-table__wrapper tbody tr:hover td) {
  background-color: #f1f5f9 !important;
}

/* Wrapper */
.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: auto !important;
}

//v-slide-group__content
.v-slide-group__content {
  gap: 1rem !important;
  background-color: #ece7f0 !important;
}

.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}

.animated-col {
  transition:
    flex-basis 0.1s ease,
    max-width 0.1s ease;
}
</style>
