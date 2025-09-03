<script setup lang="ts">
import GeneralPayment from '@/components/payments/GeneralPayment.vue';
import PaymentPreview from '@/components/payments/PaymentPreview.vue';
import CashDrawerInfo from '@/components/cashDrawer/CashDrawerInfo.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePaymentMutations from '@/composables/admin/payments/usePaymentsMutations';
import type { AxiosError } from 'axios';
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { toast } from 'vue3-toastify';
import { adminStore } from '@/stores/adminStore';
import PaymentHistoryList from '@/components/payments/PaymentHistoryList.vue';
import type { PaymentHistory, PaymentHistoryRequest } from '@/models/Payments';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import usePaymentPdf from '@/composables/admin/payments/usePaymentPdf';
import useContificoConfigByCampus from '@/composables/admin/contifico/useContificoConfig';
import { router } from '@/router';
import { helpers, numeric, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import useCashDrawerById from '@/composables/admin/pos/useCashDrawerById';

// --- State ---
const paymentNumber = ref('PAY-000001');
const selectedProduct = ref(null);
const selectedParticipant = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref(null);
const notes = ref('');
const fullname = ref('');
const address = ref('');
const document = ref('');
const phone = ref('');
const email = ref('');
const type = ref('N');
const generalPaymentRef = ref();
const paymentHistoryArr = ref<PaymentHistory[]>([]);
const showPaymentHistoryModal = ref(false);
const isLoading = ref(false);
const showSuccessModal = ref(false);
const redirectCountdown = ref(3);
const maxCountdown = 3;
const selectPaymentIdPdf = ref('');

// --- Store & API ---
const store = adminStore();
const { cashDrawer, isCashDrawerLoading, refetchCashDrawer } = useCashDrawerById(store.cashDrawer.id);
const { contificoConfig, isContificoConfigError, isContificoConfigLoading } = useContificoConfigByCampus(
  store.cashDrawer.cashBox.store.campus.id
);
const { savePaymentMutations } = usePaymentMutations();
const { pdfArray, refetchPaymentPdf } = usePaymentPdf(selectPaymentIdPdf);

// --- Validation ---
const onlyDigits = helpers.withMessage('Solo se permiten números', (v: string) => v === '' || /^\d+$/.test(v));
const len10or13 = helpers.withMessage('La cédula/RUC debe tener 10 o 13 dígitos', (v: string) => v.length === 10 || v.length === 13);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules = {
  fullname: { required: helpers.withMessage('El nombre completo es obligatorio', required) },
  document: {
    required: helpers.withMessage('El documento es obligatorio', required),
    onlyDigits,
    len10or13,
    ruc: helpers.withMessage('El ruc debe acabar en 001', (v: string) => (v.length === 13 ? v.endsWith('001') : true))
  },
  phone: {
    required: helpers.withMessage('El teléfono es obligatorio', required),
    onlyDigits,
    numeric,
    len10: helpers.withMessage('El teléfono debe tener 10', (v: string) => v.length === 10)
  },
  email: {
    required: helpers.withMessage('El email es obligatorio', required),
    email: helpers.withMessage('El email no es válido', (v: string) => v === '' || emailRegex.test(v))
  },
  address: { required: helpers.withMessage('La dirección es obligatoria', required) }
};
const v$ = useVuelidate(rules, { fullname, document, phone, email, address });

// --- Computed ---
const billedBy = computed(() => ({
  name: contificoConfig.value.razonSocial,
  ruc: contificoConfig.value.ruc,
  address: contificoConfig.value.address,
  phone: contificoConfig.value.phone
}));

const billedTo = computed(() => ({
  name: fullname.value || 'Nombre no especificado',
  address: address.value || 'Dirección no especificada',
  document: document.value || 'Documento no especificado',
  phone: phone.value || 'Teléfono no especificado',
  email: email.value || 'Email no especificado'
}));

const dateIssued = new Date();
const dueDate = computed(() => {
  const date = new Date(dateIssued);
  date.setDate(date.getDate() + 14);
  return date;
});

const invoiceItems = computed(() => {
  if (!selectedProduct.value) return [];
  const product = selectedProduct.value as any;
  return [
    {
      name: product.name || 'Producto sin nombre',
      quantity: 1,
      unitPrice: product.basePrice || 0
    }
  ];
});

const discountAmount = computed(() => {
  if (!selectedDiscount.value || !selectedProduct.value) return 0;
  const discount = selectedDiscount.value as any;
  const product = selectedProduct.value as any;
  const price = product.basePrice || 0;
  if (discount.discountType === 'P') {
    return parseFloat(((price * parseFloat(discount.discountValue)) / 100).toFixed(2));
  } else if (discount.discountType === 'E') {
    return parseFloat(parseFloat(discount.discountValue).toFixed(2));
  }
  return 0;
});

const grandTotal = computed(() => {
  if (!selectedProduct.value) return 0;
  const product = selectedProduct.value as any;
  const price = product.basePrice || 0;
  return parseFloat((price - discountAmount.value).toFixed(2));
});

const progressValue = computed(() => ((maxCountdown - redirectCountdown.value) / maxCountdown) * 100);

const isPaymentDisabled = computed(() => isLoading.value || !selectedProduct.value || !selectedParticipant.value || v$.value.$invalid);

// --- Methods ---
function resetAllFields() {
  paymentNumber.value = 'PAY-000001';
  selectedProduct.value = null;
  selectedParticipant.value = null;
  selectedDiscount.value = null;
  selectedCampus.value = null;
  notes.value = '';
  fullname.value = '';
  address.value = '';
  document.value = '';
  phone.value = '';
  email.value = '';
  paymentHistoryArr.value = [];
  generalPaymentRef.value?.resetTextFields();
  v$.value.$reset();
}

const processPayment = async () => {
  isLoading.value = true;
  await v$.value.$validate();
  if (v$.value.$error) {
    isLoading.value = false;
    return;
  }

  const paymentData = {
    products: [(selectedProduct.value as any).id],
    participant: (selectedParticipant.value as any).id,
    campus: (selectedCampus.value as any).id,
    total: grandTotal.value,
    totalDiscount: discountAmount.value,
    invoice: {
      type: type.value,
      fullName: fullname.value,
      address: address.value,
      document: document.value,
      phone: phone.value,
      email: email.value
    },
    cashDrawerId: cashDrawer.value.id,
    paymentsHistory: paymentHistoryArr.value,
    note: notes.value
  };

  await savePaymentMutations.mutateAsync(paymentData, {
    onSuccess: async (data) => {
      store.cashDrawer.actualBalance += paymentHistoryArr.value.reduce((sum, row) => sum + parseFloat(row.amount), 0);
      resetAllFields();
      selectPaymentIdPdf.value = data;
      await refetchPaymentPdf();
      if (pdfArray.value) {
        const blob = new Blob([new Uint8Array(pdfArray.value)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
      showSuccessModal.value = true;
      redirectCountdown.value = maxCountdown;
      const interval = setInterval(() => {
        if (redirectCountdown.value > 0) {
          redirectCountdown.value -= 1;
        } else {
          clearInterval(interval);
          showSuccessModal.value = false;
        }
      }, 1000);
    },
    onError(error) {
      const err = error as AxiosError<ErrorApiResponse>;
      let message = err.response?.data?.message || '';
      err.response?.data?.errors?.forEach((e) => (message += `\n ${e}`));
      toast.error(message || 'Error al procesar el cobro');
      isLoading.value = false;
    }
  });
  isLoading.value = false;
};

const closePaymentHistoryModal = (val: boolean) => {
  showPaymentHistoryModal.value = val;
};

const addPaymentHistoryRow = (paymentHistoryRow: PaymentHistoryRequest) => {
  const paymentHistory: PaymentHistory = {
    date: paymentHistoryRow.paymentHistory.date,
    amount: paymentHistoryRow.paymentHistory.amount,
    paymentMethod: paymentHistoryRow.paymentHistory.paymentMethod,
    transactionId: paymentHistoryRow.paymentHistory.transactionId,
    pingType: paymentHistoryRow.paymentHistory.pingType
  };
  paymentHistoryArr.value.push(paymentHistory);
};

const clearPaymentHistory = () => {
  paymentHistoryArr.value = [];
};

defineExpose({ showSuccessModal, redirectCountdown });
</script>

<template>
  <BaseBreadcrumb
    :title="'Crear Nuevo Cobro'"
    :breadcrumbs="[
      { title: 'Pagos', disabled: false, href: '/admin/payments' },
      { title: 'Nuevo Pago', disabled: true, href: '#' }
    ]"
  />

  <div v-if="cashDrawer && !isCashDrawerLoading" class="mb-6">
    <CashDrawerInfo :cash-drawer="cashDrawer" @update-refetch="refetchCashDrawer" />
  </div>

  <v-dialog v-model="showSuccessModal" width="400">
    <v-card class="mb-4 payment-card">
      <v-card-title class="py-2 tw:text-center">
        <h3 class="tw:font-medium">Pago creado exitosamente</h3>
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="showSuccessModal = false">Cerrar</v-btn>
      </v-card-actions>
      <v-progress-linear color="success" height="5" :model-value="progressValue" />
    </v-card>
  </v-dialog>

  <div v-if="cashDrawer.status === 'LOCKED'">
    <v-alert
      type="warning"
      variant="tonal"
      class="mb-4 d-flex justify-center"
      title="Caja bloqueada"
      text="Desbloquea la caja para realizar nuevas transacciones."
    />
  </div>

  <div v-else class="tw:flex tw:flex-col">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="payment-card h-full" :disabled="isContificoConfigError">
          <v-card-title class="py-2">
            <h3 class="tw:font-medium">Detalle de pago</h3>
          </v-card-title>
          <v-card-text class="px-4">
            <GeneralPayment
              ref="generalPaymentRef"
              :v$="v$"
              @update:selected-participant="selectedParticipant = $event"
              @update:selected-product="selectedProduct = $event"
              @update:notes="notes = $event"
              @update:fullname="fullname = $event"
              @update:address="address = $event"
              @update:document="document = $event"
              @update:phone="phone = $event"
              @update:email="email = $event"
              @update:selected-discount="selectedDiscount = $event"
              @update:selected-campus="selectedCampus = $event"
              @update:type="type = $event"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-alert
          v-if="isContificoConfigError"
          class="mb-4 d-flex justify-center"
          variant="tonal"
          type="error"
          title="Datos de facturación no configurados"
        >
          <template v-slot:prepend> <Icon icon="mdi-alert-outline" height="40" /> </template>
          Porfavor complete la <span class="tw:underline tw:cursor-pointer" @click="router.push({ name: 'settings' })">Configuración </span>
        </v-alert>

        <v-card v-else-if="!isContificoConfigLoading" class="mb-4 h-full">
          <v-card-title class="py-4">
            <h3 class="tw:font-medium">Vista Previa</h3>
          </v-card-title>
          <v-card-text>
            <PaymentPreview
              :payment-number="paymentNumber"
              :billed-by="billedBy"
              :billed-to="billedTo"
              :date-issued="dateIssued"
              :due-date="dueDate"
              :items="invoiceItems"
              :discount-amount="discountAmount"
              :notes="notes"
            />
          </v-card-text>
        </v-card>

        <div>
          <v-btn color="success" variant="tonal" @click="showPaymentHistoryModal = true">
            <Icon icon="mdi:plus" class="mr-2" />
            Añadir Pago
          </v-btn>
        </div>

        <v-card v-if="paymentHistoryArr.length > 0" class="mt-4">
          <v-card-title class="d-flex tw:justify-between tw:items-center">
            <h3 class="tw:text-lg tw:font-semibold">Pagos</h3>
            <v-btn color="red" variant="tonal" @click="clearPaymentHistory">
              <Icon icon="mdi:close" class="mr-2" />
              Limpiar pagos
            </v-btn>
          </v-card-title>

          <v-card-text class="pl-4 pb-4">
            <table class="tw:w-full">
              <thead>
                <tr class="tw:border-b tw:border-gray-300">
                  <th class="tw:p-2 tw:text-left">Método de pago</th>
                  <th class="tw:p-2 tw:text-right">Monto pagado</th>
                  <th class="tw:p-2 tw:text-right">Código de Transacción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in paymentHistoryArr" :key="index" class="tw:border-b tw:border-gray-200">
                  <td class="tw:p-2">{{ item.paymentMethod.type }}</td>
                  <td class="tw:p-2 tw:text-right">${{ item.amount }}</td>
                  <td class="tw:p-2 tw:text-right">{{ item.transactionId }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>

        <v-btn :loading="isLoading" :disabled="isPaymentDisabled" color="primary" class="tw:w-full mt-4" @click="processPayment">
          Procesar cobro
        </v-btn>
      </v-col>
    </v-row>

    <PaymentHistoryList
      :model-value="showPaymentHistoryModal"
      :origin-pos="true"
      @update:model-value="closePaymentHistoryModal"
      @update:payment-pos-origin="addPaymentHistoryRow"
    />
  </div>
</template>

<style scoped>
.payment-card {
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.payment-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.section-fade-in {
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
