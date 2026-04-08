<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';
import type { WeekendReport } from '@/models/OperativeAssistantLife';
import useLifeOperativeAssistantReport from '@/composables/admin/reports/useLifeOperativeAssistantReport';
import OperativeAssistantCallsInfo from './OperativeAssistantCallsInfo.vue';

interface Props {
  trainingId: string;
  trainingName: string;
}
const props = defineProps<Props>();
const { data, isLoading, isError } = useLifeOperativeAssistantReport(props.trainingId);
console.log('name:', props.trainingName);
const tab = ref('tab-'+props.trainingName);

const tabs = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return [];

  return data.value.map((item, index) => ({
    title: item.trainingName || `Entrenamiento ${index + 1}`,
    // value: `tab-${index}`,
    value: `tab-${item.trainingName}`,
    report: item
  }));
});

const getCardsByReport = (weekendReport?: WeekendReport) => {
  return [
    {
      title: 'Inicio',
      total: weekendReport?.initialTotalCount ?? 0,
      participants: weekendReport?.initialParticipantsCount ?? 0,
      ml: weekendReport?.initialMasterLifesCount ?? 0
    },
    {
      title: 'Reales',
      total: weekendReport?.realTotalCount ?? 0,
      participants: weekendReport?.realParticipantsCount ?? 0,
      ml: weekendReport?.realMasterLifesCount ?? 0
    },
    {
      title: 'Declaración',
      total: weekendReport?.totalDeclarationsCount ?? 0,
      participants: weekendReport?.participantsDeclarationsCount ?? 0,
      ml: weekendReport?.masterLifesDeclarationsCount ?? 0
    },
    {
      title: 'Enrolamiento',
      isSpecial: true,
      total: weekendReport?.totalEnrollmentsCount ?? 0,
      indexDeclaration: weekendReport?.declarationIndex ?? 0,
      indexReal: weekendReport?.realIndex ?? 0
    }
  ];
};
</script>

<template>
  <v-fade-transition mode="out-in">
    <div v-if="isLoading" class="text-center pa-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-caption mt-4">Cargando dashboard...</p>
    </div>

    <div v-else-if="isError" class="text-center pa-12">
      <v-card variant="flat" border class="rounded-xl text-center pa-8">
        <div class="d-flex align-center justify-center ">
          <Icon icon="solar:danger-bold-duotone" class="text-warning text-center mb-4" height="48" />
        </div>
        <p class="text-h6">Error al cargar los datos</p>
      </v-card>
    </div>

    <div v-else>
      <v-tabs v-model="tab" align-tabs="center" color="primary" class="border-b mt-2">
        <v-tab v-for="item in tabs" :key="item.value" :value="item.value" class="text-none font-weight-bold">
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" class="mt-6">
        <v-tabs-window-item v-for="item in tabs" :key="item.value" :value="item.value">
          <div class="mb-4 d-flex align-center flex-wrap ga-2">
            <div class="d-flex align-center ga-4 text-medium-emphasis flex-wrap">
              <div class="d-flex align-center ga-1">
                <Icon icon="mdi-signal" height="20" color="primary" class="text-primary" />
                <p class="tw:text-sm tw:text-gray-500 mb-0">
                  {{ item?.report.courseLevel }}
                </p>
              </div>
              <v-divider vertical length="20" class="d-none d-md-flex"></v-divider>
              <div class="d-flex align-center ga-1 tw:text-nowrap">
                <Icon icon="mdi-account-tie" height="20" color="primary" class="text-primary" />
                <p class="tw:text-sm tw:text-gray-500 mb-0">{{ item?.report.trainerName }}</p>
              </div>
            </div>
            <v-divider class="flex-grow-1 ms-4"></v-divider>
          </div>

          <VRow class="mb-4">
            <VCol v-for="card in getCardsByReport(item.report.weekendReport)" :key="card.title" cols="12" sm="6" md="3">
              <v-alert border="start" border-color="primary" elevation="1" class="tw:bg-white h-100">
                <div>
                  <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">{{ card.title }}</h4>
                  <h3 class="text-h3 heading text-primary">
                    {{ card.total }}
                  </h3>
                  <template v-if="!card.isSpecial">
                    <div class="mb-4">
                      <p class="tw:text-sm text-grey">Total General</p>
                    </div>
                    <div class="d-flex ga-2 tw:justify-end">
                      <VChip size="small" color="primary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <Icon icon="mdi-account-group" height="16" class="text-primary" />
                          <span class="text-caption font-weight-bold mr-1">Part:</span>
                          <span class=" ">{{ card.participants }}</span>
                        </div>
                      </VChip>
                      <VChip size="small" color="secondary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <Icon icon="mdi-account-group" height="16" class="text-secondary" />
                          <span class="text-caption font-weight-bold mr-1">ML:</span>
                          <span class=" ">{{ card.ml }}</span>
                        </div>
                      </VChip>
                    </div>
                  </template>

                  <template v-else>
                    <div class="mb-4">
                      <p class="tw:text-sm text-grey">Total General</p>
                    </div>
                    <div class="d-flex ga-2 tw:justify-end">
                      <VChip size="small" color="primary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class="text-caption font-weight-bold mr-1">idxDecl:</span>
                          <span class=" ">{{ card.indexDeclaration }}</span>
                        </div>
                      </VChip>
                      <VChip size="small" color="secondary" variant="tonal">
                        <div class="d-flex align-center tw:justify-center ga-1">
                          <span class="text-caption font-weight-bold mr-1">idxReal:</span>
                          <span class=" ">{{ card.indexReal }}</span>
                        </div>
                      </VChip>
                    </div>
                  </template>
                </div>
              </v-alert>
            </VCol>
          </VRow>
        </v-tabs-window-item>
      </v-tabs-window>

      <v-scroll-x-transition appear>
        <OperativeAssistantCallsInfo :is-loading="isLoading" :data="data" />
      </v-scroll-x-transition>
    </div>
  </v-fade-transition>
</template>

<style scoped>
.tw\:bg-white {
  background-color: var(--tw-color-white) !important /* #fff = #ffffff */;
}
</style>
