<script setup lang="ts">
import useInvoiceMutations from '@/composables/admin/invoice/useInvoiceMutation';
import usePaymentMethods from '@/composables/admin/paymentMethods/usePaymentMethods';
import usePayment from '@/composables/admin/payments/usePayment';
import usePaymentRecordMutations from '@/composables/admin/payments/usePaymentMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { EditInvoiceReq, Invoice } from '@/models/Invoice';
import type { Payment, PaymentHistoryRequest, PaymentMethod } from '@/models/Payments';
import { adminStore } from '@/stores/adminStore';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import moment from 'moment';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { VDateInput } from 'vuetify/labs/components';
import InputSection from '../forms/InputSection.vue';
import EditInvoice from '../invoices/EditInvoice.vue';
import InvoiceDetail from '../invoices/InvoiceDetail.vue';

const props = defineProps<{
  modelValue: boolean;
  originPos?: boolean;
  payment: Payment;
  isRefetching: boolean;
}>();

const itemsPerPage = 5;
const page = ref(1);
const showDetails = ref(false);
const selectedInvoice = ref<Invoice>({} as Invoice);

const emit = defineEmits(['update:modelValue', 'update:payment-posOrigin', 'payment-updated', 'save']);

const { paymentMethodsData } = usePaymentMethods();
const { sendInvoicesToContificoMutation, updateInvoiceMutation } = useInvoiceMutations();
const { savePaymentRecordMutations } = usePaymentRecordMutations();

const paymentMethodsList = computed(() => paymentMethodsData.value);

const total = computed(() => props.payment.invoice.length ?? 0);

const form = ref({
  date: new Date(),
  amount: '',
  paymentMethod: { id: '', type: '' } as PaymentMethod,
  transactionId: '',
  pingType: 'D'
});

const formRef = ref();
const loading = ref(false);
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const onPaymentMethodSelected = (id: string) => {
  const selected = paymentMethodsList.value.find((m) => m.id === id);
  form.value.paymentMethod = selected ?? ({} as PaymentMethod);
};

const headers = [
  { title: 'Fecha', value: 'date' },
  { title: 'Monto', value: 'amount' },
  { title: 'Enviado a Contifico', value: 'sentContifico' },
  { title: 'Acciones', value: 'actions', sortable: false }
];

watch(
  () => form.value.paymentMethod,
  (newVal) => {
    if (newVal.code === 'EF') {
      form.value.transactionId = Date.now().toString();
    } else {
      form.value.transactionId = '';
    }
  }
);

const onUpdateOptions = (options: any) => {
  page.value = options.page;
};

