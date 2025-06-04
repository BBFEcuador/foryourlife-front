<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed } from 'vue';
import type { Payment } from '@/models/Payments';
import { usePaymentMethods, usePayment } from '@/composables/admin/payments/usePayments';
import { usePaymentRecordMutations } from '@/composables/admin/payments/usePaymentsMutations';
import { VDateInput } from 'vuetify/labs/VDateInput';
import InputSection from '../forms/InputSection.vue';
import type { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import moment from 'moment';

const props = defineProps<{
  modelValue: boolean;
  payment: Payment;
}>();

const emit = defineEmits(['update:modelValue', 'payment-updated']);

const loading = ref(false);
const formRef = ref();
const form = ref({
  date: new Date(),
  amount: '',
  paymentMethod: '',
  paymentMethodId: ''
});

const paymentId = computed(() => props.payment.id);
const { payment, isPaymentError, isPaymentLoading, refetchPayment } = usePayment(paymentId);

const { paymentMethodsData } = usePaymentMethods();
const { savePaymentRecordMutations } = usePaymentRecordMutations();

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  savePaymentRecordMutations.mutate(
    { ...form.value, date: moment(form.value.date).format('DD/MM/YYYY'), paymentId: props.payment.id },
    {
      onError: (error) => {
        const val = error as AxiosError<{ message: string }>;
        val.response?.data?.message ? toast.error(val.response.data.message) : toast.error(error);
      },
      onSuccess: async () => {
        toast.success('Pago registrado exitosamente');
        await refetchPayment();
        emit('payment-updated', JSON.parse(JSON.stringify(payment.value)));
      }
    }
  );
};

const close = () => (visible.value = false);

const headers = [
  { title: 'Fecha', value: 'date' },
  { title: 'Monto', value: 'amount' },
  { title: 'Método de pago', value: 'paymentMethod' },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const paymentMethodsList = computed(() => {
  return paymentMethodsData.value;
});

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const onPaymentMethodSelected = (id: string) => {
  form.value.paymentMethodId = id;
  form.value.paymentMethod = paymentMethodsList.value.find((m) => m.id === id)?.type || '';
};

const itemsPerPage = 5;
const page = ref(1);

const total = computed(() => props.payment.paymentshistory.length);

const paginatedHistory = computed(() => {
  const sorted = [...props.payment.paymentshistory].reverse(); // más recientes primero
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sorted.slice(start, end);
});

// Función para manejar el evento que emite la tabla con la página seleccionada
const onUpdateOptions = (options: any) => {
  page.value = options.page;
};
</script>
<template>
  <v-dialog v-model="visible" max-width="800">
    <v-card>
      <v-toolbar color="primary" :title="'Historial de pagos'">
        <VBtn icon variant="text" size="small" @click="close" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
          <Icon icon="mdi:close" height="18" />
        </VBtn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submitForm">
          <InputSection label="Registrar nuevo pago">
            <v-row>
              <v-col cols="12" sm="4">
                <VDateInput placeholder="" v-model="form.date" variant="outlined" :rules="[(v) => !!v || 'Campo requerido']" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field label="Monto" v-model="form.amount" type="number" :rules="[(v) => !!v || 'Campo requerido']" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  label="Método de pago"
                  :items="paymentMethodsList"
                  item-value="id"
                  item-title="type"
                  :model-value="form.paymentMethodId"
                  @update:modelValue="onPaymentMethodSelected"
                  :rules="[(v) => !!v || 'Campo requerido']"
                />
              </v-col>
            </v-row>
          </InputSection>
          <v-btn type="submit" color="primary" class="mt-2">Guardar</v-btn>
        </v-form>
      </v-card-text>

      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="paginatedHistory"
          :loading="loading"
          :items-length="total"
          :items-per-page="itemsPerPage"
          @update:options="onUpdateOptions"
        >
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn
                icon
                color="info"
                variant="text"
                size="32"
                class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                v-tooltip="'Ver lista de pagos'"
                @click=""
              >
                <Icon icon="mdi:list-box-outline" />
              </v-btn>
              <v-btn
                color="error"
                icon
                variant="text"
                size="32"
                v-tooltip="'Cerrar Cobro'"
                class="tw:bg-red-300 hover:!tw:bg-red-100"
                @click=""
              >
                <Icon icon="mdi-power" height="18" />
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
