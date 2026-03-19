<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { LifeWeekendAssistants } from '@/models/DashboardFocus';
import { computed, onMounted, ref } from 'vue';

interface Props {
  data: LifeWeekendAssistants;
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

const totals = computed(() => {
  // totales de assistants
  const data = props.data ?? {};
  const totalEnrolled = Object.values(data).reduce((sum, item) => sum + (item.enrolled ?? 0), 0);
  const totalAssistant = Object.values(data).reduce((sum, item) => sum + (item.assistant ?? 0), 0);
  const percentage = totalEnrolled > 0 ? Math.round((totalAssistant * 100) / totalEnrolled) : 0;
  return { assistant: totalAssistant, enrolled: Math.round(totalEnrolled), percentage };
});
</script>

<template>
  <v-card variant="flat" elevation="1" class="" rounded="lg" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-group" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Invitados de Fines de Semana</h4>
          <p class="tw:text-sm tw:text-gray-500">Distribución de personas invitadas</p>
        </div>
      </div>
    </v-card-text>
    <v-card-item class="pt-1">
      <div v-for="(item, key) in data" :key="key" cols="12" class="mb-3">
        <span class="tw:font-semibold">{{ key }}</span>
        <div class="d-flex justify-space-between gap-4 text-medium-emphasis mb-1 text-grey-darken-2">
          <span>{{ item.assistant }} / {{ item.enrolled }}</span>
          <span class="tw:font-semibold tw:text-cyan-700">{{ item.percentage }}%</span>
        </div>
        <div class="d-flex justify-space-between gap-4 text-medium-emphasis text-grey-darken-2">
          <v-progress-linear
            :model-value="item.percentage"
            color="tw:text-cyan-600"
            class="tw-bg-amber-400 tw:text-cyan-600"
            bg-color="primary"
            bg-opacity="0.2"
            height="7"
            rounded
          ></v-progress-linear>
        </div>
      </div>
      <v-alert  class="mt-6 tw:bg-cyan-50">
        <div class="d-flex justify-space-between gap-4  mb-1 text-grey-darken-2">
          <span class="tw:font-semibold">Total</span>
          
          <span class="tw:font-semibold tw:text-cyan-700">{{ totals.percentage }} %</span>
        </div>
        <div class="d-flex justify-space-between tw:gap-4 text-medium-emphasis text-grey-darken-2 tw:content-center">
          <v-progress-linear
            :model-value="totals.percentage"
            color="tw:text-cyan-600"
            class="tw-bg-amber-400 tw:text-cyan-600 tw:mt-auto tw:mb-auto"
            bg-color="primary"
            bg-opacity="0.2"
            height="7"
            rounded
          ></v-progress-linear>
          <span class="tw:text-nowrap">{{ totals.assistant }} / {{ totals.enrolled }}</span>
        </div>
      </v-alert>
    </v-card-item>
  </v-card>
</template>

<style lang="scss" scoped>
.tw\:bg-cyan-50 {
  background-color: var(--tw-color-cyan-50) !important;
}
</style>
