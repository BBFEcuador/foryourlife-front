<script setup lang="ts">
import GeneralPayment from '@/components/payments/GeneralPayment.vue';
import PaymentPreview from '@/components/payments/PaymentPreview.vue';
import CashDrawerInfo from '@/components/cashDrawer/CashDrawerInfo.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePaymentMutations from '@/composables/admin/payments/usePaymentsMutations';
import type { AxiosError } from 'axios';
import { ref, computed, watch } from 'vue';
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
import useCashDrawerOpenedByUser from '@/composables/admin/pos/useCashDrawerOpenedByUser';
import useCashDrawerById from '@/composables/admin/pos/useCashDrawerById';

// --- State ---
const paymentNumber = ref('PAY-000001');
const selectedProduct = ref(null);
const selectedParticipant = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref(null);
const trainingId = ref('');
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
const editingIndex = ref<number | null>(null);
const editingPayment = ref<PaymentHistory | null>(null);
const isLoading = ref(false);
const showSuccessModal = ref(false);
const redirectCountdown = ref(3);
const maxCountdown = 3;
const selectPaymentIdPdf = ref('');

// --- Store & API ---
const store = adminStore();
const userIdref = ref(store.user.user.id);
const { cashDrawer, refetchCashDrawerOpenedByUser, isCashDrawerOpenedByUserLoading } = useCashDrawerOpenedByUser(userIdref.value);

const campusId = computed(() => {
  if (!cashDrawer?.value?.cashBox?.store?.campus?.id) return '';
  return cashDrawer.value.cashBox.store.campus.id;
});
const { contificoConfig, isContificoConfigError, isContificoConfigLoading } = useContificoConfigByCampus(campusId.value);
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

const isPaymentDisabled = computed(
  () => isLoading.value || !selectedProduct.value || !selectedParticipant.value || !trainingId.value || v$.value.$invalid
);

const totalPaid = computed(() => {
  return paymentHistoryArr.value.reduce((acc, item) => acc + Number(item.amount), 0);
});

const remainingBalance = computed(() => {
  return Math.max(0, grandTotal.value - totalPaid.value);
});

const changeAmount = computed(() => {
  return Math.max(0, totalPaid.value - grandTotal.value);
});

const paymentStatusColor = computed(() => {
  if (totalPaid.value === 0) return 'grey';
  if (totalPaid.value < grandTotal.value) return 'warning';
  if (totalPaid.value >= grandTotal.value) return 'success';
  return 'primary';
});