const updateInvoice = async (invoiceReq: EditInvoiceReq) => {
  await updateInvoiceMutation.mutateAsync(invoiceReq, {
    onSuccess: async () => {
      toast.success('Factura actualizada correctamente');
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

const showEdit = ref(false);

const close = () => (visible.value = false);

const paginatedHistory = computed(() => {
  const history = [...(props.payment?.invoice ?? [])].reverse();
  const start = (page.value - 1) * itemsPerPage;
  return history.slice(start, start + itemsPerPage);
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  if (!adminStore().isCashDrawerOpen) {
    toast.error('Debe abrir una caja para añadir el pago');
    return;
  }

  const paymentHistoryReq: PaymentHistoryRequest = {
    paymentId: props.payment!!.id,
    paymentHistory: {
      date: moment(form.value.date).format('DD/MM/YYYY'),
      amount: form.value.amount,
      paymentMethod: form.value.paymentMethod,
      transactionId: form.value.transactionId,
      pingType: form.value.paymentMethod.code === 'TC' ? form.value.pingType : undefined
    },
    cashDrawerId: adminStore().cashDrawer.id
  };

  if (props.originPos) {
    emit('update:payment-posOrigin', paymentHistoryReq);
    close();
    return;
  }

  savePaymentRecordMutations.mutate(paymentHistoryReq, {
    onSuccess: async () => {
      toast.success('Pago registrado exitosamente');
      formRef.value.reset();

      emit('payment-updated');
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al registrar el pago');
    }
  });
};

const handleShowDetails = (item: Invoice) => {
  selectedInvoice.value = item;
  showDetails.value = true;
};

const handleShowEdit = (item: Invoice) => {
  selectedInvoice.value = item;
  showEdit.value = true;
};
const formatDate = (isoDate: string | Date, pretty: boolean = false): string => {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;

  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleString('es-EC', {
    weekday: pretty ? 'long' : undefined,
    day: '2-digit',
    month: pretty ? 'long' : '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// si alguna factura tiene error al enviar a contifico, mostrar el boton de enviar a contifico
const hasInvoicesWithContificoError = computed(() => {
  if (!props.payment.invoice) return false;
  return props.payment.invoice.some((invoice) => !invoice.sentContifico);
});
</script>

<template>
  <v-dialog v-model="visible" max-width="1200" persistent>
    <v-card>
      <v-toolbar color="primary" title="Historial de facturas">
        <v-spacer />
        <v-btn icon variant="text" size="small" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors" @click="close">
          <Icon icon="mdi:close" height="18" />
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="props.payment?.status !== 'COMPLETED' && props.payment?.status !== 'CANCELLED'">
        <v-form ref="formRef" @submit.prevent="submitForm">
          <InputSection label="Registrar nuevo pago">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  variant="outlined"
                  :items="paymentMethodsList"
                  item-title="type"
                  item-value="id"
                  :rules="[(v) => !!v || 'El metodo de pago es obligatorio']"
                  label="Payment Method"
                  density="compact"
                  @update:model-value="onPaymentMethodSelected"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.amount"
                  label="Monto"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Campo requerido']"
                />
              </v-col>
              <v-col cols="12" :md="form.paymentMethod.code === 'TC' ? 4 : 6">
                <VDateInput v-model="form.date" variant="outlined" :disabled="originPos" :rules="[(v) => !!v || 'Campo requerido']" />
              </v-col>
              <v-col cols="12" :md="form.paymentMethod.code === 'TC' ? 4 : 6">
                <v-text-field
                  v-model="form.transactionId"
                  label="Codigo de la transacción"
                  type="text"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Campo requerido']"
                  :disabled="form.paymentMethod.code === 'EF'"
                />
              </v-col>
              <v-col v-if="form.paymentMethod.code === 'TC'" cols="12" md="4">
                <v-select
                  v-model="form.pingType"
                  label="Pasarela de Pago"
                  :items="[
                    {
                      id: 'D',
                      name: 'Datafast'
                    },
                    {
                      id: 'M',
                      name: 'Medianet'
                    },
                    {
                      id: 'E',
                      name: 'DataExpress'
                    },
                    {
                      id: 'P',
                      name: 'PlaceToPay'
                    },
                    {
                      id: 'A',
                      name: 'Alignet'
                    }
                  ]"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  :rules="[(v) => !!v || 'Campo requerido']"
                />
              </v-col>
            </v-row>
          </InputSection>
          <div class="d-flex tw:justify-between tw:items-center">
            <v-btn
              v-if="!props.originPos || hasInvoicesWithContificoError"
              variant="elevated"
              color="info"
              class="mt-2"
              @click="sendInvoices"
            >
              <Icon class="mr-2" icon="meteor-icons:paper-plane" />
              Enviar a Contifico
            </v-btn>
            <div v-if="!props.originPos" class="text-h3">$ {{ props.payment?.remainingBalance }} Restante</div>
            <v-btn type="submit" color="primary" class="mt-2" :loading="savePaymentRecordMutations.isPending.value">Guardar</v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-card-text v-if="!originPos">
        <v-data-table-server
          :headers="headers"
          :items="paginatedHistory"
          :loading="isRefetching || sendInvoicesToContificoMutation.isPending.value || savePaymentRecordMutations.isPending.value"
          :items-length="total"
          :items-per-page="itemsPerPage"
          class="mt-4"
          @update:options="onUpdateOptions"
        >
          <template #item.date="{ item }">
            <span>{{ formatDate(item.invoiceDate) }}</span>
          </template>
          <template #item.amount="{ item }">
            <span>$ {{ item.amount.toFixed(2) }}</span>
          </template>
          <template #item.sentContifico="{ item }">
            <div v-if="item.sentContifico">
              <v-icon class="ml-2" color="success">
                <Icon icon="material-symbols:check-circle-outline" />
              </v-icon>
            </div>
            <div v-else>
              <v-tooltip location="top" :text="item.contificoError">
                <template #activator="{ props: activatorProps }">
                  <v-icon class="ml-2" color="error" v-bind="activatorProps">
                    <Icon icon="weui:close2-outlined" />
                  </v-icon>
                </template>
              </v-tooltip>
            </div>
          </template>
          <template #item.actions="{ item }">
            <div>
              <div class="d-flex tw:gap-x-2">
                <div v-if="!item.sentContifico">
                  <v-btn color="success" variant="tonal" @click="handleShowEdit(item)">
                    <Icon icon="tabler:pencil" class="mr-2" />
                  </v-btn>
                </div>
                <v-btn color="info" variant="tonal" @click="handleShowDetails(item)">
                  <Icon icon="mdi:eye" class="mr-2" />
                </v-btn>
                <InvoiceDetail
                  v-if="showDetails"
                  :invoice="selectedInvoice"
                  :showDialog="true"
                  @cancel="showDetails = false"
                  :campus="props.payment!!.campus"
                  :remainingBalance="props.payment?.remainingBalance || 0"
                />

                <EditInvoice
                  v-if="showEdit"
                  :invoice="selectedInvoice"
                  :showDialog="true"
                  @cancel="showEdit = false"
                  :campus="props.payment!!.campus"
                />
              </div>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
