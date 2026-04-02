<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { OperativeFocusPayments } from '@/models/OperativeAssistantFocus';

interface Props {
  data: OperativeFocusPayments | null;
  isLoading: boolean;
}

const props = defineProps<Props>();

const paymentDetails = computed(() => [
  { label: 'YOUR', value: props.data?.yourPaymentsCount || 0 },
  { label: 'YOUR + LIFE', value: props.data?.yourPlusLifePaymentsCount || 0 }
]);
</script>

<template>
  <VCard variant="flat" elevation="1" rounded="lg">
    <VCardItem class="pa-4">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-cash-multiple" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Pagos</h4>
          <p class="tw:text-sm tw:text-gray-500">Resumen general de pagos</p>
        </div>
      </div>
      <VRow>
        <VCol cols="12" md="4" class="tw:content-center">
          <div class="d-flex flex-column mb-2">
            <div class="d-flex align-center gap-1 tw:justify-center">
              <span class="tw:text-sm tw:font-medium tw:text-slate-600">Posibilidades</span>
            </div>
            <span class="tw:font-bold tw:text-gray-800 text-center">
              {{ props?.data?.possibilityPaymentsCount || 0 }}
            </span>
          </div>

          <div class="d-flex flex-column">
            <div class="d-flex align-center tw:gap-1 tw:justify-center">
              <span class="tw:text-sm tw:font-medium tw:text-slate-600">Parciales</span>
            </div>
            <span class="tw:font-bold tw:text-gray-800 text-center">
              {{ props?.data?.pendingPaymentsCount || 0 }}
            </span>
          </div>
        </VCol>
        <VCol cols="12" md="8">
          <div class="tw:grid tw:grid-cols-1 tw:gap-y-2">
            <div v-for="(item, index) in paymentDetails" :key="index" class="d-flex justify-space-between align-center tw:group">
              <div class="d-flex align-center tw:gap-3 p-4">
                <div class="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:bg-slate-300 group-hover:tw:bg-cyan-500 tw:transition-colors"></div>
                <span class="tw:text-sm tw:font-medium tw:text-slate-600">{{ item.label }}</span>
              </div>
              <span class="tw:text-sm tw-font-bold tw:text-slate-800 tw:bg-slate-50 tw:px-3 tw:py-1 tw:rounded-lg">
                {{ item.value }}
              </span>
            </div>
          </div>
          <v-divider class="tw-border-dashed my-2"></v-divider>
          <div class="mx-3">
            <span class="tw:font-medium tw:text-gray-800">Total Pagos</span>
            <div class="d-flex justify-space-between tw:gap-4 text-medium-emphasis text-grey-darken-2">
              <span class="tw:font-semibold text-b">69%</span>
              <span class="tw:font-medium tw:text-gray-800">
                {{ data?.totalPaymentsCount || 0 }}
              </span>
            </div>
            <div class="d-flex justify-space-between tw:gap-4 text-medium-emphasis text-grey-darken-2">
              <v-progress-linear
                :model-value="69"
                color="primary"
                class="tw-bg-amber-400"
                bg-color="#475569"
                bg-opacity="0.2"
                height="7"
                rounded
              ></v-progress-linear>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

<style scoped></style>
