<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, numeric, helpers } from '@vuelidate/validators';
import type { CashBox, Store } from '@/models/CashDrawer';
import type { CallsLogRequest, CallTraining, CallTrainingResponse } from '@/models/CallsTraining';
import { CallType, CallStatus, CallTypeLabels, CallStatusLabels } from '@/models/CallsTraining';
import useCallsLogMutations from '@/composables/admin/crm/useCallsLogMutations';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { adminStore } from '@/stores/adminStore';
import { useDisplay } from 'vuetify';

const store = adminStore();
const userId = store?.user?.user?.id ?? '';

interface props {
  modelValue: boolean;
  callTraining: CallTrainingResponse | null;
}

const props = defineProps<props>();

const callLog = ref<CallsLogRequest>({
  callType: '' as CallType,
  callStatus: '' as CallStatus,
  notes: '',
  calledById: userId,
  date: '',
  callId: ''
} as CallsLogRequest);

const callTypes = Object.values(CallType).map((type) => ({
  label: CallTypeLabels[type],
  value: type
}));

const callStatuses = Object.values(CallStatus).map((status) => ({
  label: CallStatusLabels[status],
  value: status
}));

const { saveCallsLogMutations } = useCallsLogMutations();

const rules = {
  callType: {
    required: helpers.withMessage('El tipo es requerido', required)
  },
  callStatus: {
    required: helpers.withMessage('El estado es requerido', required)
  },
  notes: {
    required: helpers.withMessage('La descripción es requerida', required)
  },
  date: {
    required: helpers.withMessage('La fecha es requerida', required)
  }
};

const v$ = useVuelidate(rules, callLog);

const emit = defineEmits<{
  //   (e: 'save', cashBox: Partial<CashBox>): void;
  (e: 'call-log-created'): void;
  (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const closeDialog = () => {
  isOpen.value = false;
  emit('cancel');
};

watch(
  () => props.modelValue,
  () => {
    isOpen.value = props.modelValue;
  }
);

const handleSubmit = async () => {
  const isFormValid = await v$.value.$validate();

  if (!isFormValid) {
    return;
  }

  try {
    await saveCallsLogMutations.mutateAsync({
      ...callLog.value,
      callId: props.callTraining?.id || '',
      calledById: userId
    });

    toast.success('Llamada creada exitosamente', {
      autoClose: 3000,
      closeButton: true
    });
    emit('call-log-created');

    // Reset form
    callLog.value = {
      callType: '' as CallType,
      callStatus: '' as CallStatus,
      notes: '',
      date: '',
      callId: ''
    } as CallsLogRequest;
    v$.value.$reset();
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Error al crear el equipo';
    toast.error(errorMessage, {
      autoClose: 3000,
      closeButton: true
    });
  }
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card class="rounded-xl">
      <VCardTitle class="d-flex flex-shrink-0 align-center text-white bg-primary">
        <Icon icon="mdi:phone" class="mr-2" />
        <span class="text-h6 text-white">Crear Llamada</span>
        <v-spacer />
        <v-btn icon variant="text" @click="closeDialog">
          <Icon icon="mdi:close" class="" width="24" />
        </v-btn>
      </VCardTitle>
      <v-card-text class="pa-4 flex-grow-1 tw:overflow-y-auto">
        <v-alert color="default" density="compact" class="pa-4">
          <template #prepend>
            <Icon icon="mdi:user" height="21" class="align-center mr-2 text-primary" />
          </template>
          <v-alert-title class="tw:text-xs text-gray-800 mb-2 text-primary" style="font-size: 18px"> Participante </v-alert-title>
          <v-row>
            <v-col cols="6" class="tw:text-sm">
              <span class="tw:font-semibold">Nombre:</span> {{ props.callTraining?.participant?.user?.name || '-' }}
            </v-col>
            <v-col cols="6" class="tw:text-sm">
              <span class="tw:text-sm tw:font-semibold">Entrenamiento:</span> {{ props.callTraining?.training?.name || '' }} -
              {{ props.callTraining?.training?.courseLevelDisplay || '' }}
            </v-col>
          </v-row>
        </v-alert>
        <v-divider class="my-2"></v-divider>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="4">
              <div class="tw:grid tw:gap-y-2 mt-3">
                <label class="tw:text-sm tw:font-medium">Fecha <span class="text-error">*</span></label>
                <VTextField
                  v-model="callLog.date"
                  type="date"
                  label="Seleccione la fecha"
                  :error-messages="v$.date.$errors.map((e: any) => e.$message.toString())"
                  variant="outlined"
                  density="comfortable"
                  required
                ></VTextField>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tw:grid tw:gap-y-2 mt-3">
                <label class="tw:text-sm tw:font-medium">Tipo <span class="text-error">*</span></label>
                <v-select
                  v-model="callLog.callType"
                  :items="callTypes"
                  item-title="label"
                  item-value="value"
                  label="Seleccione"
                  :error-messages="v$.callType.$errors.map((e: any) => e.$message.toString())"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-select>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tw:grid tw:gap-y-2 mt-3">
                <label class="tw:text-sm tw:font-medium">Estado <span class="text-error">*</span></label>
                <v-select
                  v-model="callLog.callStatus"
                  :items="callStatuses"
                  item-title="label"
                  item-value="value"
                  label="Seleccione"
                  :error-messages="v$.callStatus.$errors.map((e: any) => e.$message.toString())"
                  variant="outlined"
                  density="comfortable"
                  required
                >
                </v-select>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="tw:grid tw:gap-y-2 mt-3">
                <label class="tw:text-sm tw:font-medium">Descripción <span class="text-error">*</span></label>
                <v-textarea
                  v-model="callLog.notes"
                  label="Ingrese una descripción"
                  :error-messages="v$.notes.$errors.map((e: any) => e.$message.toString())"
                  @blur="v$.notes.$touch"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-textarea>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog"> Cancelar </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saveCallsLogMutations.isPending.value"
          :disabled="saveCallsLogMutations.isPending.value"
          @click="handleSubmit"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
