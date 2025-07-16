<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import type { StoreRequest } from '@/models/CashDrawer';
import { adminStore } from '@/stores/adminStore';
import useCampus from '@/composables/admin/useCampus';

interface FormData {
  address: string;
  number: string;
  campusId: string;
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
  (e: 'save', store: StoreRequest): void;
  (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);
const { campus } = useCampus();
const store = adminStore();

const createDefaultFormData = (): FormData => ({
  number: '',
  campusId: store.selectCampusId,
  address: ''
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
  number: { required, numeric },
  address: { required },
  campusId: { required }
};

const v$ = useVuelidate(rules, formData);

const resetForm = () => {
  formData.value = createDefaultFormData();
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

const saveStore = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const storeData = {
    ...formData.value
  };

  emit('save', storeData);
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
        <span> Crear Establecimiento </span>
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
                label="Numero de establecimiento"
                type="number"
                :error-messages="v$.number.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.number.$touch"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.campusId"
                label="Campus"
                :items="campus"
                item-title="city"
                item-value="id"
                :error-messages="v$.campusId.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.campusId.$touch"
                variant="outlined"
                density="comfortable"
                required
                disabled
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="formData.address"
                label="Dirección"
                :error-messages="v$.address.$errors.map((e: any) => e.$message.toString())"
                @blur="v$.address.$touch"
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
        <v-btn color="primary" variant="elevated" :loading="isLoading" @click="saveStore"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
