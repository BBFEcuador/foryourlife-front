<script setup lang="ts">
import PaymentInvoicesList from '@/components/payments/PaymentInvoicesList.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import usePayment from '@/composables/admin/payments/usePayment';
import usePaymentRecordMutations from '@/composables/admin/payments/usePaymentMutations';
import usePaymentPdf from '@/composables/admin/payments/usePaymentPdf';
import usePayments from '@/composables/admin/payments/usePayments';
import type { Payment } from '@/models/Payments';
import { Icon } from '@iconify/vue/dist/iconify.js';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const showPaymentHistory = ref(false);
const selectPaymentIdPdf = ref('');
const selectedPaymentId = ref('');
const breadcrumbs = ref([
  {
    title: 'Cobros',
    disabled: false,
    href: '#'
  }
]);

const { isPaymentPdfLoading, refetchPaymentPdf } = usePaymentPdf(selectPaymentIdPdf);

const { paymentsData, isPaymentsLoading, page, perPage, search } = usePayments();

const { cancelPaymentMutation } = usePaymentRecordMutations();

const debouncedSearch = ref('');

const { payment, refetchPayment, isPaymentLoading } = usePayment(selectedPaymentId);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});

const headers = [
  { title: 'Nombre', value: 'participant.user.name', sortable: true },
  { title: 'Producto', value: 'products', sortable: true },
  { title: 'Programas', value: 'programs', sortable: true },
  { title: 'Precio', value: 'total', sortable: true },
  { title: 'Saldo Restante', value: 'remainingBalance' },
  { title: 'Todas las facturas enviadas', value: 'hasSomePaymentWithError', sortable: true },
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
  router.push({ name: 'payments-admin-create' });
};

const onPaymentHistoryShow = (items: Payment) => {
  selectedPaymentId.value = items.id;
  payment.value = items;
  showPaymentHistory.value = true;
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

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" />
  <div v-if="checkPermission(PermissionEnum.SEE_PAYMENTS)">
    <UiParentCard title="Lista de Cobros">
      <v-data-table-server
        :headers="headers"
        :search="debouncedSearch"
        :items="paymentsData.content"
        :loading="isPaymentsLoading || isPaymentPdfLoading"
        :items-length="paymentsData.totalElements"
        :items-per-page="10"
        show-expand
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
              v-model="debouncedSearch"
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
              <template v-if="debouncedSearch" #append>
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                  @click="debouncedSearch = ''"
                >
                  <Icon icon="mdi:close" height="18" />
                </VBtn>
              </template>
            </VTextField>
            <v-spacer></v-spacer>
            <VBtn v-if="checkPermission(PermissionEnum.CREATE_PAYMENTS)" variant="elevated" color="primary" @click="onCreatePayment">
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
        <template #item.status="{ item }">
          <div class="d-flex flex-wrap gap-2">
            <v-chip size="small" :color="item.status === 'PENDING' ? 'warning' : item.status === 'COMPLETED' ? 'success' : 'error'">
              {{ item.status === 'PENDING' ? 'Pendiente' : item.status === 'COMPLETED' ? 'Completado' : 'Cancelado' }}
            </v-chip>
          </div>
        </template>
        <template #item.total="{ item }"> $ {{ item.total?.toFixed(2) || '0.00' }} </template>
        <template #item.remainingBalance="{ item }"> $ {{ item.remainingBalance?.toFixed(2) || '0.00' }} </template>

        <template #item.hasSomePaymentWithError="{ item }">
          <div v-if="!item.hasSomePaymentWithError">
            <v-tooltip location="top" :text="'No se han registrado errores en los cobros'">
              <template #activator="{ props: activatorProps }">
                <v-icon class="ml-2" color="success" v-bind="activatorProps">
                  <Icon icon="material-symbols:check-circle-outline" />
                </v-icon>
              </template>
            </v-tooltip>
          </div>
          <div v-else>
            <v-icon class="ml-2" color="error">
              <Icon icon="weui:close2-outlined" />
            </v-icon>
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
              v-if="item.status !== 'CANCELLED' && checkPermission(PermissionEnum.DELETE_PAYMENTS)"
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
        <template #expanded-row="{ item }">
          <td :colspan="10" class="tw:bg-gray-50 tw:py-0 tw:p-4">
            <h4 class="tw:font-semibold tw:mb-4 text-primary">Detalles de la Factura:</h4>
            <div class="tw:p-6 tw:m-4">
              <v-divider class="mb-3"></v-divider>
              <v-row dense>
                <v-col cols="12" sm="6" md="6">
                  <div class="detail-group">
                    <p class="label">Número de Factura</p>
                    <div class="value tw:text-gray-700 d-flex tw:gap-1 mb-1 align-center">
                      <Icon icon="mdi:file-document-outline" class="tw:text-gray-700" height="16" />
                      {{ item.invoice[0].invoiceNumber }}
                    </div>
                  </div>
                  <div class="detail-group">
                    <p class="label">Fecha de Emisión</p>
                    <div class="value tw:text-gray-700 d-flex tw:gap-1 mb-1 align-center">
                      <Icon icon="mdi:calendar" class="tw:text-gray-700" height="16" />
                      {{ formatDate(item.invoice[0].invoiceDate) }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <div class="detail-group">
                    <p class="label">Nombre del cliente</p>
                    <div class="value tw:text-gray-700 d-flex tw:gap-1 mb-1 align-center">
                      <Icon icon="mdi:user" class="tw:text-gray-700" height="16" />
                      {{ item.invoice[0].fullName }}
                    </div>
                  </div>
                  <div class="detail-group">
                    <p class="label">Identificación</p>
                    <div class="value tw:text-gray-700 d-flex tw:gap-1 mb-1 align-center">
                      <Icon icon="mdi:card-account-details" class="tw:text-gray-700" height="16" />
                      {{ item.invoice[0].document }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </td>
        </template>
      </v-data-table-server>
      <PaymentInvoicesList
        v-model="showPaymentHistory"
        :payment="payment"
        @payment-updated="refetchPayment"
        :isRefetching="isPaymentLoading"
      />
    </UiParentCard>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
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
  white-space: wrap;
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

/* Estilos CSS para complementar el diseño minimalista */

/* Agrupa el Label y el Valor con espacio */
.detail-group {
  margin-bottom: 1rem; /* Espacio entre cada par de datos */
}

/* Estilo para la Etiqueta (Minimalista y Suave) */
.detail-group .label {
  /* color: #6b7280; 
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px; */

  /* background-color: #f8fafc !important; */
  /* color: #64748b; */
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: wrap;
}

/* Estilo para el Valor (Prominente) */
.detail-group .value {
  /* color: #1f2937;  */
  font-size: 0.875rem;
  font-weight: 500; /* Hace que el dato sea el foco visual */
  /* margin-left: 8px; */
}
</style>
