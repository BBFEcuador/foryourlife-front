<script setup lang="ts">
import { ref, watch  } from 'vue';
import type { Discount } from '@/models/Discount';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';

interface FormData {
    id?: string;
    name: string;
    discountType: string;
    discountValue: number | string;
    needSupervision: boolean;
    isActive: boolean;
}

const props = withDefaults(defineProps<{
    modelValue: boolean;
    discount?: Discount | null;
    isLoading?: boolean;
}>(), {
    isLoading: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', discount: Partial<Discount>): void;
    (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const createDefaultFormData = (): FormData => ({
    name: '',
    discountType: 'P',
    discountValue: 0,
    needSupervision: false,
    isActive: true,
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
    name: { required },
    discountType: { required },
    discountValue: { required, numeric },
};

const v$ = useVuelidate(rules, formData);

const resetForm = () => {
    formData.value = createDefaultFormData();
    if (form.value) {
        form.value.reset();
    }
    v$.value.$reset();
};

watch(() => props.modelValue, (val) => {
    isOpen.value = val;
    if (val) {
        if (props.discount) {
            formData.value = {
                id: props.discount.id,
                name: props.discount.name,
                discountType: props.discount.discountType,
                discountValue: props.discount.discountValue,
                needSupervision: props.discount.needSupervision,
                isActive: props.discount.isActive
            };
        } else {
            resetForm();
        }
    }
});

const closeDialog = () => {
    isOpen.value = false;
    emit('update:modelValue', false);
    emit('cancel');
};

const saveDiscount = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    const discountData: Partial<Discount> = {
        ...(formData.value.id && { id: formData.value.id }),
        name: formData.value.name,
        discountType: formData.value.discountType,
        discountValue: Number(formData.value.discountValue),
        needSupervision: formData.value.needSupervision,
        isActive: formData.value.isActive
    };

    emit('save', discountData);
};

const focus = () => {
    // Focus logic if needed
};

defineExpose({
    focus,
    resetForm
});
</script>

<template>
    <v-dialog v-model="isOpen" max-width="600" persistent>
        <v-card>
            <v-toolbar color="primary" class="text-white" :title="formData.id ? 'Editar Descuento' : 'Nuevo Descuento'">
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <Icon icon="mdi:close" />
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-4">
                <v-form ref="form" @submit.prevent="saveDiscount">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="formData.name"
                                label="Nombre del descuento"
                                :error-messages="v$.name.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.name.$touch"
                                variant="outlined"
                                density="comfortable"
                                required
                            ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                            <v-select
                                v-model="formData.discountType"
                                :items="[ 
                                    { title: 'Porcentaje', value: 'P' },
                                    { title: 'Efectivo', value: 'E' }
                                ]"
                                label="Tipo de descuento"
                                :error-messages="v$.discountType.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.discountType.$touch"
                                variant="outlined"
                                density="comfortable"
                                required
                            ></v-select>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="formData.discountValue"
                                :label="formData.discountType === 'P' ? 'Valor (%)' : 'Efectivo'"
                                type="number"
                                :suffix="formData.discountType === 'P' ? '%' : 'USD'"
                                :error-messages="v$.discountValue.$errors.map((e: any) => e.$message.toString())"
                                @blur="v$.discountValue.$touch"
                                variant="outlined"
                                density="comfortable"
                                required
                            ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12">
                            <v-switch
                                v-model="formData.needSupervision"
                                label="¿Requiere supervisión?"
                                color="primary"
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
                <v-spacer></v-spacer>
                <v-btn
                    variant="text"
                    color="grey-darken-1"
                    @click="closeDialog"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    color="primary"
                    variant="elevated"
                    :loading="isLoading"
                    @click="saveDiscount"
                >
                    {{ formData.id ? 'Actualizar' : 'Guardar' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>