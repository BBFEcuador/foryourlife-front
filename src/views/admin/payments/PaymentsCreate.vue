<script setup lang="ts">
import GeneralPayment from '@/components/payments/GeneralPayment.vue';
import PaymentPreview from '@/components/payments/PaymentPreview.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePaymentMutations from '@/composables/admin/payments/usePaymentsMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// Tab controls
// Datos de la factura
const paymentNumber = ref('PAY-000001');
const selectedProduct = ref(null);
const selectedParticipant = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref(null);
const notes = ref('');
const { savePaymentMutations } = usePaymentMutations();
const router = useRouter();
const isLoading = ref(false);

// Información de la empresa
const billedBy = {
    name: 'Impetus S.A',
    address1: '789 Enterprise Avenue, Floor 2',
    address2: 'Metropolis, Country'
};

const billedTo = computed(() => {
    if (selectedParticipant.value) {
        const participant = selectedParticipant.value as any;
        return {
            name: participant.name || 'Sin nombre',
            address1: participant.profile?.address || 'Dirección no especificada',
            address2: participant.email || ''
        };
    }
    return {
        name: 'Seleccione un cliente',
        address1: 'Dirección no especificada',
        address2: ''
    };
});



const invoiceItems = computed(() => {
    if (!selectedProduct.value) return [];
    const product = selectedProduct.value as any;
    return [{
        name: product.name,
        quantity: 1,
        unitPrice: product.basePrice || 0
    }];
});

const discountAmount = computed(() => {
    if (!selectedDiscount.value || !selectedProduct.value) return 0;
    const discount = selectedDiscount.value as any;
    const product = selectedProduct.value as any;
    const price = product.basePrice || 0;

    if (discount.discountType === 'P') {
        return parseFloat((price * parseFloat(discount.discountValue) / 100).toFixed(2));
    } else if (discount.discountType === 'E') {
        return parseFloat(parseFloat(discount.discountValue).toFixed(2));
    }
    return 0;
});

const breadcrumbs = [
    {
        title: 'Pagos',
        disabled: false,
        href: '/admin/payments'
    },
    {
        title: 'Nuevo Pago',
        disabled: true,
        href: '#'
    }
];

// Obtener la mutación para guardar el pago

// Función para procesar el pago
const processPayment = async () => {
    if (!selectedProduct.value) {
        showErrorToast('Debe seleccionar un producto' as any);
        return;
    }

    isLoading.value = true;
    
    const productId = (selectedProduct.value as any)?.id;
    const paymentData = {
        product: [productId],
        participant: (selectedParticipant.value as any)?.id,
        campus: (selectedCampus.value as any)?.id,
        total: grandTotal.value
    };
    await savePaymentMutations.mutate(paymentData);
};

// Calcular el total final (subtotal - descuento)
const grandTotal = computed(() => {
    if (!selectedProduct.value) return 0;
    
    const product = selectedProduct.value as any;
    const price = product.basePrice || 0;
    
    return parseFloat((price - discountAmount.value).toFixed(2));
});

watch(savePaymentMutations.isSuccess, () => {
    if (savePaymentMutations.isSuccess.value) {
        isLoading.value = false;
        showSuccessToast('Cobro guardado exitosamente');
        router.push({name: 'payments-admin'});
    }
});

watch(savePaymentMutations.isError, () => {
    if (savePaymentMutations.isError.value) {
        const error = savePaymentMutations.error.value as AxiosError<ErrorApiResponse>;
        showErrorToast(error);
    }
});
</script>

<template>
    <BaseBreadcrumb :title="'Crear Nuevo Cobro'" :breadcrumbs="breadcrumbs">
        <template #action>
            <v-btn color="primary" @click="processPayment" :loading="isLoading" :disabled="isLoading || !selectedProduct || !selectedParticipant">
                Procesar cobro
            </v-btn>
        </template>
    </BaseBreadcrumb>
    <div class="tw:flex tw:flex-col">
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mb-4 payment-card">
                    <v-card-title class="py-2">
                        <h3 class="tw:font-medium">Detalle de pago</h3>
                    </v-card-title>
                    <v-card-text>
                        <GeneralPayment @update:selected-participant="selectedParticipant = $event"
                            @update:selected-product="selectedProduct = $event" @update:notes="notes = $event"
                            @update:selected-discount="selectedDiscount = $event" 
                            @update:selected-campus="selectedCampus = $event" />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="mb-4 h-full">
                    <v-card-title class="py-4">
                        <h3 class="tw:font-medium">Vista Previa</h3>
                    </v-card-title>
                    <v-card-text>
                        <PaymentPreview :payment-number="paymentNumber" :billed-by="billedBy" :billed-to="billedTo"
                            :items="invoiceItems"
                            :discount-amount="discountAmount" :notes="notes" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
/* Transitions and animations */
.payment-card {
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.payment-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.section-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<style lang="scss" scoped></style>