<script setup lang="ts">
import CashDrawerBalanceDetails from '@/components/cashDrawer/CashDrawerBalanceDetails.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useCashDrawerBalancePdfMutationPdf from '@/composables/admin/pos/useCashDrawerBalancePdfMutation';
import useCashDrawersByCashBox from '@/composables/admin/pos/useCashDrawersByCashBox';
import type { CashDrawer } from '@/models/CashDrawer';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const id = useRoute().params.id.toString();
const headers = [
  { title: 'Abierto por', value: 'openedByUser.name', sortable: true },
  { title: 'Cerrado por', value: 'closedByUser.name', sortable: true },
  { title: 'Fecha de apertura', value: 'startDate', sortable: true },
  { title: 'Fecha de cierre', value: 'closeDate', sortable: true },
  { title: 'Monto inicial', value: 'openingBalance', sortable: true },
  { title: 'Monto final', value: 'closedBalance', sortable: true },
  { title: 'Estado', value: 'status', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const breadcrumbs = ref([
  {
    title: 'Balances',
    disabled: false,
    href: '#'
  }
]);
const search = ref('');
const selectedCashDrawerId = ref('');

const { cashDrawers, isCashDrawerLoading, isCashDrawersError, refetchCashDrawer } = useCashDrawersByCashBox(id);
const { isPaymentPdfLoading, refetchPaymentPdf } = useCashDrawerBalancePdfMutationPdf(selectedCashDrawerId);

function formatDate(dateStr: string): string {
  const [date, time] = dateStr.split('T');
  return `${date} ${time.slice(0, 5)}`;
}

const handlePrintBalance = async (item: CashDrawer) => {
  selectedCashDrawerId.value = item.id;

  const { data } = await refetchPaymentPdf();

  if (data) {
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};
</script>
<template>
  <BaseBreadcrumb :title="'Balances'" :breadcrumbs="breadcrumbs" />

  <v-data-table :search="search" :items="cashDrawers" :headers="headers" :loading="isPaymentPdfLoading || isCashDrawerLoading">
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
          placeholder="Buscar cuenta..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
          bg-color="white"
        >
          <template #prepend-inner>
            <div class="tw:relative">
              <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
              <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
            </div>
          </template>
          <template #append v-if="search">
            <VBtn icon variant="text" size="small" @click="search = ''" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
              <Icon icon="mdi:close" height="18" />
            </VBtn>
          </template>
        </VTextField>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <template #item.startDate="{ item }">
      <span>{{ formatDate(item.startDate) }}</span>
    </template>

    <template #item.closeDate="{ item }">
      <span>{{ item.closeDate ? formatDate(item.closeDate) : '' }}</span>
    </template>

    <template #item.closedBalance="{ item }">
      <span>{{ item.closedBalance || item.actualBalance }}</span>
    </template>

    <template #item.status="{ item }">
      <v-chip size="small" :color="item.status !== 'OPEN' ? 'warning' : 'success'">
        {{ item.status === 'OPEN' ? 'Abierto' : 'Cerrado' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <v-btn
        v-tooltip="'Imprimir balance de caja'"
        icon
        color="info"
        variant="text"
        class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
        @click="handlePrintBalance(item)"
      >
        <Icon icon="material-symbols:print-outline-rounded" />
      </v-btn>
    </template>
  </v-data-table>
</template>
