<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import moment from 'moment';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';

import { VDateInput } from 'vuetify/labs/VDateInput';
import InputSection from '../forms/InputSection.vue';

import type { Payment, PaymentHistoryRequest, PaymentMethod } from '@/models/Payments';
import usePayment from '@/composables/admin/payments/usePayment';
import usePaymentMethods from '@/composables/admin/paymentMethods/usePaymentMethods';
import usePaymentRecordMutations from '@/composables/admin/payments/usePaymentMutations';
import { adminStore } from '@/stores/adminStore';

const props = defineProps<{
  modelValue: boolean;
  originPos?: boolean;
  payment?: Payment;
}>();

const emit = defineEmits(['update:modelValue', 'payment-updated', 'update:payment-posOrigin']);

const formRef = ref();
const loading = ref(false);
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const form = ref({
  date: new Date(),
  amount: '',
  paymentMethod: {} as PaymentMethod,
  transactionId: '',
  pingType: 'D'
});

const paymentId = computed(() => props.payment?.id!!);
const { payment, refetchPayment } = usePayment(paymentId);
const { paymentMethodsData } = usePaymentMethods();
const { savePaymentRecordMutations } = usePaymentRecordMutations();

const paymentMethodsList = computed(() => paymentMethodsData.value);
const itemsPerPage = 5;
const page = ref(1);

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

const total = computed(() => props.payment?.paymentshistory.length ?? 0);
const paginatedHistory = computed(() => {
  const history = [...(props.payment?.paymentshistory ?? [])].reverse();
  const start = (page.value - 1) * itemsPerPage;
  return history.slice(start, start + itemsPerPage);
});

const close = () => (visible.value = false);

const onPaymentMethodSelected = (id: string) => {
  const selected = paymentMethodsList.value.find((m) => m.id === id);
  form.value.paymentMethod = selected ?? ({} as PaymentMethod);
};

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  if (!adminStore().isCashDrawerOpen) {
    toast.error('Debe abrir una caja para añadir el pago');
    return;
  }

  const paymentHistoryReq: PaymentHistoryRequest = {
    paymentId: paymentId.value!,
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
      await refetchPayment();
      emit('payment-updated', JSON.parse(JSON.stringify(payment.value)));
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al registrar el pago');
    }
  });
};

const headers = [
  { title: 'Fecha', value: 'date' },
  { title: 'Monto', value: 'amount' },
  { title: 'Método de pago', value: 'paymentMethod' }
];

const onUpdateOptions = (options: any) => {
  page.value = options.page;
};
</script>

<template>
  <v-dialog v-model="visible" max-width="800">
    <v-card>
      <v-toolbar color="primary" title="Historial de pagos">
        <v-spacer />
        <v-btn icon variant="text" size="small" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors" @click="close">
          <Icon icon="mdi:close" height="18" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submitForm">
          <InputSection label="Registrar nuevo pago">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  label="Método de pago"
                  variant="outlined"
                  :items="paymentMethodsList"
                  item-value="id"
                  item-title="type"
                  :rules="[(v) => !!v || 'Campo requerido']"
                  @update:modelValue="onPaymentMethodSelected"
                />
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
          <v-btn type="submit" color="primary" class="mt-2">Guardar</v-btn>
        </v-form>
      </v-card-text>

      <v-card-text v-if="!originPos">
        <v-data-table-server
          :headers="headers"
          :items="paginatedHistory"
          :loading="loading"
          :items-length="total"
          :items-per-page="itemsPerPage"
          class="mt-4"
          @update:options="onUpdateOptions"
        >
          <template #item.date="{ item }">
            <span>{{ item.date }}</span>
          </template>
          <template #item.amount="{ item }">
            <span>${{ item.amount }}</span>
          </template>
          <template #item.paymentMethod="{ item }">
            <span>{{ item.paymentMethod.type }}</span>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
