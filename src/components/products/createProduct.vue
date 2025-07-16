<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { Product, Program } from '@/models/Products';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import usePrograms from '@/composables/programs/usePrograms';
import useCampus from '@/composables/admin/useCampus';
import type { Campus } from '@/models/Campus';
import { adminStore } from '@/stores/adminStore';

const { programs, isProgramsError } = usePrograms();
const { campus } = useCampus();
const store = adminStore();
const disabledProperty = store.isCampusSelected;

interface FormData {
  id?: string;
  name: string;
  code: string;
  description: string;
  basePrice: number | string;
  currency: string;
  programs: string[];
  isActive: boolean;
  rules: any | null;
  campus: Campus;
}

interface Props {
  modelValue: boolean;
  product?: Product | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  programs: () => []
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', product: Partial<Product>): void;
  (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const createDefaultFormData = (): FormData => ({
  name: '',
  code: '',
  description: '',
  basePrice: 0,
  currency: 'USD',
  programs: [],
  isActive: true,
  rules: null,
  campus: campus.value.find((aux) => aux.id === store.selectCampusId)!!
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
  name: { required },
  code: { required },
  description: { required },
  basePrice: { required, numeric },
  currency: { required },
  programs: { required },
  isActive: { required },
  campus: { required }
};

const v$ = useVuelidate(rules, formData as any, { $autoDirty: true });

const resetForm = () => {
  formData.value = createDefaultFormData();
  if (v$.value) {
    v$.value.$reset();
  }
};

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      if (props.product) {
        formData.value = {
          ...props.product,
          programs: props.product.programs?.map((p) => p.id) || [],
          campus: props.product.campus
        };
      } else {
        resetForm();
      }
    }
  },
  { immediate: true }
);

watch(isProgramsError, (isError) => {
  if (isError) {
    console.error('Error al cargar los programas');
  }
});

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const saveProduct = async () => {
  if (!v$.value) return;
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const productData: Partial<Product> = {
    name: formData.value.name || '',
    code: formData.value.code || '',
    description: formData.value.description || '',
    basePrice: Number(formData.value.basePrice) || 0,
    currency: formData.value.currency || 'USD',
    isActive: formData.value.isActive ?? true,
    programs: programs.value?.filter((p: Program) => formData.value.programs.includes(p.id)) || [],
    rules: formData.value.rules,
    campus: formData.value.campus
  };

  if (props.product?.id) {
    productData.id = props.product.id;
  }

  emit('save', productData);
};

const focus = () => {
  form.value?.focus();
};

defineExpose({
  focus,
  resetForm
});
</script>
<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center bg-primary">
        <Icon icon="mdi-package-variant" class="mr-2" />
        <span class="text-h6 text-white">{{ product ? 'Editar Producto' : 'Nuevo Producto' }}</span>
        <v-spacer />
        <v-btn icon variant="text" @click="closeDialog">
          <Icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="saveProduct">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name"
                label="Nombre del producto"
                :error-messages="v$.name.$errors.map((e: any) => e.$message as string)"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.code"
                label="Código"
                :error-messages="v$.code.$errors.map((e: any) => e.$message as string)"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="formData.campus"
                :items="campus"
                item-title="city"
                label="Campus"
                :error-messages="v$.campus.$errors.map((e: any) => e.$message as string)"
                variant="outlined"
                density="comfortable"
                return-object
                :disabled="disabledProperty"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Descripción"
                :error-messages="v$.description.$errors.map((e: any) => e.$message as string)"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.basePrice"
                label="Precio base"
                :error-messages="v$.basePrice.$errors.map((e: any) => e.$message as string)"
                type="number"
                min="0"
                step="0.01"
                variant="outlined"
                density="comfortable"
                required
              >
                <template v-slot:prepend-inner>
                  <span class="text-subtitle-2">{{ formData.currency === 'USD' ? '$' : 'COP ' }}</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.currency"
                :items="[
                  { title: 'USD', value: 'USD' },
                  { title: 'COP', value: 'COP' }
                ]"
                label="Moneda"
                :error-messages="v$.currency.$errors.map((e: any) => e.$message as string)"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formData.programs"
                :items="programs"
                item-title="name"
                item-value="id"
                label="Programas"
                :error-messages="v$.programs.$errors.map((e: any) => e.$message as string)"
                multiple
                chips
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="flat" :disabled="isLoading" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="flat" :loading="isLoading" @click="saveProduct">
          {{ product ? 'Actualizar' : 'Guardar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
