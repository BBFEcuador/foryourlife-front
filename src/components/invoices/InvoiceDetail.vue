<script setup lang="ts">
import type { Invoice } from '@/models/Invoice';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{ invoice: Invoice; showDialog: boolean }>();

const emit = defineEmits<{
  (e: 'cancel'): void;
}>();

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
<template>
  <v-dialog max-width="600" :model-value="props.showDialog">
    <v-card elevation="0" class="pa-6 rounded-lg">
      <div class="tw:flex tw:justify-between mb-8">
        <div>
          <h2 class="tw:text-2xl tw:font-bold">Factura</h2>
          <p class="tw:text-gray-600">#{{ props.invoice.invoiceNumber }}</p>
        </div>
        <v-btn elevation="0" variant="plain" icon @click="emit('cancel')" class="tw:rounded-md">
          <Icon icon="mdi:close" />
        </v-btn>
      </div>

      <div class="tw:grid tw:grid-cols-2 tw:mb-8">
        <div>
          <p class="tw:text-gray-600 mb-2">Facturado por:</p>
          <p class="tw:font-semibold">Nombre de empresa</p>
          <p>telefono</p>
          <p>direccion</p>
        </div>
        <div>
          <p class="tw:text-gray-600 mb-2">Facturado a:</p>
          <p class="tw:font-semibold">{{ props.invoice.fullName }}</p>
          <p>{{ props.invoice.address }}</p>
          <p>{{ props.invoice.document }}</p>
          <p>{{ props.invoice.phone }}</p>
          <p>{{ props.invoice.email }}</p>
        </div>
      </div>

      <div class="tw:grid tw:grid-cols-2 tw:mb-8">
        <div>
          <p class="tw:text-gray-600 tw:mb-2">Fecha de emisión:</p>
          <p>{{ formatDate(props.invoice.invoiceDate) }}</p>
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
            <tr v-for="(item, index) in props.invoice.products" :key="index" class="tw:border-b tw:border-gray-200">
              <td class="tw:p-2">{{ item.name }}</td>
              <td class="tw:p-2 tw:text-right">${{ item.basePrice }}</td>
              <td class="tw:p-2 tw:text-right">${{ item.basePrice }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tw:flex tw:justify-end">
        <div class="tw:w-64">
          <div class="tw:flex tw:justify-between tw:py-2">
            <span>Subtotal</span>
            <span
              >${{
                (props.invoice.amount - props.invoice.taxAmount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}</span
            >
          </div>
          <div class="tw:flex tw:justify-between tw:py-2">
            <span>IVA 15%</span>
            <span
              >${{
                props.invoice.taxAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}</span
            >
          </div>
          <div class="tw:flex tw:justify-between tw:py-2 tw:font-bold tw:border-t tw:border-gray-300">
            <span>Total</span>
            <span>${{ props.invoice.amount }}</span>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
