<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePayments from '@/composables/admin/payments/usePayments';
import usePaymentRecordMutations from '@/composables/admin/payments/usePaymentMutations';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import PaymentHistoryList from '@/components/payments/PaymentHistoryList.vue';
import { useRouter } from 'vue-router';
import type { Payment } from '@/models/Payments';
import Swal from 'sweetalert2';
import usePaymentPdf from '@/composables/admin/payments/usePaymentPdf';

const showPaymentHistory = ref(false);
const selectPaymentIdPdf = ref('');
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

const { pdfArray, isPaymentPdfError, isPaymentPdfLoading, refetchPaymentPdf } = usePaymentPdf(selectPaymentIdPdf);

const { paymentsData, isPaymentsLoading, page, perPage, search } = usePayments();
const { cancelPaymentMutation } = usePaymentRecordMutations();

const headers = [
  { title: 'Nombre', value: 'participant.user.name', sortable: true },
  { title: 'Producto', value: 'products', sortable: true },
  { title: 'Programas', value: 'programs', sortable: true },
  { title: 'Precio', value: 'total', sortable: true },
  { title: 'Estado', value: 'status', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];
const getProgramColor = (level: string): string => {
  type LevelKeys = 'FOCUS' | 'YOUR' | 'LIFE';
  const colors: Record<LevelKeys, string> = {
    FOCUS: 'blue',
    YOUR: 'green',
    LIFE: 'purple'
  };
  return colors[level.toUpperCase() as LevelKeys] || 'grey';
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
        perPage.value = paymentsData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};
const router = useRouter();
const onCreatePayment = () => {
  router.push({ name: 'pos-preload' });
};

const onPaymentHistoryShow = (items: Payment) => {
  showPaymentHistory.value = true;
  selectPayment.value = items;
};

const handlePaymentUpdated = (updatedPayment: Payment) => {
  selectPayment.value = updatedPayment;

  const index = paymentsData.value.content.findIndex((p) => p.id === updatedPayment.id);
  if (index !== -1) {
    paymentsData.value.content[index] = updatedPayment;
  }
};

const onChangeStatus = (item: Payment) => {
  Swal.fire({
    title: `¿Estás seguro de CANCELAR este Pago?`,
    text: `Estás a punto de CANCELAR el Pago. ¿Deseas continuar?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: `<span class="tw:text-white">Continuar</span>`,
    cancelButtonText: `<span class="tw:text-white">Atras</span>`
  }).then(async (params) => {
    if (params.isConfirmed) {
      try {
        await cancelPaymentMutation.mutateAsync({ id: item.id, newStatus: 'CANCELLED' });
        const index = paymentsData.value.content.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          paymentsData.value.content[index].status = 'CANCELLED';
        }
        Swal.fire('¡Éxito!', `El producto ha sido CANCELADO correctamente.`, 'success');
      } catch (error) {
        console.error('Error al cambiar el estado del producto:', error);
        Swal.fire('Error', 'No se pudo actualizar el estado del producto', 'error');
      }
    }
  });
};

const handleDownloadPdf = async (item: Payment) => {
  selectPaymentIdPdf.value = item.id;

  const { data } = await refetchPaymentPdf();

  if (data) {
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};
</script>

<template>
  <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Lista de Cobros">
    <v-data-table-server
      :headers="headers"
      :search="search"
      :items="paymentsData.content"
      :loading="isPaymentsLoading"
      :items-length="paymentsData.totalElements"
      :items-per-page="10"
      @update:options="loadItems"
    >
      <template v-slot:top>
        <v-toolbar
          v-motion
          class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
          flat
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
          :duration="250"
        >
          <VTextField
            v-model="search"
            placeholder="Buscar cobros..."
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
            <template v-if="search" #append>
              <VBtn icon variant="text" size="small" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors" @click="search = ''">
                <Icon icon="mdi:close" height="18" />
              </VBtn>
            </template>
          </VTextField>
          <v-spacer></v-spacer>
          <VBtn variant="elevated" color="primary" @click="onCreatePayment">
            <Icon class="mr-2" icon="mdi:plus" />
            Crear Cobro
          </VBtn>
        </v-toolbar>
      </template>
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
            v-tooltip="'Imprimir compromiso de cobro'"
            icon
            color="success"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click="handleDownloadPdf(item)"
          >
            <Icon icon="material-symbols:print-outline-rounded" />
          </v-btn>
          <v-btn
            v-tooltip="'Cerrar Cobro'"
            color="error"
            icon
            variant="text"
            size="32"
            class="tw:bg-red-300 hover:!tw:bg-red-100"
            @click="onChangeStatus(item)"
          >
            <Icon icon="mdi-power" height="18" />
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
    <PaymentHistoryList v-model="showPaymentHistory" :payment="selectPayment" @payment-updated="handlePaymentUpdated" />
  </UiParentCard>
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
