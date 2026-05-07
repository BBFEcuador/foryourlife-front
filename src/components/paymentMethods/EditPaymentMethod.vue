<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import useSriPaymentMethods from '@/composables/admin/paymentMethods/useSriPaymentMethods';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import type { PaymentMethod, PaymentMethodRequest } from '@/models/Payments';
import useCampus from '@/composables/admin/useCampus';
import useBankAccounts from '@/composables/admin/paymentMethods/useBankAccounts';
import { adminStore } from '@/stores/adminStore';

interface FormData {
  type: string;
  code: string;
  campusId: string;
  bankId: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    paymentMethod: PaymentMethod;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false
  }
);

const paymentMethod = computed(() => props.paymentMethod);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', paymentMethod: Partial<PaymentMethodRequest>): void;
  (e: 'cancel'): void;
}>();

const form = ref<HTMLFormElement | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const store = adminStore();
const transferSelected = ref(props.paymentMethod.code === 'TRA' ? true : false);
const { sriPaymentMethodsData, isSriPaymentMethodsError, isSriPaymentMethodsLoading, refetchSriPaymentMethods } = useSriPaymentMethods();
const { campus, isError, isFetching, refetch } = useCampus();
const { bankAccounts, isBankAccountsLoading, refetchBankAccounts } = useBankAccounts();

const createDefaultFormData = (): FormData => ({
  type: paymentMethod.value.type,
  code: paymentMethod.value.code,
  campusId: paymentMethod.value.campus.id,
  bankId: paymentMethod.value.bank?.id!!
});

const formData = ref<FormData>(createDefaultFormData());

const rules = computed(() => ({
  type: { required },
  code: { required },
  campusId: { required },
  bankId: {
    required: helpers.withMessage(
      'Campo requerido',
      requiredIf(() => transferSelected.value)
    )
  }
}));

const v$ = useVuelidate(rules, formData);

const resetForm = () => {
  formData.value = createDefaultFormData();
  if (form.value) {
    form.value.reset();
  }
  v$.value.$reset();
};

const closeDialog = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('cancel');
};

const savePaymentMethod = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const paymentMethodData: Partial<PaymentMethodRequest> = {
    ...formData.value,
    isActive: true,
    id: props.paymentMethod.id
  };

  emit('save', paymentMethodData);
};

defineExpose({
  focus,
  resetForm
});

const handleTransferSelected = (id: string) => {
  if (id === 'TRA') {
    transferSelected.value = true;
  } else {
    transferSelected.value = false;
    formData.value.bankId = '';
  }
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card>
      <v-toolbar color="primary" class="text-white" :title="'Editar Método de Pago'">
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <Icon icon="mdi:close" />
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-4">
        <v-form ref="form" @submit.prevent="savePaymentMethod">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="formData.type"
                label="Nombre del método"
                :error-messages="v$.type.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.type.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="formData.campusId"
                label="Campus"
                :items="campus"
                :disabled="store.isCampusSelected"
                item-title="city"
                item-value="id"
                :error-messages="v$.campusId.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.campusId.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="formData.code"
                label="Tipo de pago SRI"
                :items="sriPaymentMethodsData"
                item-title="method"
                item-value="code"
                :error-messages="v$.code.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.code.$touch"
                variant="outlined"
                density="comfortable"
                @update:model-value="handleTransferSelected"
                required
              ></v-select>
            </v-col>
            <v-col v-if="transferSelected" cols="12">
              <v-select
                v-model="formData.bankId"
                label="Cuenta Bancaria"
                :items="bankAccounts"
                :item-title="(item) => `${item?.name ?? ''} - ${item?.number ?? ''}`"
                item-value="id"
                :error-messages="v$.bankId.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.bankId.$touch"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="elevated" :loading="isLoading" @click="savePaymentMethod"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
