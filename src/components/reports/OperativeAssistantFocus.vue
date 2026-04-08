<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';
import useFocusOperativeAssistantReport from '@/composables/admin/reports/useFocusOperativeAssistantReport.ts';
import WeeklyPaymentFocusStats from './WeeklyPaymentFocusStats.vue';
import OperativeAssistantPaymentsFocus from './OperativeAssistantPaymentsFocus.vue';

interface props {
  trainingId: string;
}
const props = defineProps<props>();
const { data, isLoading, isError } = useFocusOperativeAssistantReport(props.trainingId);
const cards = ref([
  {
    title: 'Px Iniciales',
    value: computed(() => data.value?.weekendFocusReport?.initialParticipantsCount ?? 0),
    icon: 'mdi-cash-multiple',
    color: 'orange'
  },
  {
    title: 'Px Reales',
    value: computed(() => data.value?.weekendFocusReport?.realParticipantsCount ?? 0),
    icon: 'mdi-account-group-outline',
    color: 'primary'
  },
  {
    title: 'Px Desertores',
    value: computed(() => data.value?.weekendFocusReport?.deserterParticipantsCount ?? 0),
    percentage: computed(() => Number(data.value?.weekendFocusReport?.desertionPercentage ?? 0).toFixed(2)),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  },
  {
    title: 'Declaración',
    value: computed(() => data.value?.weekendFocusReport?.declarationsCount ?? 0),
    percentage: computed(() => Number(data.value?.weekendFocusReport?.declarationPercentage ?? 0).toFixed(2)),
    icon: 'mdi-calendar-check-outline',
    color: 'green'
  }
]);
</script>

