<script setup lang="ts">
import EditInvoice from '@/components/invoices/EditInvoice.vue';
import InvoiceDetail from '@/components/invoices/InvoiceDetail.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useInvoiceMutations from '@/composables/admin/invoice/useInvoiceMutation';
import useInvoices from '@/composables/admin/invoice/useInvoices';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { EditInvoiceReq, Invoice } from '@/models/Invoice';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { email } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const breadcrumbs = ref([
  {
    title: 'Facturas',
    disabled: false,
    href: '#'
  }
]);

const { invoicesData, isLoading, page, perPage, search, refetch } = useInvoices();
const { updateInvoiceMutation, sendInvoicesToContificoMutation } = useInvoiceMutations();

const debouncedSearch = ref('');
const selectedInvoice = ref<Invoice>({} as Invoice);
const showDetails = ref(false);
const showEdit = ref(false);

const headers = [
  { title: 'Nro. Factura', value: 'invoiceNumber', sortable: true },
  { title: 'Fecha', value: 'invoiceDate', sortable: true },
  { title: 'Identificación', value: 'document', sortable: true },
  { title: 'Nombre Completo', value: 'fullName', sortable: true },
  { title: 'Total', value: 'amount', sortable: true },
  { title: 'Enviada a Contifico', value: 'sentContifico', sortable: false },
  { title: 'Acciones', value: 'actions', sortable: false }
];

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = invoicesData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

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
</script>

<template>
  <BaseBreadcrumb :title="'Facturas'" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Lista de Facturas">
    <v-data-table-server
      :headers="headers"
      :search="debouncedSearch"
      :items="invoicesData.content"
      :loading="isLoading || updateInvoiceMutation.isPending.value || sendInvoicesToContificoMutation.isPending.value"
      :items-length="invoicesData.totalElements"
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
            placeholder="Buscar facturas..."
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
          </VTextField>
          <v-spacer></v-spacer>
          <VBtn variant="elevated" color="info" class="ml-2" @click="sendInvoices">
            <Icon class="mr-2" icon="meteor-icons:paper-plane" />
            Enviar a Contifico
          </VBtn>
        </v-toolbar>
      </template>
      <template #item.sentContifico="{ item }">
        <v-icon class="ml-2" :color="item.sentContifico ? 'success' : 'error'">
          <Icon :icon="item.sentContifico ? 'material-symbols:check-circle-outline' : 'weui:close2-outlined'"></Icon>
        </v-icon>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-middle">
          <v-btn
            v-tooltip="'Ver detalles de factura'"
            icon
            color="info"
            variant="text"
            size="32"
            class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
            @click="handleShowDetails(item)"
          >
            <Icon icon="mdi:eye" />
          </v-btn>
          <div v-if="!item.sentContifico">
            <v-btn
              v-tooltip="'Actualizar datos de factura'"
              icon
              color="success"
              variant="text"
              size="32"
              class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
              @click="handleShowEdit(item)"
            >
              <Icon icon="tabler:pencil" />
            </v-btn>
            <v-tooltip interactive>
              <template v-slot:activator="{ props: activatorProps }">
                <v-icon color="error" v-bind="activatorProps">
                  <Icon icon="mdi-information-outline"></Icon>
                </v-icon>
              </template>
              <span>{{ item.contificoError }}</span>
            </v-tooltip>
          </div>
        </div>
      </template>
    </v-data-table-server>
  </UiParentCard>

  <InvoiceDetail v-if="showDetails" :invoice="selectedInvoice" :showDialog="showDetails" @cancel="showDetails = !showDetails" />
  <EditInvoice v-if="showEdit" :invoice="selectedInvoice" :showDialog="showEdit" @cancel="showEdit = !showEdit" @save="updateInvoice" />
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
