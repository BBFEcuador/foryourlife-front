<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { OperativeYourPayments } from '@/models/OperativeAssistantYour';

interface Props {
  data: OperativeYourPayments | null;
  isLoading: boolean;
}

const props = defineProps<Props>();

const paymentDetails = computed(() => [
  { label: 'Pagos previos', value: props.data?.previousPayments || 0 },
  { label: 'Pagos sábado', value: props.data?.saturdayPayments || 0 },
  { label: 'Pagos domingo', value: props.data?.sundayPayments || 0 }
]);
</script>

<template>
  <VCard variant="flat" elevation="1" rounded="lg" class="mt-4">
    <VCardItem class="pa-4">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-cash-multiple" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resumen de Pagos</h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de pagos por participantes</p>
        </div>
      </div>

      <div class="tw:grid tw:grid-cols-1 tw:gap-y-3">
        <div v-for="(item, index) in paymentDetails" :key="index" class="d-flex justify-space-between align-center tw:group">
          <div class="d-flex align-center ga-2">
            <div class="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:bg-slate-300 group-hover:tw:bg-cyan-500 tw:transition-colors"></div>
            <span class="tw:text-sm tw:font-medium tw:text-slate-600">{{ item.label }}</span>
          </div>
          <span class="tw:text-sm tw-font-bold tw:text-slate-800 tw:bg-slate-50 tw:px-3 tw:py-1 tw:rounded-lg">
            {{ item.value }}
          </span>
        </div>

        <v-divider class="my-1 tw-border-dashed"></v-divider>

        <div class="d-flex justify-space-between align-center">
          <span class="tw:font-medium tw:text-gray-800">Total Pagos</span>
          <span class="tw:font-medium tw:text-gray-800">
            {{ data?.totalPayments || 0 }}
          </span>
        </div>
      </div>
      <v-alert color="primary" variant="tonal" class="mt-6">
        <div class="tw-p-4 tw-rounded-2xl tw-bg-slate-50 tw-border tw-border-slate-100">
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center ga-2">
              <Icon icon="mdi:trophy-outline" class="tw-text-amber-500" />
              <span class="tw-text-xs tw-font-bold tw-text-slate-700 tw-uppercase">Pase Final</span>
            </div>
            <span class="tw-text-sm tw-font-black tw-text-primary"> {{ data?.totalPaymentsPercentage || 0 }}% </span>
          </div>

          <VProgressLinear
            :model-value="data?.totalPaymentsPercentage || 0"
            height="10"
            rounded
            color="primary"
            bg-color="white"
            class="tw-shadow-inner"
          >
            <template v-slot:default="{ value }">
              <div class="tw-w-full tw-h-full tw-opacity-20 tw-bg-white tw-animate-pulse"></div>
            </template>
          </VProgressLinear>
        </div>
      </v-alert>
    </VCardItem>
  </VCard>
</template>

<style scoped></style>
