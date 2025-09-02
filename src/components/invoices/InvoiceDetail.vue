<script setup lang="ts">
import useContificoConfigByCampus from '@/composables/admin/contifico/useContificoConfig';
import type { Invoice } from '@/models/Invoice';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed } from 'vue';

const props = defineProps<{ invoice: Invoice; showDialog: boolean }>();

const { contificoConfig, isContificoConfigError, isContificoConfigLoading } = useContificoConfigByCampus(props.invoice.payment.campus.id);

const billedBy = computed(() => {
  return {
    name: contificoConfig.value.razonSocial,
    ruc: contificoConfig.value.ruc,
    address: contificoConfig.value.address,
    phone: contificoConfig.value.phone
  };
});

const getProgramColor = (level: string): string => {
  type LevelKeys = 'FOCUS' | 'YOUR' | 'LIFE';
  const colors: Record<LevelKeys, string> = {
    FOCUS: 'blue',
    YOUR: 'green',
    LIFE: 'purple'
  };
  return colors[level.toUpperCase() as LevelKeys] || 'grey';
};

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
      <div class="tw:flex tw:justify-between mb-6">
        <div>
          <h2 class="tw:text-2xl tw:font-bold">Factura</h2>
          <p class="tw:text-gray-600">{{ props.invoice.invoiceContifico.documento }}</p>
        </div>
        <v-btn elevation="0" variant="plain" icon @click="emit('cancel')" class="tw:rounded-md">
          <Icon icon="mdi:close" />
        </v-btn>
      </div>

      <div class="tw:grid tw:grid-cols-2 mb-4">
        <div>
          <p class="tw:text-gray-600 mb-2">Facturado por:</p>
          <p class="tw:font-semibold">{{ billedBy.ruc }}</p>
          <p class="tw:font-semibold">{{ billedBy.name }}</p>
          <p>{{ billedBy.address }}</p>
          <p>{{ billedBy.phone }}</p>
        </div>
        <div>
          <p class="tw:text-gray-600 mb-2">Facturado a:</p>
          <p class="tw:font-semibold">{{ props.invoice.invoiceContifico.cliente.cedula }}</p>
          <p class="tw:font-semibold">{{ props.invoice.invoiceContifico.cliente.ruc }}</p>
          <p class="tw:font-semibold">{{ props.invoice.invoiceContifico.cliente.razon_social }}</p>
          <p>{{ props.invoice.invoiceContifico.cliente.direccion }}</p>
          <p>{{ props.invoice.invoiceContifico.cliente.telefonos }}</p>
          <p>{{ props.invoice.invoiceContifico.cliente.email }}</p>
        </div>
      </div>

      <div class="tw:grid tw:grid-cols-2 mb-8">
        <div>
          <p class="tw:text-gray-600 tw:mb-2">Fecha de emisión:</p>
          <p>{{ formatDate(props.invoice.invoiceDate) }}</p>
        </div>
      </div>

      <div>
        <h3 class="tw:text-lg tw:font-semibold mb-4">Detalle</h3>
        <table class="tw:w-full">
          <thead>
            <tr class="tw:border-b tw:border-gray-300">
              <th class="p-2 tw:text-left">Producto</th>
              <th class="p-2 tw:text-left">Programas</th>
              <th class="p-2 tw:text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in props.invoice.products" :key="index" class="tw:border-b tw:border-gray-200">
              <td class="tw:p-2">{{ item.name }}</td>
              <td>
                <div v-if="item.programs.length > 0" class="d-flex flex-wrap gap-2">
                  <v-chip v-for="program in item.programs" :key="program.id" size="small" variant="outlined"
                    class="text-caption mr-2" :color="getProgramColor(program.courseLevel)">
                    {{ program.courseLevel }}
                  </v-chip>
                </div>
              </td>
              <td class="tw:p-2 tw:text-right">{{ invoice.products[index].basePrice }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tw:flex tw:justify-end">
        <div class="tw:w-64">
          <div class="tw:flex tw:justify-between py-2">
            <span>Descuento</span>
            <span>${{
              props.invoice.totalDiscount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            }}</span>
          </div>
          <div class="tw:flex tw:justify-between py-2">
            <span>Subtotal</span>
            <span>${{
              (props.invoice.amount - props.invoice.taxAmount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            }}</span>
          </div>
          <div class="tw:flex tw:justify-between py-2">
            <span>IVA 15%</span>
            <span>${{
              props.invoice.taxAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            }}</span>
          </div>
          <div class="tw:flex tw:justify-between py-2 tw:font-bold tw:border-t tw:border-gray-300">
            <span>Total</span>
            <span>${{ props.invoice.amount }}</span>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
