<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { CallTraining } from '@/models/CallsTraining';
import { CallType, CallStatus, CallTypeLabels, CallStatusLabels } from '@/models/CallsTraining';
import { useDisplay } from 'vuetify';

interface props {
  modelValue: boolean;
  callTraining: CallTraining | null;
}

const props = defineProps<props>();

const headers = [
  { title: '', key: 'data-table-expand' },
  { title: 'CREADO POR', value: 'calledBy.name', sortable: true },
  { title: 'FECHA', value: 'date', sortable: true },
  { title: 'TIPO', value: 'type', sortable: true },
  { title: 'ESTADO', value: 'status', sortable: true }
];

const callTypes = Object.values(CallType).map((type) => ({
  label: CallTypeLabels[type],
  value: type
}));

const callStatuses = Object.values(CallStatus).map((status) => ({
  label: CallStatusLabels[status],
  value: status
}));

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancel'): void;
}>();

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const { smAndDown } = useDisplay();
const panelStyle = computed(() => ({
  width: smAndDown.value ? '100vw' : '50vw',
  height: '100vh' // SIEMPRE FULL HEIGHT
}));

const expanded = ref<any[]>([]);
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="
      (val) => {
        emit('update:modelValue', val);
        if (!val) emit('cancel');
      }
    "
    fullscreen
    scrim
  >
    <div class="fullscreen-container">
      <v-card class="rounded-xl panel" :style="panelStyle">
        <VCardTitle class="d-flex flex-shrink-0 align-center text-white bg-primary">
          <Icon icon="mdi:phone" class="mr-2" />
          <span class="text-h6 text-white">Logs de Llamadas</span>
          <v-spacer />
          <v-btn icon variant="text" @click="closeDialog">
            <Icon icon="mdi:close" class="" width="24" />
          </v-btn>
        </VCardTitle>
        <v-card-text class="pa-4 tw:overflow-y-auto tw:flex-grow">
          <v-alert color="default" density="compact" class="pa-4">
            <template #prepend>
              <Icon icon="mdi:user" height="21" class="align-center mr-2 text-primary" />
            </template>
            <v-alert-title class="tw:text-xs text-gray-800 mb-2 text-primary" style="font-size: 18px"> Participante </v-alert-title>
            <v-row>
              <v-col cols="6" class="tw:text-sm">
                <span class="tw:font-semibold">Nombre:</span> {{ props.callTraining?.calledUser?.name || '-' }}
              </v-col>
              <v-col cols="6" class="tw:text-sm">
                <span class="tw:text-sm tw:font-semibold">Entrenamiento:</span> {{ props.callTraining?.training?.name || '' }} -
                {{ props.callTraining?.training?.courseLevelDisplay || '' }}
              </v-col>
            </v-row>
          </v-alert>
          <v-divider class="my-2"></v-divider>
          <v-data-table
            :headers="headers"
            :items="props.callTraining?.callLogs || []"
            v-model:expanded="expanded"
            show-expand
            show-footer="false"
            class="striped-table hover-table"
          >
            <template #item.calledBy.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap">
                <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                  <Icon icon="mdi:account" class="tw:text-gray-600" />
                </div>
                <div>
                  <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                    item.calledBy.name
                  }}</span>
                </div>
              </div>
            </template>
            <template #item.date="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                <Icon icon="mdi:calendar" class="text-primary" />
                <span>{{ item.date }}</span>
              </div>
            </template>
            <template #item.type="{ item }">
              <VChip
                color="primary"
                size="small"
                variant="flat"
                class="!tw:font-normal tw:text-xs !tw:min-w-[80px] tw:bg-green-50 !tw:text-green-700"
              >
                {{ callTypes.find((ct) => ct.value === item.type)?.label || item.type }}
              </VChip>
            </template>
            <template #item.status="{ item }">
              <VChip
                color="warning"
                size="small"
                variant="flat"
                class="!tw:font-normal tw:text-xs !tw:min-w-[80px] tw:bg-green-50 !tw:text-green-700"
              >
                {{ callStatuses.find((cs) => cs.value === item.status)?.label || item.status }}
              </VChip>
            </template>
            <template #expanded-row="{ item }">
              <tr>
                <td style="width: 50px"></td>
                <td :colspan="4" class="pa-4">
                  <div style="font-weight: 500">Descripción</div>

                  <div class="mt-1 text-body-2">
                    {{ item.notes || 'Sin descripción' }}
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<style>
/* Contenedor fullscreen para mantener el panel a la derecha */
.fullscreen-container {
  width: 100vw;
  /* height: 100vh; */
  display: flex;
  justify-content: flex-end; /* Mueve el panel al lado derecho */
}

/* Hover en filas normales */
.striped-table tbody tr:not(.v-data-table__expanded__content):hover,
.striped-table tbody tr:not(.v-data-table__expanded__content):hover + tr.v-data-table__expanded__content {
    background-color: #f7f8f8 !important; 
}

/* Hover sobre la fila expandida resalta la fila normal anterior */
.striped-table tbody tr.v-data-table__expanded__content:hover,
.striped-table tbody tr.v-data-table__expanded__content:hover ~ tr:not(.v-data-table__expanded__content) {
    background-color: #f7f8f8 !important;
}

thead tr {
  background-color: #f8fafc !important;
} 

th {
  font-weight: 600 !important;
  color: #374151 !important;
  font-size: 0.75rem;
}

.panel {
  display: flex;
  flex-direction: column;
}

.tw\:overflow-y-auto {
  overflow-y: auto !important;
}

.tw\:flex-grow {
  flex-grow: 1 !important;
  min-height: 0; 
}
</style>
