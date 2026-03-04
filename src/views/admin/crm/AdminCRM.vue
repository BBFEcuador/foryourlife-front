<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import {Icon} from '@iconify/vue/dist/iconify.js';
import {computed, ref} from 'vue';
import useTrainings from '@/composables/admin/training/useTrainings';
import useCallsByTraining from '@/composables/admin/crm/useCallsByTraining';
import type {TrainingData} from '@/models/Training';
import {CallStatus, CallStatusLabels, CallType, CallTypeLabels, type CallTraining} from '@/models/CallsTraining';

import CreateCallLog from '@/components/crm/CreateCallLog.vue';
import SeeCallsLog from '@/components/crm/SeeCallsLog.vue';

const breadcrumbs = ref([{ title: 'CRM', disabled: false, href: '#' }]);

const headers = [
  { title: 'Participante', value: 'calledUser.name', sortable: true },
  { title: 'Teléfono', value: 'calledUser.phone', sortable: true },
  { title: 'Correo', value: 'calledUser.email', sortable: true },
  // { title: 'Estado', value: 'isActive', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

// Entrenamiento seleccionado
const selectedTraining = ref<TrainingData | null>(null);
const selectedCallType = ref<CallType | null>(null);
const selectedCallStatus = ref<CallStatus | null>(null);
const trainingId = ref('');

// Cargar entrenamientos
const { trainings, debouncedSearch, loadMoreTrainings, hasMoreTrainings, isLoadingMore } = useTrainings();

// Cargar llamadas según entrenamiento
const {
  calls, // <-- lista reactiva
  selectedCallTraining, // <-- mantenido
  refetchCalls
} = useCallsByTraining(trainingId);

const filteredCalls = computed(() => {
  if (!calls.value) return [];
  
  return calls.value.filter(call => {
    // Filter by Type
    const matchesType = !selectedCallType.value || (call.callLogs && call.callLogs.some(log => log.type === selectedCallType.value));
    
    // Filter by Status
    const matchesStatus = !selectedCallStatus.value || (call.callLogs && call.callLogs.some(log => log.status === selectedCallStatus.value));
    
    return matchesType && matchesStatus;
  });
});

// Cuando cambia el training, automáticamente hace fetch (por enabled)
const handleParticipantChange = (training: TrainingData) => {
  selectedTraining.value = training;
  trainingId.value = training?.id ?? '';
};

// Buscador
const search = ref('');
const searchClient = (s: string) => {
  debouncedSearch.value = s;
};

const showCreateCallLog = ref(false);
const showSeeCallLog = ref(false);

// Crear log
const createCallLog = (call: CallTraining) => {
  selectedCallTraining.value = { ...call };
  showCreateCallLog.value = true;
};

// Ver logs
const seeCallLog = (call: CallTraining) => {
  selectedCallTraining.value = { ...call };
  showSeeCallLog.value = true;
};
</script>

<template>
  <BaseBreadcrumb :title="'CRM'" :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-item class="pa-5 text-primary" style="background-color: #f0eff4">
          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5" style="line-height: 1.57">
              <div class="d-flex tw:items-center">
                <Icon icon="mdi-teach" class="mr-2" />
                <div>Entrenamientos</div>
              </div>
            </v-card-title>
          </div>
        </v-card-item>
        <v-card-item class="mt-0 pt-2 pb-5">
          <label class="tw-whitespace-normal tw-block">Seleccione un entrenamiento</label>
          <div class="d-sm-flex align-center justify-space-between mt-3 tw:gap-4">
            <VCombobox
              v-model="selectedTraining"
              :items="trainings"
              item-title="name"
              item-value="id"
              variant="outlined"
              :placeholder="trainings.length > 0 ? 'Seleccionar Entrenamiento' : 'No hay entrenamientos disponibles'"
              return-object
              hide-details
              @update:search="searchClient"
              @update:model-value="handleParticipantChange"
              class="tw:w-full"
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

            <VSelect
              v-model="selectedCallType"
              :items="Object.keys(CallTypeLabels).map(key => ({ title: CallTypeLabels[key as CallType], value: key }))"
              label="Tipo de Llamada"
              variant="outlined"
              clearable
              hide-details
              class="tw:w-full"
            />

            <VSelect
              v-model="selectedCallStatus"
              :items="Object.keys(CallStatusLabels).map(key => ({ title: CallStatusLabels[key as CallStatus], value: key }))"
              label="Estado de Llamada"
              variant="outlined"
              clearable
              hide-details
              class="tw:w-full"
            />
          </div>
        </v-card-item>
        <v-card-item class="pa-5 text-primary" style="background-color: #f0eff4">
          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5" style="line-height: 1.57">
              <div class="d-flex tw:items-center">
                <Icon
                  icon="mdi-account-group"
                  class="mr-2"
                />
                <div>Participantes</div>
              </div>
            </v-card-title>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <v-data-table :headers="headers" :search="search" :items="filteredCalls" :items-per-page="10">
            <template v-slot:top>
              <v-toolbar
                class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
                flat
                v-motion
                :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }"
                :delay="200"
                :duration="250"
              >
                <VTextField
                  v-model="search"
                  placeholder="Buscar Participante..."
                  variant="outlined"
                  density="compact"
                  class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                  clearable
                  hide-details
                >
                  <template #prepend-inner>
                    <div class="tw:relative">
                      <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                      <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                    </div>
                  </template>
                </VTextField>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template #item.calledUser.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap">
                <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                  <Icon icon="mdi:account" class="tw:text-gray-600" />
                </div>
                <div>
                  <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                    item.calledUser.name
                  }}</span>
                </div>
              </div>
            </template>
            <template #item.calledUser.email="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                <Icon icon="mdi:email" class="tw:text-cyan-500" />
                <span>{{ item.calledUser.email }}</span>
              </div>
            </template>
            <template #item.calledUser.phone="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                <Icon icon="mdi:phone" class="tw:text-indigo-600" />
                <span>{{ item.calledUser.phone }}</span>
              </div>
            </template>
            <template #item.actions="{ item }">
              <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-nowrap">
                <VBtn
                  icon
                  variant="text"
                  color="success"
                  height="38"
                  class="!tw:bg-green-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-green-100 tw:transition-all group"
                  v-tooltip="'Registrar Llamada'"
                  @click="createCallLog(item)"
                >
                  <div class="tw:relative">
                    <Icon icon="mdi:phone-plus" class="tw:transition-transform group-hover:tw:scale-110" />
                    <div
                      class="tw:absolute tw:inset-0 tw:bg-green-400 tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"
                    ></div>
                  </div>
                </VBtn>
                <VBtn
                  icon
                  variant="text"
                  color="warning"
                  height="38"
                  class="!tw:bg-green-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-green-100 tw:transition-all group"
                  v-tooltip="'Ver Logs Llamadas'"
                  @click="seeCallLog(item)"
                >
                  <div class="tw:relative">
                    <Icon icon="mdi:text-box-search-outline" class="tw:transition-transform group-hover:tw:scale-110" />
                    <div
                      class="tw:absolute tw:inset-0 tw:bg-orange-400 tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"
                    ></div>
                  </div>
                </VBtn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <CreateCallLog
    :model-value="showCreateCallLog"
    :call-training="selectedCallTraining"
    @cancel="showCreateCallLog = false"
    @call-log-created="refetchCalls()"
  />
  <SeeCallsLog :model-value="showSeeCallLog" :call-training="selectedCallTraining" @cancel="showSeeCallLog = false" />
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
