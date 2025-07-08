<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import type { CashBox } from '@/models/CashDrawer';

interface FormData {
  number: string;
  firstNumberInvoice: string;
  store: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false
  }
);

const emit = defineEmits<{
  (e: 'save', cashBox: Partial<CashBox>): void;
  (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const createDefaultFormData = (): FormData => ({
  number: '',
  firstNumberInvoice: '',
  store: ''
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
  number: { required, numeric },
  firstNumberInvoice: { required, numeric },
  store: { required, numeric }
};

const v$ = useVuelidate(rules, formData);

const resetForm = () => {
  formData.value = createDefaultFormData();
  if (form.value) {
    form.value.reset();
  }
  v$.value.$reset();
};

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  }
);

const closeDialog = () => {
  isOpen.value = false;
  emit('cancel');
};

const saveCashBox = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const cashBoxData = {
    ...formData.value,
    firstNumberInvoice: parseInt(formData.value.firstNumberInvoice)
  };

  emit('save', cashBoxData);
  resetForm();
};

defineExpose({
  resetForm
});
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card>
      <v-toolbar color="primary" class="text-white">
        <Icon icon="mdi:cash-register" class="ma-3" height="25" />
        <span> Crear caja </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <Icon icon="mdi:close" />
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.number"
                label="Numero de caja"
                type="number"
                :error-messages="v$.number.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.number.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.firstNumberInvoice"
                label="Numero de factura"
                type="number"
                :error-messages="v$.firstNumberInvoice.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.firstNumberInvoice.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="formData.store"
                label="Punto de venta Contifico"
                type="number"
                :error-messages="v$.store.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.store.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="elevated" :loading="isLoading" @click="saveCashBox"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
