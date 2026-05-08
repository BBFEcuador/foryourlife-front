<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Icon } from '@iconify/vue';
import useVuelidate from '@vuelidate/core';
import { email, numeric, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import type { TrainingData } from '@/models/Training';
import useTrainings from '@/composables/admin/training/useTrainings';
import StatementsByTraining from '@/components/statements/StatementsByTraining.vue';

const breadcrumbs = ref([
  {
    title: 'Declaraciones Focus / Your',
    disabled: false,
    href: '#'
  }
]);

const selectedTraining = ref<TrainingData | null>(null);
const trainingId = ref('');
const nameTraining = ref('');
const { trainings, debouncedSearch: debouncedSearchTrainings, loadMoreTrainings, hasMoreTrainings, isLoadingMore } = useTrainings();

const searchTraining = (s: string) => {
  debouncedSearchTrainings.value = s;
};

const handleTrainingChange = (training: TrainingData) => {
  selectedTraining.value = training;
  trainingId.value = training?.id ?? '';
  console.log('Selected training:', trainingId.value);
  nameTraining.value = training?.name && training?.courseLevelDisplay ? `${training.name} - ${training.courseLevelDisplay}` : '';
};
</script>

<template>
  <BaseBreadcrumb :title="'Declaraciones Focus / Your'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div v-if="checkPermission(PermissionEnum.SEE_STAFF)">
    <v-row>
      <v-col cols="12">
        <UiParentCard title="Listado por entrenamiento">
          <template #action>
            <v-spacer></v-spacer>
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
              hide-details
              :loading="isLoadingMore"
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
          </template>

          <v-alert v-if="!trainingId" variant="tonal" color="primary" class="mt-4">
            <div class="d-flex flex-column align-center">
              <Icon icon="mdi-format-list-checks" height="30" class="mb-2" />
              <span>Por favor, seleccione un entrenamiento para ver sus declaraciones.</span>
            </div>
          </v-alert>
          <StatementsByTraining v-else :trainingId="trainingId" :nameTraining="nameTraining" />
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}
</style>
