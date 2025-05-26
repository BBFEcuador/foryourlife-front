<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import type { Product, Program } from '@/models/Products';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import usePrograms from '@/composables/programs/usePrograms';
import useProductMutations from '@/composables/admin/products/useProductMutations';

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
}

interface Props {
    modelValue: boolean;
    product: Product | null;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update:product', product: Product): void;
    (e: 'cancel'): void;
}>();

const { programs, isProgramsError, isProgramsLoading } = usePrograms();
const { updateProductMutations } = useProductMutations();

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
    rules: null
});

const formData = ref<FormData>(createDefaultFormData());

const rules = {
    name: { required },
    code: { required },
    description: { required },
    basePrice: { required, numeric },
    currency: { required },
    programs: { required },
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
    if (val && props.product) {
        formData.value = {
            ...props.product,
            programs: props.product.programs?.map(p => p.id) || []
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
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    try {
        const productData: Omit<Product, 'id'> & { id?: string } = {
            name: formData.value.name || '',
            code: formData.value.code || '',
            description: formData.value.description || '',
            basePrice: Number(formData.value.basePrice) || 0,
            currency: formData.value.currency || 'USD',
            isActive: formData.value.isActive ?? true,
            programs: programs.value?.filter((p: Program) =>
                formData.value.programs.includes(p.id)
            ) || [],
            rules: formData.value.rules
        };

        if (props.product?.id) {
            productData.id = props.product.id;
        }

        await updateProductMutations.mutateAsync(productData as Product);
        closeDialog();
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
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
                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.name" label="Nombre" variant="outlined" density="comfortable"
                                :error-messages="v$.name.$errors.map((e: any) => e.$message as string)" required />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.code" label="Código" variant="outlined" density="comfortable"
                                :error-messages="v$.code.$errors.map((e: any) => e.$message as string)" required />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="formData.description" label="Descripción" variant="outlined" rows="3"
                                :error-messages="v$.description.$errors.map((e: any) => e.$message as string)" required />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="formData.basePrice" label="Precio Base"
                                :error-messages="v$.basePrice.$errors.map((e: any) => e.$message as string)"
                                type="number" min="0" step="0.01" variant="outlined" density="comfortable" required>
                                <template v-slot:prepend-inner>
                                    <span class="text-subtitle-2">{{ formData.currency === 'USD' ? '$' : 'COP' }}</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-select v-model="formData.currency" :items="[
                                { title: 'USD', value: 'USD' },
                                { title: 'COP', value: 'COP' }
                            ]" label="Moneda"
                                :error-messages="v$.currency.$errors.map((e: any) => e.$message as string)"
                                variant="outlined" density="comfortable" required />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="formData.programs" :items="programs" item-title="name" item-value="id"
                                label="Programas" multiple chips variant="outlined" density="comfortable"
                                :error-messages="v$.programs.$errors.map((e: any) => e.$message as string)" required />
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

