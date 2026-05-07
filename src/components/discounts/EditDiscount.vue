<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Discount } from '@/models/Discount';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import usePrograms from '@/composables/programs/usePrograms';

interface FormData {
    id?: string;
    name: string;
    isActive: boolean;
    discountType: string;
    discountValue: number | string;
    needSupervision: boolean;
}

interface Props {
    modelValue: boolean;
    discount: Discount | null;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', discount: Omit<Discount, 'id'> & { id?: string }): void;
    (e: 'cancel'): void;
}>();

const { programs, isProgramsError, isProgramsLoading } = usePrograms();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const createDefaultFormData = (): FormData => ({
    name: '',
    isActive: true,
    discountType: '',
    discountValue: 0,
    needSupervision: false
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
    name: { required },
    discountType: { required },
    discountValue: { required, numeric },
    needSupervision: { required },
    isActive: { required }
};

const v$ = useVuelidate(rules, formData as any, { $autoDirty: true });

const resetForm = () => {
    formData.value = createDefaultFormData();
    if (v$.value) {
        v$.value.$reset();
    }
};

watch(() => props.modelValue, (val) => {
    isOpen.value = val;
    if (val && props.discount) {
        formData.value = {
            ...props.discount,
        };
    } else {
        resetForm();
    }
}, { immediate: true });

watch(isProgramsError, (isError) => {
    if (isError) {
        console.error('Error al cargar los programas');
    }
});

const closeDialog = () => {
    emit('update:modelValue', false);
    emit('cancel');
};

const updateProduct = async () => {
    if (!v$.value) return;
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    const discountData: Omit<Discount, 'id'> & { id?: string } = {
        id: formData.value.id,
        name: formData.value.name || '',
        discountType: formData.value.discountType || '',
        discountValue: Number(formData.value.discountValue) || 0,
        needSupervision: formData.value.needSupervision,
        isActive: formData.value.isActive ?? true,
    };

    emit('save', discountData);
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
        <v-card>
            <v-card-title class="d-flex align-center bg-primary px-6 py-4">
                <span class="text-h6 text-white">Editar Producto</span>
                <v-spacer />
                <v-btn icon variant="text" @click="closeDialog">
                    <Icon icon="mdi-close" />
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-6">
                <v-form ref="form" @submit.prevent="updateProduct">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="formData.name" label="Nombre del descuento"
                                :error-messages="v$.name.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.name.$touch" variant="outlined" density="comfortable" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-select v-model="formData.discountType" :items="[
                                { title: 'Porcentaje', value: 'P' },
                                { title: 'Efectivo', value: 'E' }
                            ]" label="Tipo de descuento"
                                :error-messages="v$.discountType.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.discountType.$touch" variant="outlined" density="comfortable"
                                required></v-select>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.discountValue"
                                :label="formData.discountType === 'P' ? 'Valor (%)' : 'Efectivo'" type="number"
                                :suffix="formData.discountType === 'P' ? '%' : 'USD'"
                                :error-messages="v$.discountValue.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.discountValue.$touch" variant="outlined" density="comfortable"
                                required></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-switch v-model="formData.needSupervision" label="¿Requiere supervisión?" color="primary"
                                hide-details></v-switch>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
                <v-spacer />
                <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog" :disabled="isLoading">
                    Cancelar
                </v-btn>
                <v-btn color="primary" @click="updateProduct" :loading="isLoading">
                    Actualizar Producto
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
