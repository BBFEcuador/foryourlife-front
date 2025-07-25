<script setup lang="ts">
import type { EditInvoiceReq, Invoice } from '@/models/Invoice';
import UiParentCard from '../shared/UiParentCard.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

interface FormData {
  fullName: string;
  address: string;
  document: string;
  phone: string;
  email: string;
}

const props = defineProps<{
  invoice: Invoice;
  showDialog: boolean;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', invoice: EditInvoiceReq): void;
}>();

const createDefaultFormData = (): FormData => ({
  fullName: props.invoice.fullName || '',
  address: props.invoice.address || '',
  document: props.invoice.document || '',
  phone: props.invoice.phone || '',
  email: props.invoice.email || ''
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
  fullName: { required },
  address: { required },
  document: { required },
  phone: { required },
  email: { required }
};

const v$ = useVuelidate(rules, formData);

const handleSaveInvoice = async () => {
  if (!(await v$.value.$validate())) return;

  const invoiceData: EditInvoiceReq = {
    id: props.invoice.id,
    fullName: formData.value.fullName,
    address: formData.value.address,
    document: formData.value.document,
    phone: formData.value.phone,
    email: formData.value.email
  };

  emit('save', invoiceData);
};
</script>
<template>
  <v-dialog v-model="props.showDialog" max-width="600">
    <UiParentCard title="Actualizar Factura">
      <template #action>
        <v-btn elevation="0" variant="plain" icon @click="emit('cancel')" class="tw:rounded-md"> <Icon icon="mdi:close" /> </v-btn>
      </template>
      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Nombre Completo</h3>
          <v-text-field
            v-model="formData.fullName"
            variant="outlined"
            placeholder="Jhon Frederick Doe Marshall"
            :error-messages="v$.fullName.$errors.map((e: any) => e.$message.toString())"
            @blur="v$.fullName.$touch"
          ></v-text-field>
        </div>
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Dirección</h3>
          <v-text-field
            v-model="formData.address"
            variant="outlined"
            placeholder="Av. Principal 123, Quito"
            :error-messages="v$.address.$errors.map((e: any) => e.$message.toString())"
            @blur="v$.address.$touch"
          ></v-text-field>
        </div>
      </div>

      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Cédula/Pasaporte o Ruc</h3>
          <v-text-field
            v-model="formData.document"
            variant="outlined"
            placeholder="17999999990"
            :error-messages="v$.document.$errors.map((e: any) => e.$message.toString())"
            @blur="v$.document.$touch"
          ></v-text-field>
        </div>
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Teléfono</h3>
          <v-text-field
            v-model="formData.phone"
            variant="outlined"
            placeholder="099 999 9999"
            :error-messages="v$.phone.$errors.map((e: any) => e.$message.toString())"
            @blur="v$.phone.$touch"
          ></v-text-field>
        </div>
      </div>
      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Email</h3>
          <v-text-field
            v-model="formData.email"
            variant="outlined"
            placeholder="jhondoe@contoso.com"
            :error-messages="v$.email.$errors.map((e: any) => e.$message.toString())"
            @blur="v$.email.$touch"
          ></v-text-field>
        </div>
      </div>

      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="emit('cancel')"> Cancelar </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleSaveInvoice"> Guardar </v-btn>
      </v-card-actions>
    </UiParentCard>
  </v-dialog>
</template>
