<script setup lang="ts">
import { computed } from 'vue';

interface Item {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Address {
  name: string;
  address1: string;
  address2: string;
}

interface Props {
  paymentNumber: string;
  billedBy: Address;
  billedTo: {
    name: string;
    address: string;
    document: string;
    phone: string;
    email: string;
  };
  dateIssued: string | Date;
  dueDate: string | Date;
  items: Item[];
  discountAmount: number;
  notes?: string;
}

const props = defineProps<Props>();

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
});

const grandTotal = computed(() => {
  return parseFloat((subtotal.value - props.discountAmount).toFixed(2));
});

// Función para formatear números con 2 decimales
const formatNumber = (value: number) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="tw:border pa-6 rounded-lg">
    <div class="tw:flex tw:justify-between mb-8">
      <div>
        <h2 class="tw:text-2xl tw:font-bold mb-4">Factura</h2>
        <p class="tw:text-gray-600">Cobro #{{ paymentNumber }}</p>
      </div>
      <div class="tw:w-20 tw:h-20 tw:bg-teal-600 tw:flex tw:items-center tw:justify-center tw:rounded-md">
        <span class="tw:text-white tw:text-xl">Logo</span>
      </div>
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:mb-8">
      <div>
        <p class="tw:text-gray-600 mb-2">Facturado por:</p>
        <p class="tw:font-semibold">{{ billedBy.name }}</p>
        <p>{{ billedBy.address1 }}</p>
        <p>{{ billedBy.address2 }}</p>
      </div>
      <div>
        <p class="tw:text-gray-600 mb-2">Facturado a:</p>
        <p class="tw:font-semibold">{{ billedTo.name }}</p>
        <p>{{ billedTo.address }}</p>
        <p>{{ billedTo.document }}</p>
        <p>{{ billedTo.phone }}</p>
        <p>{{ billedTo.email }}</p>
      </div>
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:mb-8">
      <div>
        <p class="tw:text-gray-600 tw:mb-2">Fecha de emisión:</p>
        <p>{{ formatDate(dateIssued) }}</p>
      </div>
    </div>

    <div class="tw:mb-8">
      <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Detalle</h3>
      <table class="tw:w-full">
        <thead>
          <tr class="tw:border-b tw:border-gray-300">
            <th class="tw:p-2 tw:text-left">Producto</th>
            <th class="tw:p-2 tw:text-right">Precio</th>
            <th class="tw:p-2 tw:text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index" class="tw:border-b tw:border-gray-200">
            <td class="tw:p-2">{{ item.name }}</td>
            <td class="tw:p-2 tw:text-right">${{ formatNumber(item.unitPrice) }}</td>
            <td class="tw:p-2 tw:text-right">${{ formatNumber(item.quantity * item.unitPrice) }}</td>
          </tr>
          <tr v-if="items.length === 0" class="tw:border-b tw:border-gray-200">
            <td colspan="4" class="tw:p-2 tw:text-center tw:text-gray-500">No hay productos seleccionados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="tw:flex tw:justify-end">
      <div class="tw:w-64">
        <div class="tw:flex tw:justify-between tw:py-2">
          <span>Subtotal</span>
          <span>${{ formatNumber(subtotal) }}</span>
        </div>
        <div class="tw:flex tw:justify-between tw:py-2">
          <span>Descuento</span>
          <span>-${{ formatNumber(discountAmount) }}</span>
        </div>
        <div class="tw:flex tw:justify-between tw:py-2 tw:font-bold tw:border-t tw:border-gray-300">
          <span>Total</span>
          <span>${{ formatNumber(grandTotal) }}</span>
        </div>
      </div>
    </div>

    <div v-if="notes" class="tw:mt-8 tw:border-t tw:pt-4 tw:text-gray-600">
      <h4 class="tw:font-semibold tw:mb-2">Notas</h4>
      <p>{{ notes }}</p>
    </div>
  </div>
</template>
