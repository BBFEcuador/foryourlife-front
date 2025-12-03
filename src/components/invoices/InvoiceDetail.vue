<script setup lang="ts">
import useContificoConfigByCampus from '@/composables/admin/contifico/useContificoConfig';
import type { Campus } from '@/models/Campus';
import type { Invoice } from '@/models/Invoice';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed } from 'vue';

const props = defineProps<{ invoice: Invoice; showDialog: boolean; campus: Campus; remainingBalance: number }>();

const { contificoConfig } = useContificoConfigByCampus(props.campus.id);

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

const emit = defineEmits(['cancel']);

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const totalServiceAmount = computed(() => {
  return props.invoice.products.reduce((total, item) => total + item.basePrice, 0);
});
</script>
<template>
  <v-dialog max-width="800" persistent :model-value="props.showDialog">
    <v-card>
      <v-card-title class="d-flex align-center" style="background-color: #8f71a459" elevation="4">
        <span class="text-h4 text-white tw:font-bold text-primary"
          >Factura
          <p class="tw:text-gray-800 tw:font-bold">No. {{ props.invoice.invoiceNumber }}</p></span
        >
        <v-spacer />
        <v-btn elevation="0" variant="plain" icon class="tw:rounded-md" @click="emit('cancel')">
          <Icon icon="mdi:close" />
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-4 flex-grow-1 tw:overflow-y-auto">
        <div class="tw:grid tw:grid-cols-2 mb-4 tw:gap-6">
          <div>
            <v-alert class="mb-3">
              <v-text-alert-title class="text-primary">Fecha de emisión:</v-text-alert-title>
              <v-divider class="mb-4"></v-divider>
              <v-text-alert-content class="mt-4">
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:calendar" class="tw:text-gray-700" height="16" />
                  {{ formatDate(props.invoice.invoiceDate) }}
                </div>
              </v-text-alert-content>
            </v-alert>
            <v-alert>
              <v-text-alert-title class="text-primary">Facturado por:</v-text-alert-title>
              <v-divider class="mb-4"></v-divider>
              <v-text-alert-content class="mt-4">
                <!-- <p class="tw:font-semibold"> -->
                <div class="d-flex tw:gap-3 mb-1 tw:font-semibold align-center">
                  <Icon icon="mdi:card-account-details" class="tw:text-gray-700" height="16" />
                  {{ billedBy.ruc }}
                </div>
                <!-- </p> -->
                <!-- <p class="tw:font-semibold"> -->
                <div class="d-flex tw:gap-3 mb-1 tw:font-semibold align-center">
                  <Icon icon="mdi:user" class="tw:text-gray-700" height="16" />
                  {{ billedBy.name }}
                </div>
                <!-- </p> -->
                <!-- <p> -->
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:map-marker" class="tw:text-gray-700" height="16" />
                  {{ billedBy.address }}
                </div>
                <!-- </p> -->
                <!-- <p> -->
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:phone" class="tw:text-gray-700" height="16" />
                  {{ billedBy.phone }}
                </div>
                <!-- </p> -->
              </v-text-alert-content>
            </v-alert>
          </div>
          <div>
            <v-alert>
              <v-text-alert-title class="text-primary">Facturado a:</v-text-alert-title>
              <v-divider class="mb-4"></v-divider>
              <v-text-alert-content class="mt-4">
                <div class="d-flex tw:gap-3 mb-1 tw:font-semibold align-center">
                  <Icon icon="mdi:card-account-details" class="tw:text-gray-700" height="16" />
                  {{ props.invoice.document }}
                </div>
                <div class="d-flex tw:gap-3 mb-1 tw:font-semibold align-center">
                  <Icon icon="mdi:user" class="tw:text-gray-700" height="16" />
                  {{ props.invoice.fullName }}
                </div>
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:map-marker" class="tw:text-gray-700" height="16" />
                  {{ props.invoice.address }}
                </div>
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:phone" class="tw:text-gray-700" height="16" />
                  {{ props.invoice.phone }}
                </div>
                <div class="d-flex tw:gap-3 mb-1 align-center">
                  <Icon icon="mdi:email" class="tw:text-gray-700" height="16" />
                  {{ props.invoice.email }}
                </div>
              </v-text-alert-content>
            </v-alert>
          </div>
        </div>
        <div>
          <h3 class="tw:text-lg tw:font-semibold text-primary">Detalle</h3>
          <v-divider class="mb-2 text-primary"></v-divider>
          <div class="ml-4">
            <table class="tw:w-full l-4">
              <thead>
                <tr class="tw:border-b tw:border-gray-300">
                  <th class="p-2 tw:font-semibold tw:text-left">Producto</th>
                  <th class="p-2 tw:font-semibold tw:text-left">Programas</th>
                  <th class="p-2 tw:font-semibold tw:text-right">Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in props.invoice.products" :key="index" class="tw:border-b tw:border-gray-200">
                  <td class="tw:p-2">{{ item.name }}</td>
                  <td>
                    <div v-if="item.programs.length > 0" class="d-flex flex-wrap gap-2 ma-2">
                      <v-chip
                        v-for="program in item.programs"
                        :key="program.id"
                        size="small"
                        variant="outlined"
                        class="text-caption mr-2"
                        :color="getProgramColor(program.courseLevel)"
                      >
                        {{ program.courseLevel }}
                      </v-chip>
                    </div>
                  </td>
                  <td class="tw:p-2 tw:text-right">$ {{ invoice.products[index].basePrice }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tw:flex tw:justify-end">
          <div class="tw:w-64">
            <div class="tw:flex tw:justify-between py-2">
              <span>Total Detalle</span>
              <span class="tw:font-medium tw:text-gray-800">
                $
                {{
                  totalServiceAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}
              </span>
            </div>
          </div>
        </div>
        <v-divider class="tw:my-4" />
        <h4 class="tw:text-lg tw:font-semibold text-primary">Resumen del Pago Actual</h4>
        <v-divider class="tw:my-4" />
        <div class="tw:flex tw:justify-end">
          <div class="tw:w-64">
            <div class="tw:flex tw:justify-between py-2">
              <span>Descuento</span>
              <span>
                $
                {{
                  props.invoice.totalDiscount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}</span
              >
            </div>
            <div class="tw:flex tw:justify-between py-2">
              <span>Subtotal</span>
              <span
                >$
                {{
                  (props.invoice.amount - props.invoice.taxAmount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}
              </span>
            </div>
            <div class="tw:flex tw:justify-between py-2">
              <span>IVA 15%</span>
              <span>
                $
                {{
                  props.invoice.taxAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}
              </span>
            </div>
            <div class="tw:flex tw:justify-between py-2 tw:font-bold tw:border-t tw:border-gray-300">
              <span>Total Facturado</span>
              <span>$ {{ props.invoice.amount.toFixed(2) }}</span>
            </div>
            <div class="tw:flex tw:justify-between py-2 tw:font-bold tw:border-t tw:border-gray-300">
              <span>Saldo Pendiente</span>
              <span :class="[props.remainingBalance > props.invoice.amount ? 'tw:text-red-800' : 'tw:text-green-600']">
                $
                {{
                  props.remainingBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}</span
              >
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.animated-gradient {
  background: linear-gradient(-45deg, #ffa63d, #ff3d77, #338aff, #3cf0c5);
  background-size: 600%;
  animation: anime 12s linear infinite;
  color: rgba(255, 255, 255, 90%) !important;
}
</style>
