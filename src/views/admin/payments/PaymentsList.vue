<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePayments from '@/composables/admin/payments/usePayments';
import usePaymentRecordMutations from '@/composables/admin/payments/usePaymentMutations';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import PaymentHistoryList from '@/components/payments/PaymentHistoryList.vue';
import { useRouter } from 'vue-router';
import type { Payment } from '@/models/Payments';
import Swal from 'sweetalert2';
import usePaymentPdf from '@/composables/admin/payments/usePaymentPdf';
import EditInvoice from '@/components/invoices/EditInvoice.vue';
import type { EditInvoiceReq, Invoice } from '@/models/Invoice';
import InvoiceDetail from '@/components/invoices/InvoiceDetail.vue';
import useInvoices from '@/composables/admin/invoice/useInvoices';
import useInvoiceMutations from '@/composables/admin/invoice/useInvoiceMutation';
import { toast } from 'vue3-toastify';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { AxiosError } from 'axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const showPaymentHistory = ref(false);
const selectPaymentIdPdf = ref('');
const selectPayment = ref<Payment>({
  paymentshistory: [] as any[]
} as Payment);
const selectedInvoice = ref<Invoice>({} as Invoice);
const breadcrumbs = ref([
  {
    title: 'Cobros',
    disabled: false,
    href: '#'
  }
]);

const { isPaymentPdfLoading, refetchPaymentPdf } = usePaymentPdf(selectPaymentIdPdf);

const { paymentsData, isPaymentsLoading, page, perPage, search } = usePayments();
const { invoicesData, isLoading, refetch } = useInvoices();
const { updateInvoiceMutation, sendInvoicesToContificoMutation } = useInvoiceMutations();

const { cancelPaymentMutation } = usePaymentRecordMutations();

const debouncedSearch = ref('');
const showDetails = ref(false);
const showEdit = ref(false);

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
  { title: 'Enviado a contifico', value: 'sentContifico', sortable: true },
  { title: 'Error en cobro', value: 'hasSomePaymentWithError', sortable: true },
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
  selectPayment.value = items;
  showPaymentHistory.value = true;
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

function getInvoiceForPayment(payment: Payment): Invoice {
  return invoicesData.value.content.find((inv: Invoice) => inv.payment.id === payment.id)!!;
}

const handleShowDetails = (item: Invoice) => {
  selectedInvoice.value = item;
  showDetails.value = true;
};

const handleShowEdit = (item: Invoice) => {
  selectedInvoice.value = item;
  showEdit.value = true;
};

const updateInvoice = async (invoiceReq: EditInvoiceReq) => {
  await updateInvoiceMutation.mutateAsync(invoiceReq, {
    onSuccess: async () => {
      toast.success('Factura actualizada correctamente');
      await refetch();
      selectedInvoice.value = {} as Invoice;
      showEdit.value = false;
    },
    onError(error) {
      const err = error as AxiosError<ErrorApiResponse>;
      let message = err.response?.data?.message;
      err.response?.data?.errors.forEach((err) => (message += `\n ${err}`));
      toast.error(message || 'Error al actualizar la factura');
    }
  });
};

const sendInvoices = async () => {
  await sendInvoicesToContificoMutation.mutateAsync(undefined, {
    onSuccess: async () => {
      toast.success('Facturas actualizada correctamente');
      await refetch();
      selectedInvoice.value = {} as Invoice;
      showEdit.value = false;
    },
    onError(error) {
      const err = error as AxiosError<ErrorApiResponse>;
      let message = err.response?.data?.message;
      err.response?.data?.errors.forEach((err) => (message += `\n ${err}`));
      toast.error(message || 'Error al actualizar la factura');
    }
  });
};

function formatDate(dateStr: Date): string {
  const [date, time] = dateStr.toString().split('T');
  return `${date} ${time.slice(0, 5)}`;
}
</script>

