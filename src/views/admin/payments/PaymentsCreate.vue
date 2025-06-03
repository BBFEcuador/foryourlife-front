<script setup lang="ts">
import GeneralPayment from '@/components/payments/GeneralPayment.vue';
import PaymentPreview from '@/components/payments/PaymentPreview.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePaymentMutations from '@/composables/admin/payments/usePaymentsMutations';
import type { AxiosError } from 'axios';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

// Tab controls
// Datos de la factura
const paymentNumber = ref('PAY-000001');
const selectedProduct = ref(null);
const selectedParticipant = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref(null);
const notes = ref('');
const fullname = ref('');
const address = ref('');
const document = ref('');
const phone = ref('');
const email = ref('');

// Información de la empresa
const billedBy = {
  name: 'Impetus S.A',
  address1: '789 Enterprise Avenue, Floor 2',
  address2: 'Metropolis, Country'
};

const billedTo = computed(() => {
  /* if (selectedParticipant.value) {
    const participant = selectedParticipant.value as any;
    return {
      name: participant.name || 'Sin nombre',
      address1: participant.profile?.address || 'Dirección no especificada',
      address2: participant.email || ''
    };
  } */
  return {
    name: fullname.value ? fullname.value : 'Nombre no especificado',
    address: address.value ? address.value : 'Dirección no especificada',
    document: document.value ? document.value : 'Documento no especificado',
    phone: phone.value ? phone.value : 'Teléfono no especificado',
    email: email.value ? email.value : 'Email no especificado'
  };
});

// Para depuración
watch(selectedParticipant, (newVal: any) => {
  console.log('Participante seleccionado:', newVal);
});

// Fechas
const dateIssued = new Date();
const dueDate = computed(() => {
  const date = new Date(dateIssued);
  date.setDate(date.getDate() + 14); // 2 semanas de plazo
  return date;
});

const invoiceItems = computed(() => {
  if (!selectedProduct.value) return [];

  const product = selectedProduct.value as any;
  return [
    {
      name: product.name || 'Producto sin nombre',
      quantity: 1,
      unitPrice: product.basePrice || 0
    }
  ];
});

const discountAmount = computed(() => {
  if (!selectedDiscount.value || !selectedProduct.value) return 0;
  const discount = selectedDiscount.value as any;
  const product = selectedProduct.value as any;
  const price = product.basePrice || 0;

  if (discount.discountType === 'P') {
    // Descuento porcentual
    return parseFloat(((price * parseFloat(discount.discountValue)) / 100).toFixed(2));
  } else if (discount.discountType === 'E') {
    // Descuento de monto exacto
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
const { savePaymentMutations } = usePaymentMutations();
const router = useRouter();
const isLoading = ref(false);
const showSuccessModal = ref(false);
const redirectCountdown = ref(3);

defineExpose({ showSuccessModal, redirectCountdown });

// Función para procesar el pago
const processPayment = async () => {
  isLoading.value = true;
  const paymentData = {
    products: [(selectedProduct.value as any).id],
    participant: (selectedParticipant.value as any).id,
    campus: (selectedCampus.value as any).id,
    total: grandTotal.value,
    invoice: { fullName: fullname.value, address: address.value, document: document.value, phone: phone.value, email: email.value }
  };

  console.log('Enviando datos de pago:', paymentData);
  savePaymentMutations.mutate(paymentData, {
    onSuccess: (data) => {
      showSuccessModal.value = true;
      let countdown = 3;
      redirectCountdown.value = countdown;

      const interval = setInterval(() => {
        countdown--;
        redirectCountdown.value = countdown;

        if (countdown === 0) {
          clearInterval(interval);
          router.push('/admin/payments'); // Cambia por tu ruta
        }
      }, 1000);
    },
    onError: (error) => {
      const val = error as AxiosError<{ message: string }>;
      val.response?.data?.message ? toast.error(val.response.data.message) : toast.error(error);
    }
  });
};

// Calcular el total final (subtotal - descuento)
const grandTotal = computed(() => {
  if (!selectedProduct.value) return 0;

  const product = selectedProduct.value as any;
  const price = product.basePrice || 0;

  return parseFloat((price - discountAmount.value).toFixed(2));
});
</script>

<template>
  <BaseBreadcrumb :title="'Crear Nuevo Cobro'" :breadcrumbs="breadcrumbs">
    <template #action>
      <v-btn
        color="primary"
        @click="processPayment"
        :loading="savePaymentMutations.isPending.value"
        :disabled="!selectedProduct || !selectedParticipant"
      >
        Procesar cobro
      </v-btn>
    </template>
  </BaseBreadcrumb>

  <v-dialog v-model="showSuccessModal" max-width="400">
    <v-card>
      <v-card-title class="text-h5 text-center">¡Pago exitoso!</v-card-title>
      <v-card-text class="text-center"> Serás redirigido en {{ redirectCountdown }} segundos... </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="router.push('/ruta-exitosa')">Ir ahora</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="tw:flex tw:flex-col">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4 payment-card">
          <v-card-title class="py-2">
            <h3 class="tw:font-medium">Detalle de pago</h3>
          </v-card-title>
          <v-card-text>
            <GeneralPayment
              @update:selected-participant="selectedParticipant = $event"
              @update:selected-product="selectedProduct = $event"
              @update:notes="notes = $event"
              @update:fullname="fullname = $event"
              @update:address="address = $event"
              @update:document="document = $event"
              @update:phone="phone = $event"
              @update:email="email = $event"
              @update:selected-discount="selectedDiscount = $event"
              @update:selected-campus="selectedCampus = $event"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-4 h-full">
          <v-card-title class="py-4">
            <h3 class="tw:font-medium">Vista Previa</h3>
          </v-card-title>
          <v-card-text>
            <PaymentPreview
              :payment-number="paymentNumber"
              :billed-by="billedBy"
              :billed-to="billedTo"
              :date-issued="dateIssued"
              :due-date="dueDate"
              :items="invoiceItems"
              :discount-amount="discountAmount"
              :notes="notes"
            />
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
