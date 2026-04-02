<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import type { PaymentStaffDashboard } from '@/models/DashboardYour';

const props = defineProps<{ data: PaymentStaffDashboard[] }>();
const search = ref('');

const headers = [
  {
    title: 'Staff',
    value: 'staffName',
    sortable: true,
    cellProps: {
      class: 'sticky-col'
    },
    headerProps: {
      class: 'sticky-col-header'
    }
  },
  {
    title: 'SÁBADOS',
    children: [
      { title: 'Pagos', value: 'saturdayPayments', sortable: true },
      { title: 'Pagos Acumulados', value: 'accumulatedSaturdayPayments', sortable: true },
      { title: '% Pase', value: 'passPercentageSaturday', sortable: true }
    ]
  },
  {
    title: 'DOMINGOS',
    children: [
      { title: 'Pagos', value: 'sundayPayments', sortable: true },
      { title: 'Pagos Acumulados', value: 'accumulatedSundayPayments', sortable: true },
      { title: '% Pase', value: 'passPercentageSunday', sortable: true }
    ]
  },
  {
    title: 'PREVIO',
    children: [
      { title: 'Pagos Life', value: 'previousLifePayments', sortable: true },
      { title: '% Pagos', value: 'previousPaymentsPercentage', sortable: true }
    ]
  }
];

const calculateTotal = (key: keyof PaymentStaffDashboard) => {
  return props.data?.reduce((acc, item) => acc + (Number(item[key]) || 0), 0) || 0;
};

// const totals = computed(() => ({
//   yourSunday: calculateTotal('yourPaymentsSunday'),
//   totalSunday: calculateTotal('totalPaymentsSunday'),
//   yourFinal: calculateTotal('yourPaymentsFinal'),
//   totalFinal: calculateTotal('totalPaymentsFinal')

// }));
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-green-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-cash-outline" height="20" class="tw:text-green-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resumen de Pagos por Staff</h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de pagos por staff</p>
        </div>
      </div>
      <v-data-table :headers="headers" :items="props.data" :search="search" hover fixed-header class="custom-table" density="comfortable">
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
            <v-spacer></v-spacer>
            <VTextField
              v-model="search"
              placeholder="Buscar Staff..."
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
          </v-toolbar>
        </template>
        <template #[`item.staffName`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar variant="tonal" size="32" color="primary" class="mr-3">
              <span class="text-caption font-weight-bold">{{ item.staffName.charAt(0) }}</span>
            </v-avatar>
            <span class="tw:font-medium tw:text-gray-800">{{ item.staffName }}</span>
          </div>
        </template>

        <template
          v-for="col in [
            'saturdayPayments',
            'accumulatedSaturdayPayments',
            'sundayPayments',
            'accumulatedSundayPayments',
            'previousLifePayments'
          ]"
          :key="col"
          #[`item.${col}`]="{ value }"
        >
          <div class="tw:text-end">
            <span class="font-variant-numeric">{{ value }}</span>
          </div>
        </template>

        <template #[`item.passPercentageSaturday`]="{ value }">
          <v-chip size="small" :color="value >= 80 ? 'green' : 'orange'" variant="tonal" label> {{ value.toFixed(2) }}% </v-chip>
        </template>

        <template #[`item.passPercentageSunday`]="{ value }">
          <v-chip size="small" :color="value >= 80 ? 'green' : 'orange'" variant="tonal" label> {{ value.toFixed(2) }}% </v-chip>
        </template>

        <template #[`item.previousPaymentsPercentage`]="{ value }">
          <v-chip size="small" :color="value >= 80 ? 'green' : 'orange'" variant="tonal" label> {{ value.toFixed(2) }}% </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.search-field {
  width: 250px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

/* UI: Separación visual de grupos de cabeceras */
:deep(.v-data-table-header__content) {
  justify-content: center !important;
}

/* Colores sutiles para diferenciar grupos */
:deep(thead tr:nth-child(1) th:nth-child(2)) {
  background-color: #f0f7ff !important; /* Azul tenue para Domingos */
  color: #1976d2 !important;
}

:deep(thead tr:nth-child(1) th:nth-child(3)) {
  background-color: #f5fcf5 !important; /* Verde tenue para Finales */
  color: #2e7d32 !important;
}

:deep(thead tr:nth-child(1) th:nth-child(4)) {
  background-color: #fff7ed !important; /* Naranja tenue para Previo */
  color: #d97706 !important;
}

.font-variant-numeric {
  font-variant-numeric: tabular-nums; /* Mantiene los números alineados */
}

.custom-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.7rem !important;
}

.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

/* HEADER */
:deep(.sticky-col-header) {
  position: sticky !important;
  left: 0;
  z-index: 100;
  background: #f8fafc !important;
}

:deep(.sticky-col) {
  position: sticky !important;
  left: 0;
  z-index: 90;
  background: white !important;
}

:deep(tr:hover .sticky-col) {
  background: #f8fafc !important;
}

:deep(.sticky-col),
:deep(.sticky-col-header) {
  box-shadow: 2px 0 1px rgba(0, 0, 0, 0.08);
}

:deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