<template>
  <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Lista de Cobros">
    <v-data-table-server :headers="headers" :search="debouncedSearch" :items="paymentsData.content"
      :loading="isPaymentsLoading || isPaymentPdfLoading || isLoading" :items-length="paymentsData.totalElements"
      :items-per-page="10" show-expand @update:options="loadItems">
      <template v-slot:top>
        <v-toolbar v-motion class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat
          :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
          <VTextField v-model="debouncedSearch" placeholder="Buscar cobros..." variant="outlined" density="comfortable"
            hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm" bg-color="white">
            <template #prepend-inner>
              <div class="tw:relative">
                <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
              </div>
            </template>
            <template v-if="debouncedSearch" #append>
              <VBtn icon variant="text" size="small" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                @click="debouncedSearch = ''">
                <Icon icon="mdi:close" height="18" />
              </VBtn>
            </template>
          </VTextField>
          <v-spacer></v-spacer>
          <VBtn variant="elevated" color="primary" @click="onCreatePayment">
            <Icon class="mr-2" icon="mdi:plus" />
            Crear Cobro
          </VBtn>
          <VBtn variant="elevated" color="info" class="ml-2" @click="sendInvoices">
            <Icon class="mr-2" icon="meteor-icons:paper-plane" />
            Enviar a Contifico
          </VBtn>
        </v-toolbar>
      </template>
      <template #item.programs="{ item }">
        <div class="d-flex flex-wrap gap-2">
          <v-chip v-for="program in item.products[0].programs" :key="program.id" size="small" variant="outlined"
            class="text-caption mr-2" :color="getProgramColor(program.courseLevel)">
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
          <v-chip size="small"
            :color="item.status === 'PENDING' ? 'warning' : item.status === 'COMPLETED' ? 'success' : 'error'">
            {{ item.status === 'PENDING' ? 'Pendiente' : item.status === 'COMPLETED' ? 'Completado' : 'Cancelado' }}
          </v-chip>
        </div>
      </template>
      <template #item.sentContifico="{ item }">
        <div v-if="getInvoiceForPayment(item).sentContifico">
          <v-icon class="ml-2" color="success">
            <Icon icon="material-symbols:check-circle-outline" />
          </v-icon>
        </div>
        <div v-else>
          <v-tooltip location="top" :text="getInvoiceForPayment(item).contificoError">
            <template #activator="{ props: activatorProps }">
              <v-icon class="ml-2" color="error" v-bind="activatorProps">
                <Icon icon="weui:close2-outlined" />
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template #item.hasSomePaymentWithError="{ item }">
        <div v-if="item.hasSomePaymentWithError">
          <v-icon class="ml-2" color="success">
            <Icon icon="material-symbols:check-circle-outline" />
          </v-icon>
        </div>
        <div v-else>
          <v-tooltip location="top" :text="'No se han registrado errores en los cobros'">
            <template #activator="{ props: activatorProps }">
              <v-icon class="ml-2" color="error" v-bind="activatorProps">
                <Icon icon="weui:close2-outlined" />
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2">
          <v-btn v-tooltip="'Ver lista de pagos'" icon color="info" variant="text" size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click="onPaymentHistoryShow(item)">
            <Icon icon="mdi:list-box-outline" />
          </v-btn>
          <v-btn v-tooltip="'Imprimir compromiso de cobro'" icon color="success" variant="text" size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100" @click="handleDownloadPdf(item)">
            <Icon icon="material-symbols:print-outline-rounded" />
          </v-btn>
          <v-btn v-if="item.status !== 'CANCELLED'" v-tooltip="'Cerrar Cobro'" color="error" icon variant="text"
            size="32" class="tw:bg-red-300 hover:!tw:bg-red-100" @click="onChangeStatus(item)">
            <Icon icon="mdi-power" height="18" />
          </v-btn>
        </div>
      </template>
      <template #expanded-row="{ item }">
        <td :colspan="headers.length">
          <div class="pa-4">
            <v-row>
              <v-col cols="4">
                <div class="tw:font-bold">Número de Factura</div>
                <div>{{ getInvoiceForPayment(item).invoiceNumber }}</div>
              </v-col>
              <v-col cols="4">
                <div class="tw:font-bold">Nombre</div>
                <div>{{ getInvoiceForPayment(item).fullName }}</div>
              </v-col>
              <v-col cols="4">
                <div class="tw:font-bold">Identificación</div>
                <div>{{ getInvoiceForPayment(item).document }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <div class="tw:font-bold">Fecha</div>
                <div>{{ formatDate(getInvoiceForPayment(item).invoiceDate) }}</div>
              </v-col>
              <v-col cols="4">
                <div class="tw:font-bold">Total</div>
                <div>{{ getInvoiceForPayment(item).amount }}</div>
              </v-col>
              <v-col cols="4" class="d-flex">
                <div>
                  <div class="tw:font-bold">Acciones</div>
                  <div class="d-flex tw:gap-x-2">
                    <v-btn color="info" variant="tonal" @click="handleShowDetails(getInvoiceForPayment(item))">
                      <Icon icon="mdi:eye" class="mr-2" />
                      Ver Factura
                    </v-btn>
                    <div v-if="!getInvoiceForPayment(item).sentContifico && item.status !== 'CANCELLED'">
                      <v-btn color="success" variant="tonal" @click="handleShowEdit(getInvoiceForPayment(item))">
                        <Icon icon="tabler:pencil" class="mr-2" />
                        Editar Factura
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </td>
      </template>
    </v-data-table-server>
    <InvoiceDetail v-if="showDetails" :invoice="selectedInvoice" :showDialog="true" @cancel="showDetails = false" />
    <EditInvoice v-if="showEdit" :invoice="selectedInvoice" :showDialog="showEdit" @cancel="showEdit = !showEdit"
      @save="updateInvoice" />
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
</style>
