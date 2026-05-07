<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import type { Payment } from '@/models/Payments';
import { StatusMeta } from '@/models/Payments';
import useUserPayments from '@/composables/participants/payments/useUserPayments';
import UserPaymentHistory from '@/components/payments/UserPaymentHistory.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

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
  { title: 'Nombre', value: 'participant.user.name', sortable: false },
  { title: 'Producto', value: 'products', sortable: false },
  { title: 'Programas', value: 'programs', sortable: false },
  { title: 'Precio', value: 'total', sortable: false },
  { title: 'Estado', value: 'status', sortable: false },
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

const formatCurrency = (value: number): string => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
};
</script>

<template>
  <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" home-route="UserDashboard" />
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
      <template #item.total="{ item }">
        {{ formatCurrency(item.total) }}
      </template>
      <template #item.status="{ item }">
        <v-chip :color="StatusMeta[item.status].color" size="small" variant="tonal">
          <Icon :icon="StatusMeta[item.status].icon" height="16" class="mr-1" />
          {{ StatusMeta[item.status].label }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <div class="text-center">
          <v-btn
            v-tooltip="'Ver lista de pagos'"
            icon
            color="info"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click="onPaymentHistoryShow(item)"
          >
            <Icon icon="mdi:list-box-outline" height="20" />
          </v-btn>
          <!-- <v-btn
            v-tooltip="'Realizar un pago'"
            icon
            color="success"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click=""
          >
            <Icon icon="hugeicons:payment-02" height="20" />
          </v-btn> -->
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