<template>
  <v-fade-transition mode="out-in">
    <div v-if="isLoading" class="text-center pa-4">
      <v-card elevation="0" rounded="xl">
        <v-card-text>
          <v-progress-circular indeterminate color="primary" size="80" width="8"> </v-progress-circular>
          <p class="text-caption mt-2">Cargando datos...</p>
        </v-card-text>
      </v-card>
    </div>
    <div v-else-if="isError" class="text-center pa-4">
      <v-card variant="flat" border class="rounded-xl text-center pa-8">
        <div class="d-flex align-center justify-center">
          <Icon icon="solar:danger-bold-duotone" class="text-warning text-center mb-4" height="48" />
        </div>
        <p class="text-h6">Error al cargar los datos</p>
      </v-card>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="12" md="6" sm="12">
          <div class="text-overline text-primary mb-1 mt-3">Entrenamiento</div>
          <h2 class="text-h4 font-weight-bold text-grey-darken-4">
            {{ data?.trainingName }}
          </h2>
        </v-col>
        <v-col cols="12" md="6" sm="12" class="d-flex align-end justify-end">
          <slot name="actions"></slot>
        </v-col>
      </v-row>

      <div class="mb-4 d-flex align-center mt-3 flex-wrap ga-2">
        <div class="d-flex align-center ga-4 text-medium-emphasis flex-wrap">
          <div class="d-flex align-center ga-1">
            <Icon icon="mdi-signal" height="20" color="primary" class="text-primary" />
            <p class="tw:text-sm tw:text-gray-500 mb-0">
              {{ data?.courseLevel }}
            </p>
          </div>
          <v-divider vertical length="20" class="d-none d-md-flex"></v-divider>
          <div class="d-flex align-center ga-1 tw:text-nowrap">
            <Icon icon="mdi-account-tie" height="20" color="primary" class="text-primary" />
            <p class="tw:text-sm tw:text-gray-500 mb-0">{{ data?.trainerName }}</p>
          </div>
        </div>
        <v-divider class="flex-grow-1 ms-4"></v-divider>
      </div>

      <VRow class="tw-gap-4 mb-2">
        <v-slide-y-transition group appear>
          <v-col v-for="card in cards" :key="card.title" cols="12" md="3" sm="6">
            <v-alert border="start" border-color="primary" elevation="1" class="tw:bg-white pb-2 h-100">
              <div>
                <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">{{ card.title }}</h4>
                <h3 class="text-h3 heading text-primary">
                  {{ card.value }}
                </h3>
                <div v-if="card.title == 'Px Desertores'" class="text-end mt-1">
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" class="font-weight-semibold" style="font-size: 0.75rem">
                        <Icon icon="mdi-walk" class="mr-2" width="16" />
                        {{ card.percentage }} %
                      </v-chip>
                    </template>
                    Porcentaje de desertores
                  </v-tooltip>
                </div>
                <div v-else-if="card.title == 'Declaración'" class="text-end mt-1">
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" class="font-weight-semibold" style="font-size: 0.75rem">
                        <Icon icon="mdi-check" class="mr-2" width="16" />
                        {{ card.percentage }} %
                      </v-chip>
                    </template>
                    Porcentaje de declaraciones
                  </v-tooltip>
                </div>
              </div>
            </v-alert>
          </v-col>
        </v-slide-y-transition>
      </VRow>
      <VRow class="fill-height">
        <VCol cols="12" md="4" class="d-flex flex-column">
          <v-scroll-x-transition appear>
            <VCard variant="flat" elevation="1" rounded="lg" class="d-flex flex-column">
              <VCardItem class="pa-4 flex-grow-1 d-flex flex-column justify-center">
                <div class="tw:flex tw:items-center tw:gap-3 mb-6">
                  <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
                    <Icon icon="mdi-account-group" height="20" class="tw:text-cyan-600" />
                  </div>
                  <div>
                    <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resumen de Equipo</h4>
                    <p class="tw:text-sm tw:text-gray-500">Resumen de visionarios, capitanes y staffs</p>
                  </div>
                </div>

                <VRow no-gutters class="align-center">
                  <VCol cols="12" class="">
                    <div class="d-flex flex-column">
                      <span class="tw:text-2xl tw:font-bold tw:text-gray-800 text-center">
                        {{ data?.weekendFocusReport?.visionariesCount || 0 }}
                      </span>
                      <div class="d-flex align-center ga-1 mb-1 tw:justify-center">
                        <Icon icon="mdi-account-star" height="16" class="text-secondary" />
                        <span class="tw:text-sm tw:font-medium tw:text-slate-600">Visionarios</span>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="5">
                    <div class="d-flex flex-column">
                      <span class="tw:font-bold tw:text-gray-800 text-center">
                        {{ data?.weekendFocusReport?.captainsCount || 0 }}
                      </span>
                      <div class="d-flex align-center ga-1 mb-1 tw:justify-center">
                        <Icon icon="mdi-shield-star" height="16" class="tw:text-amber-500" />
                        <span class="tw:text-sm tw:font-medium tw:text-slate-600 text-center">Capitanes</span>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="2" class="d-flex justify-center">
                    <VDivider vertical length="30" class="tw-border-gray-100" />
                  </VCol>

                  <VCol cols="5">
                    <div class="d-flex flex-column">
                      <span class="tw:font-bold tw:text-gray-800 text-center">
                        {{ data?.weekendFocusReport?.staffsCount || 0 }}
                      </span>
                      <div class="d-flex align-center ga-1 mb-1 tw:justify-center">
                        <Icon icon="mdi-account-wrench" height="16" class="tw:text-blue-400" />
                        <span class="tw:text-sm tw:font-medium tw:text-slate-600">Staff</span>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </VCardItem>
            </VCard>
          </v-scroll-x-transition>
        </VCol>
        <VCol cols="12" md="8" class="d-flex flex-column">
          <v-scroll-x-transition appear>
            <OperativeAssistantPaymentsFocus class="h-100" :is-loading="isLoading" :data="data.operativeFocusPayments" />
          </v-scroll-x-transition>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <v-fade-transition appear>
            <WeeklyPaymentFocusStats
              :data="data?.operativeFocusPayments"
              :is-loading="isLoading"
              :real-participants-count="data?.weekendFocusReport?.realParticipantsCount ?? 0"
            />
          </v-fade-transition>
        </VCol>
      </VRow>
    </div>
  </v-fade-transition>
</template>

<style lang="scss" scoped>
.tw\:bg-white {
  background-color: var(--tw-color-white) !important /* #fff = #ffffff */;
}
.half-circle {
  transform: rotate(-90deg);
  clip-path: inset(0 0 50% 0);
}
</style>
