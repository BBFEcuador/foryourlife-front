<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { previousTrainingStats } from '@/models/DashboardYour';

interface Props {
  data: previousTrainingStats;
}
const props = defineProps<Props>();
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-calendar-arrow-left" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Entrenamiento Anterior</h4>
          <p class="tw:text-sm tw:text-gray-500">Estadísticas de entrenamiento anterior</p>
        </div>
      </div>
      <div class="mb-4 text-center mt-6">
        <span class="mb-2 tw:font-semibold" style="color: #334155"> Participantes que asisten de jornada </span>
      </div>

      <v-row dense>
        <v-col cols="6" class="text-center">
          <div class="tw:font-semibold text-16">
            <span class="text-primary">{{ props.data.attendeesFromPreviousTraining }}</span>
            <span class="text-caption font-weight-regular"> ({{ props.data.attendeesFromPreviousTrainingPercentage.toFixed(2) }}%) </span>
          </div>
          <div class="text-medium-emphasis">Asistentes</div>
        </v-col>
        <v-divider vertical />
        <v-col cols="6" class="text-center">
          <div class="tw:font-semibold text-16 text-primary">
            {{ props.data.finalPaymentsFromPreviousTraining }}
          </div>
          <div class="text-medium-emphasis">Pagos Finales</div>
        </v-col>
      </v-row>
      <v-divider class="mb-6 mt-6 border-opacity-25"></v-divider>
      <div class="text-center">
        <div class="mb-2 tw:font-semibold" style="color: #334155">Pagos previos Life de asistentes</div>

        <div class="d-flex align-center justify-center">
          <span class="tw:font-semibold text-16 mr-3">
            {{ props.data.previousLifePayments }}
          </span>
          <v-chip color="white" label class="text-primary font-weight-bold">
            <Icon start icon="mdi-trending-up" size="small" class="mr-2"></Icon>
            {{ props.data.finalPaymentsFromPreviousTrainingPercentage.toFixed(2) }}%
          </v-chip>
        </div>
        <div class="text-caption mt-2 opacity-70 italic">Sobre el total de asistentes de jornada</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.text-16 {
  font-size: 16px !important;
  font-family: inherit !important;
}
</style>