// --- Methods ---
function resetAllFields() {
  paymentNumber.value = 'PAY-000001';
  selectedProduct.value = null;
  selectedParticipant.value = null;
  selectedDiscount.value = null;
  selectedCampus.value = null;
  trainingId.value = '';
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
  if (!trainingId.value) {
    toast.error('Seleccione un entrenamiento');
    isLoading.value = false;
    return;
  }

  const paymentData = {
    products: [(selectedProduct.value as any).id],
    participant: (selectedParticipant.value as any).id,
    campus: (selectedCampus.value as any).id,
    total: grandTotal.value,
    totalDiscount: discountAmount.value,
    trainingId: trainingId.value,
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

  if (editingIndex.value !== null) {
    paymentHistoryArr.value[editingIndex.value] = paymentHistory;
    editingIndex.value = null;
    editingPayment.value = null;
  } else {
    paymentHistoryArr.value.push(paymentHistory);
  }
};

const removePayment = (index: number) => {
  paymentHistoryArr.value.splice(index, 1);
  if (editingIndex.value === index) {
    editingIndex.value = null;
    editingPayment.value = null;
  }
};

const editPayment = (index: number) => {
  editingIndex.value = index;
  editingPayment.value = paymentHistoryArr.value[index];
  showPaymentHistoryModal.value = true;
};

const openAddPaymentModal = () => {
  editingIndex.value = null;
  editingPayment.value = null;
  showPaymentHistoryModal.value = true;
};

defineExpose({ showSuccessModal, redirectCountdown });

watch(
  [cashDrawer, isCashDrawerOpenedByUserLoading],
  ([drawer, loading]) => {
    if (!loading && !drawer) {
      router.push({ name: 'pos-main' });
    }
  },
  { immediate: true }
);
</script>

<template>
  <BaseBreadcrumb
    :title="'Crear Nuevo Cobro'"
    :breadcrumbs="[
      { title: 'Pagos', disabled: false, href: '/admin/payments' },
      { title: 'Nuevo Pago', disabled: true, href: '#' }
    ]"
  />

  <div v-if="cashDrawer && !isCashDrawerOpenedByUserLoading" class="mb-6">
    <CashDrawerInfo :cash-drawer="cashDrawer" @update-refetch="refetchCashDrawerOpenedByUser" />
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

  <div v-if="cashDrawer?.status && cashDrawer.status === 'LOCKED'">
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
              :campus-id="campusId"
              @update:selected-participant="selectedParticipant = $event"
              @update:selected-product="selectedProduct = $event"
              @update:training-id="trainingId = $event"
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

        <v-card class="mt-4 payment-card h-full" variant="outlined" style="border-color: #e2e8f0">
          <v-card-title class="d-flex justify-space-between align-center py-3 bg-grey-lighten-5">
            <div class="d-flex align-center">
              <Icon icon="solar:wallet-money-bold-duotone" class="mr-2 text-primary" height="24" />
              <span class="text-h6 font-weight-bold">Pagos y Cobro</span>
            </div>
            <v-chip :color="paymentStatusColor" variant="flat" size="small" class="font-weight-bold text-uppercase">
              {{ totalPaid >= grandTotal && grandTotal > 0 ? 'COMPLETADO' : 'PENDIENTE' }}
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- Summary Stats -->
            <v-row class="mb-6">
              <v-col cols="4" class="text-center border-e">
                <div class="text-caption text-grey text-uppercase font-weight-bold mb-1">Total a Pagar</div>
                <div class="text-h5 font-weight-bold text-high-emphasis">${{ grandTotal.toFixed(2) }}</div>
              </v-col>
              <v-col cols="4" class="text-center border-e">
                <div class="text-caption text-grey text-uppercase font-weight-bold mb-1">Total Pagado</div>
                <div class="text-h5 font-weight-bold text-success">${{ totalPaid.toFixed(2) }}</div>
              </v-col>
              <v-col cols="4" class="text-center">
                <div class="text-caption text-grey text-uppercase font-weight-bold mb-1">
                  {{ changeAmount > 0 ? 'Cambio' : 'Restante' }}
                </div>
                <div class="text-h5 font-weight-bold" :class="changeAmount > 0 ? 'text-info' : 'text-error'">
                  ${{ changeAmount > 0 ? changeAmount.toFixed(2) : remainingBalance.toFixed(2) }}
                </div>
              </v-col>
            </v-row>

            <!-- Progress Bar -->
            <div class="mb-6">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span>Progreso de pago</span>
                <span>{{ Math.min((totalPaid / (grandTotal || 1)) * 100, 100).toFixed(0) }}%</span>
              </div>
              <v-progress-linear
                :model-value="(totalPaid / (grandTotal || 1)) * 100"
                :color="paymentStatusColor"
                height="10"
                rounded
                striped
              ></v-progress-linear>
            </div>

            <!-- Action Buttons -->
            <v-row dense class="mb-6">
              <v-col cols="12" :md="remainingBalance > 0 ? 6 : 12">
                <v-btn
                  block
                  variant="outlined"
                  color="primary"
                  class="border-dashed py-6"
                  style="border-width: 2px"
                  height="auto"
                  @click="openAddPaymentModal"
                  :disabled="totalPaid >= grandTotal && grandTotal > 0"
                >
                  <div class="d-flex flex-column align-center py-2">
                    <Icon icon="mdi:plus-circle-outline" class="mb-1" height="24" />
                    <span class="font-weight-bold">Agregar Pago</span>
                  </div>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" v-if="remainingBalance > 0">
                <v-btn
                  block
                  variant="tonal"
                  color="success"
                  class="py-6"
                  height="auto"
                  @click="openAddPaymentModal"
                  v-tooltip="'Pagar el monto restante exacto'"
                >
                  <div class="d-flex flex-column align-center py-2">
                    <Icon icon="solar:check-read-linear" class="mb-1" height="24" />
                    <span class="font-weight-bold">Saldar Restante (${{ remainingBalance.toFixed(2) }})</span>
                  </div>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Payment List -->
            <div v-if="paymentHistoryArr.length > 0" class="payment-list rounded-lg border pa-0 overflow-hidden mb-4">
              <div class="bg-grey-lighten-4 px-4 py-2 text-caption font-weight-bold text-uppercase text-grey">Desglose de pagos</div>
              <v-list density="compact" class="pa-0">
                <template v-for="(item, index) in paymentHistoryArr" :key="index">
                  <v-list-item class="px-4 py-2" @click="editPayment(index)" style="cursor: pointer" v-tooltip="'Clic para editar'">
                    <template v-slot:prepend>
                      <v-avatar color="primary" variant="tonal" size="36" class="mr-3 rounded-lg">
                        <Icon icon="solar:card-transfer-bold-duotone" size="20" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">{{ item.paymentMethod.type }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      ID: {{ item.transactionId || 'N/A' }} • {{ new Date().toLocaleDateString() }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <span class="font-weight-bold mr-3 text-body-2">${{ Number(item.amount).toFixed(2) }}</span>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="primary"
                          @click.stop="editPayment(index)"
                          class="mr-1"
                          v-tooltip="'Editar pago'"
                        >
                          <Icon icon="solar:pen-new-square-bold-duotone" size="18" />
                        </v-btn>
                        <v-btn icon size="small" variant="text" color="grey" @click.stop="removePayment(index)" v-tooltip="'Eliminar pago'">
                          <Icon icon="solar:trash-bin-trash-bold" size="18" class="text-error" />
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                  <v-divider v-if="index < paymentHistoryArr.length - 1"></v-divider>
                </template>
              </v-list>
            </div>

            <div v-else class="d-flex flex-column align-center py-8 rounded-lg border border-dashed mb-4">
              <Icon icon="solar:bill-list-linear" height="48" class="mb-2 text-grey-lighten-1" />
              <div class="text-body-2 text-grey">No se han registrado pagos aún</div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4 bg-grey-lighten-5">
            <v-btn
              block
              size="x-large"
              color="primary"
              variant="elevated"
              :loading="isLoading"
              :disabled="isPaymentDisabled || totalPaid > grandTotal"
              @click="processPayment"
              class="font-weight-bold text-none rounded-lg"
              elevation="2"
            >
              Procesar Cobro Final
              <Icon icon="solar:check-circle-bold" class="ml-2" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <PaymentHistoryList
      :model-value="showPaymentHistoryModal"
      :origin-pos="true"
      :default-amount="remainingBalance"
      :edit-data="editingPayment"
      :campus-id="campusId"
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
