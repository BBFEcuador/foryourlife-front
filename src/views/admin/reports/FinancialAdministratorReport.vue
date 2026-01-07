<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { TrainingData } from '@/models/Training';
import TeamFinancialReport from '@/components/reports/TeamFinancialReport.vue';
import useReportsMutations from '@/composables/admin/reports/useReportsMutations';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';

const breadcrumbs = ref([{ title: 'Reportes', disabled: false, href: '#' }]);

// Entrenamiento seleccionado
const selectedTraining = ref<TrainingData | null>(null);
const trainingId = ref('');
const nameTraining = ref('');
const courseLevel = ref('');

// const { excelMutation } = useReportsMutations();

// Cargar entrenamientos
const { trainings, debouncedSearch, loadMoreTrainings, hasMoreTrainings, isLoadingMore } = useTrainings();

// Cuando cambia el training, automáticamente hace fetch (por enabled)
const handleTrainingChange = (training: TrainingData) => {
  selectedTraining.value = training;
  trainingId.value = training?.id ?? '';
  courseLevel.value = training?.courseLevelDisplay ?? '';
  nameTraining.value = training?.name && training?.courseLevelDisplay ? `${training.name} - ${training.courseLevelDisplay}` : '';
};

// Buscador
const search = ref('');
const searchTraining = (s: string) => {
  debouncedSearch.value = s;
};

// const onExcelDownload = (training_id: string) => {
//   excelMutation.mutate(training_id, {
//     onSuccess(data, variables, context) {
//       const blob = data;
//       if (!blob) return;
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `reporte.xlsx`;
//       link.click();
//       window.URL.revokeObjectURL(url);
//       toast.success('Reporte generado correctamente');
//     },
//     onError(error, variables, context) {
//       let e = error as AxiosError<ErrorApiResponse>;
//       toast.error(e.response?.data.message ?? 'No se pudo generar el excel');
//     }
//   });
// };
</script>

<template>
  <BaseBreadcrumb :title="'Financiero'" :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-item class="pa-5 text-primary" style="background-color: #f0eff4">
          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5" style="line-height: 1.57">
              <div class="d-flex tw:items-center">
                <Icon icon="mdi-teach" class="mr-2" />
                <div>Entrenamiento</div>
              </div>
            </v-card-title>
          </div>
        </v-card-item>
        <v-card-item class="mt-0 pt-2 pb-0">
          <label class="tw-whitespace-normal tw-block">Seleccione un entrenamiento</label>
          <div class="d-sm-flex align-center justify-space-between mt-3">
            <VCombobox
              v-model="selectedTraining"
              :items="trainings"
              item-title="name"
              item-value="id"
              variant="outlined"
              :placeholder="trainings.length > 0 ? 'Seleccionar Entrenamiento' : 'No hay entrenamientos disponibles'"
              return-object
              @update:search="searchTraining"
              @update:model-value="handleTrainingChange"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="32">
                      <span class="tw:text-white">{{ item.raw.name?.charAt(0) || 'C' }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-subtitle>{{ item.raw?.courseLevelDisplay }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </VCombobox>
            <v-spacer></v-spacer>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <div v-if="nameTraining">
    <v-row>
      <v-col>
        <v-card-item class="pa-5 text-primary" style="background-color: #f0eff4">
          <v-card-title class="text-h5 d-flex align-center justify-space-between" style="line-height: 1.57">
            <div class="d-flex align-center">
              <Icon icon="mdi-account-group" class="mr-2" />
              <div>{{ nameTraining }}</div>
            </div>
            <!-- <v-btn @click="onExcelDownload(trainingId)" color="primary" variant="outlined">
              <Icon icon="mdi-file-excel" height="20" class="mr-2" />
              Reporte
            </v-btn> -->
          </v-card-title>
        </v-card-item>
      </v-col>
    </v-row>
    <TeamFinancialReport
      v-if="selectedTraining && trainingId && selectedTraining.name"
      :key="trainingId"
      :trainingId="trainingId"
      :trainingDataName="selectedTraining.name"
      :courseLevel="courseLevel"
      class="mb-2"
    />
  </div>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
  color: #334155;
  padding: 16px;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: background-color 0.2s ease;
}
</style>
