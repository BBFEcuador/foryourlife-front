<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import type { Payment } from '@/models/Payments';
import useUserPayments from '@/composables/participants/payments/useUserPayments';
import UserPaymentHistory from '@/components/payments/UserPaymentHistory.vue';

const showPaymentHistory = ref(false);
const selectPayment = ref<Payment>({
  paymentshistory: [] as any[]
} as Payment);
const breadcrumbs = ref([
  {
    title: 'Cobros',
    disabled: false,
    href: '#'
  }
]);

const { payments, page, perPage, isUserPaymentsLoading } = useUserPayments();

const headers = [
  { title: 'Nombre', value: 'participant.user.name', sortable: true },
  { title: 'Producto', value: 'products', sortable: true },
  { title: 'Programas', value: 'programs', sortable: true },
  { title: 'Precio', value: 'total', sortable: true },
  { title: 'Estado', value: 'status', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = payments.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

const getProgramColor = (level: string): string => {
  type LevelKeys = 'FOCUS' | 'YOUR' | 'LIFE';
  const colors: Record<LevelKeys, string> = {
    FOCUS: 'blue',
    YOUR: 'green',
    LIFE: 'purple'
  };
  return colors[level.toUpperCase() as LevelKeys] || 'grey';
};

const onPaymentHistoryShow = (items: Payment) => {
  showPaymentHistory.value = true;
  selectPayment.value = items;
};
</script>

<template>
  <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Lista de Cobros">
    <v-data-table-server
      :headers="headers"
      :items="payments.content"
      :loading="isUserPaymentsLoading"
      :items-length="payments.totalElements"
      :items-per-page="10"
      class="v-data-table"
      @update:options="loadItems"
    >
      <template #item.programs="{ item }">
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="program in item.products[0].programs"
            :key="program.id"
            size="small"
            variant="outlined"
            class="text-caption mr-2"
            :color="getProgramColor(program.courseLevel)"
          >
            {{ program.courseLevel }}
          </v-chip>
        </div>
      </template>
      <template #item.products="{ item }">
        <div class="d-flex flex-wrap gap-2">
          <v-chip size="small" color="primary">
            {{ item.products[0].name }}
          </v-chip>
        </div>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex ga-2">
          <v-btn
            v-tooltip="'Ver lista de pagos'"
            icon
            color="info"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click="onPaymentHistoryShow(item)"
          >
            <Icon icon="mdi:list-box-outline" />
          </v-btn>
          <v-btn
            v-tooltip="'Realizar un pago'"
            icon
            color="success"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click=""
          >
            <Icon icon="hugeicons:payment-02" />
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </UiParentCard>
  <UserPaymentHistory :model-value="showPaymentHistory" @update:model-value="showPaymentHistory = $event" :payment="selectPayment" />
</template>

<style scoped>
.swal-confirm-text {
  background-color: #d33;
  color: white !important;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
}

.swal-cancel-text {
  background-color: #3085d6;
  color: yellow !important;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
}

.v-data-table :deep(th) {
  background-color: #663c84 !important;
  color: #ffffff !important;
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
