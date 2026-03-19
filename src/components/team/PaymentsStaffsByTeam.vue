<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { PaymentStaffDashboard } from '@/models/DashboardFocus';
import { computed, ref, onMounted } from 'vue';

interface Props {
  data: PaymentStaffDashboard[];
}
const props = defineProps<Props>();
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

const search = ref('');
const headers = [
  //Solo Domingo
  { title: 'Staff', value: 'staffName', sortable: true },
  { title: 'Abono YOUR', value: 'yourPaymentsSunday', sortable: true },
  { title: 'Total YOUR + LIFE', value: 'yourPlusLifePaymentsSunday', sortable: true },
  { title: 'Total', value: 'totalPaymentsSunday', sortable: true },
  { title: 'Total (%)', value: 'passPercentageSunday', sortable: true },
  //Solo Finales
  { title: 'Abono Finales', value: 'yourPaymentsFinal', sortable: true },
  { title: 'Total YOUR + LIFE', value: 'yourPlusLifePaymentsFinal', sortable: true },
  { title: 'Total', value: 'totalPaymentsFinal', sortable: true },
  { title: 'Total (%)', value: 'passPercentageFinal', sortable: true }
];

const totalYourPartialPaymentsCount = computed(() => {
  return (props.data ?? []).reduce((total, item) => total + (item.yourPartialPaymentsCount ?? 0), 0);
});

const totalYourCompletedPaymentsCount = computed(() => {
  return (props.data ?? []).reduce((total, item) => total + (item.yourCompletedPaymentsCount ?? 0), 0);
});

const totalLifePartialPaymentsCount = computed(() => {
  return (props.data ?? []).reduce((total, item) => total + (item.lifePartialPaymentsCount ?? 0), 0);
});

const totalLifeCompletedPaymentsCount = computed(() => {
  return (props.data ?? []).reduce((total, item) => total + (item.lifeCompletedPaymentsCount ?? 0), 0);
});

const totalPayments = computed(() => {
  return (props.data ?? []).reduce((total, item) => total + (item.totalPayments ?? 0), 0);
});

const totalRow = computed(() => ({
  staffName: 'TOTAL',
  yourPartialPaymentsCount: totalYourPartialPaymentsCount.value,
  yourCompletedPaymentsCount: totalYourCompletedPaymentsCount.value,
  lifePartialPaymentsCount: totalLifePartialPaymentsCount.value,
  lifeCompletedPaymentsCount: totalLifeCompletedPaymentsCount.value,
  totalPayments: totalPayments.value
}));
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-green-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-cash-outline" height="20" class="tw:text-green-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resúmen de Pagos por Staff</h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de pagos por staff</p>
        </div>
      </div>
      <v-data-table :items="props.data" :headers="headers" :search="search" class="" :loading="!ready" dense>
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
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template #item.staffName="{ item }">
          <div class="tw:flex tw:items-center tw:gap-3 tw:py-1">
            <div
              class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-gradient-to-br tw:from-green-100 tw:to-green-100 tw:flex tw:items-center tw:justify-center"
            >
              <Icon icon="mdi:account-tie" class="tw:text-green-600" height="18" />
            </div>
            <span class="tw:font-medium tw:text-gray-800">{{ item.staffName ?? '' }}</span>
          </div>
        </template>
        <template #item.yourPartialPaymentsCount="{ item }">
          <div class="text-end">
            <span class="tw-font-semibold"> $ {{ (item.yourPartialPaymentsCount ?? 0).toFixed(2) }} </span>
          </div>
        </template>
        <template #item.yourCompletedPaymentsCount="{ item }">
          <div class="text-end">
            <span class="tw-font-semibold"> $ {{ (item.yourCompletedPaymentsCount ?? 0).toFixed(2) }} </span>
          </div>
        </template>
        <template #item.lifePartialPaymentsCount="{ item }">
          <div class="text-end">
            <span class="tw-font-semibold"> $ {{ (item.lifePartialPaymentsCount ?? 0).toFixed(2) }} </span>
          </div>
        </template>
        <template #item.lifeCompletedPaymentsCount="{ item }">
          <div class="text-end">
            <span class="tw-font-semibold"> $ {{ (item.lifeCompletedPaymentsCount ?? 0).toFixed(2) }} </span>
          </div>
        </template>
        <template #item.totalPayments="{ item }">
          <div class="text-end">
            <span class="tw-font-semibold"> $ {{ (item.totalPayments ?? 0).toFixed(2) }} </span>
          </div>
        </template>
        <!-- Fila de totales -->
        <template #body.append>
          <tr class="tw:bg-green-50 tw:font-semibold">
            <td class="text-end">{{ totalRow.staffName }}</td>
            <td class="text-end">$ {{ totalRow.yourPartialPaymentsCount.toFixed(2) }}</td>
            <td class="text-end">$ {{ totalRow.yourCompletedPaymentsCount.toFixed(2) }}</td>
            <td class="text-end">$ {{ totalRow.lifePartialPaymentsCount.toFixed(2) }}</td>
            <td class="text-end">$ {{ totalRow.lifeCompletedPaymentsCount.toFixed(2) }}</td>
            <td class="text-end tw:text-green-800">$ {{ totalRow.totalPayments.toFixed(2) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<style scoped>
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
