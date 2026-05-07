<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useCashDrawerBalancePdfMutationPdf from '@/composables/admin/pos/useCashDrawerBalancePdfMutation';
import useCashDrawersByCashBox from '@/composables/admin/pos/useCashDrawersByCashBox';
import type { CashDrawer } from '@/models/CashDrawer';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useCashDrawerExcelMutations from '@/composables/admin/pos/useCashDrawerExcelMutations';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';

const id = useRoute().params.id.toString();
const headers = [
  { title: 'Abierto por', value: 'openedByUser.name', sortable: false },
  { title: 'Cerrado por', value: 'closedByUser.name', sortable: false },
  { title: 'Fecha de apertura', value: 'startDate', sortable: false },
  { title: 'Fecha de cierre', value: 'closeDate', sortable: false },
  { title: 'Monto inicial', value: 'openingBalance', sortable: false },
  { title: 'Monto final', value: 'closedBalance', sortable: false },
  { title: 'Estado', value: 'status', sortable: false },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const breadcrumbs = ref([
  {
    title: 'Balances',
    disabled: false,
    href: '#'
  }
]);

const selectedCashDrawerId = ref('');

const { cashDrawers, isCashDrawerLoading, isCashDrawersError, refetchCashDrawer, page, perPage, search } = useCashDrawersByCashBox(id);
const { isPaymentPdfLoading, refetchPaymentPdf } = useCashDrawerBalancePdfMutationPdf(selectedCashDrawerId);
const { excelMutation } = useCashDrawerExcelMutations();

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

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = cashDrawers.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

function formatCurrency(value: number) {
  if (typeof value !== 'number') return '-';
  return `$ ${value.toFixed(2)}`;
}

const debouncedSearch = ref('');

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});

const handleDownloadBalance = (item: CashDrawer) => {
  excelMutation.mutate(item.id, {
    onSuccess(data, variables, context) {
      const blob = data;
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cierre_caja.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Reporte generado correctamente');
    },
    onError(error, variables, context) {
      let e = error as AxiosError<ErrorApiResponse>;
      toast.error(e.response?.data.message ?? 'No se pudo generar el excel');
    }
  });
};
</script>
<template>
  <BaseBreadcrumb :title="'Balances'" :breadcrumbs="breadcrumbs" />

  <v-data-table-server
    :items="cashDrawers.content"
    :headers="headers"
    :search="debouncedSearch"
    :loading="isPaymentPdfLoading || isCashDrawerLoading"
    :items-length="cashDrawers.totalElements"
    :items-per-page="10"
    @update:options="loadItems"
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
          v-model="debouncedSearch"
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
          <template #append v-if="debouncedSearch">
            <VBtn
              icon
              variant="text"
              size="small"
              @click="debouncedSearch = ''"
              class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
            >
              <Icon icon="mdi:close" height="18" />
            </VBtn>
          </template>
        </VTextField>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template #loading>
      <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
    </template>

    <template #item.startDate="{ item }">
      <span>{{ formatDate(item.startDate) }}</span>
    </template>

    <template #item.closeDate="{ item }">
      <span>{{ item.closeDate ? formatDate(item.closeDate) : '' }}</span>
    </template>

    <template #item.closedBalance="{ item }">
      <span>{{ formatCurrency(item.closedBalance || item.actualBalance) }}</span>
    </template>

    <template #item.openingBalance="{ item }">
      <span>{{ formatCurrency(item.openingBalance) }}</span>
    </template>

    <template #item.status="{ item }">
      <v-chip size="small" :color="item.status !== 'OPEN' ? 'warning' : 'success'">
        {{ item.status === 'OPEN' ? 'Abierto' : 'Cerrado' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex tw:justify-center tw:gap-2">
        <v-btn
          v-tooltip="'Imprimir balance de caja'"
          icon
          color="info"
          variant="text"
          class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
          @click="handlePrintBalance(item)"
        >
          <Icon icon="material-symbols:print-outline-rounded" height="20" />
        </v-btn>
        <v-btn
          v-tooltip="'Descargar cierre de caja'"
          icon
          color="success"
          variant="text"
          class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
          @click="handleDownloadBalance(item)"
          :loading="excelMutation.isPending.value"
        >
          <Icon icon="mdi:file-excel-outline" height="20" />
        </v-btn>
      </div>
    </template>
  </v-data-table-server>
</template>
<style scoped>
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
</style>
