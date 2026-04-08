<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { YourRecoveryPaymentStats } from '@/models/DashboardYour';

interface Props {
  data: YourRecoveryPaymentStats;
}
const props = defineProps<Props>();
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-cash-multiple" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Pagos Previos Life</h4>
          <p class="tw:text-sm tw:text-gray-500">Asistentes recuperados y rezagados</p>
        </div>
      </div>
      <div class="pa-1 d-flex align-center justify-center text-center">
        <v-progress-circular
          :model-value="props?.data?.percentage"
          :size="70"
          :width="7"
          color="primary"
          class="mr-4"
        >
          <span class="text-caption font-weight-bold"> {{ props?.data?.percentage?.toFixed(2) }}% </span>
        </v-progress-circular>
        <v-divider vertical class="mx-6" />
         
        <div>
          <span class="tw:font-semibold text-16">
            {{ props?.data?.recoveredWithPreviousLifePayment }}
          </span>
          <div class="text-medium-emphasis">Asistentes</div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.text-16 {
  font-size: 16px !important;
}
</style>
