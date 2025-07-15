<script setup lang="ts">
import useCampus from '@/composables/admin/useCampus';
import type { BankAccount, BankAccountRequest } from '@/models/Payments';
import { adminStore } from '@/stores/adminStore';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

interface FormData {
  name: string;
  number: string;
  campusId: string;
}

const store = adminStore();
const { campus } = useCampus();

const props = defineProps<{
  bankAccount: BankAccount;
  modelValue: boolean;
}>();

const bankAccount = computed(() => props.bankAccount);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', paymentMethod: BankAccountRequest): void;
  (e: 'cancel'): void;
}>();

const createDefaultFormData = (): FormData => ({
  name: bankAccount.value.name,
  number: bankAccount.value.number,
  campusId: bankAccount.value.campus.id
});

const formData = ref<FormData>(createDefaultFormData());
const form = ref<HTMLFormElement | null>(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  }
);

const rules = {
  name: { required },
  number: { required },
  campusId: { required }
};

const v$ = useVuelidate(rules, formData);

const resetForm = () => {
  formData.value = createDefaultFormData();
  if (form.value) {
    form.value.reset();
  }
  v$.value.$reset();
};

const saveBankAccount = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const paymentMethodData: BankAccountRequest = {
    ...formData.value,
    id: bankAccount.value.id
  };

  emit('save', paymentMethodData);
  resetForm();
};

const closeDialog = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('cancel');
};
</script>
<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card>
      <v-toolbar color="primary" class="text-white" :title="'Nueva Cuenta Bancaria'">
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <Icon icon="mdi:close" />
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="formData.name"
                label="Nombre de la cuenta"
                :error-messages="v$.name.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.name.$touch"
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
              <v-text-field
                v-model="formData.number"
                label="Numero de Cuenta"
                :error-messages="v$.number.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.number.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="elevated" :loading="false" @click="saveBankAccount"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
