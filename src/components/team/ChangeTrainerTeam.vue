<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Team } from '@/models/Participants';
import type { AxiosError } from 'axios';
import { showErrorToast } from '@/service/sweetAlert';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import type { Trainers } from '@/models/Trainers';

interface Props {
  modelValue: boolean;
  isLoading: boolean;
  team: Team;
}
const props = withDefaults(defineProps<Props>(), {
  isLoading: false
});

const searchTrainer = ref('');
const isOpen = ref(false);
const createDefaultFormData = (): FormData => ({
  id: ''
});

const formData = ref<FormData>(createDefaultFormData());
const selectedTrainer = ref<string>('');
interface FormData {
  id: string;
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', trainerId: string): void;
  (e: 'cancel'): void;
}>();

const trainingId = computed(() => props.team?.training?.id || '');
const { availableTrainerMutation } = useTrainerMutations();

const trainers = ref<Trainers[]>([]);
watch(
  trainingId,
  (id) => {
    if (id) {
      availableTrainerMutation.mutate(id);
    }
  },
  { immediate: true }
);
watch(availableTrainerMutation.isError, () => {
  if (availableTrainerMutation.isError.value) {
    const error = availableTrainerMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(availableTrainerMutation.isSuccess, () => {
  if (availableTrainerMutation.isSuccess.value) {
    const response = availableTrainerMutation.data.value;
    if (response) {
      trainers.value = response;
    }
  }
});

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      formData.value = {
        id: selectedTrainer.value || ''
      };
    } else {
      formData.value = createDefaultFormData();
      selectedTrainer.value = '';
    }
  },
  { immediate: true }
);

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const saveChangeTrainer = async () => {
  emit('save', selectedTrainer.value);
};

const filteredTrainers = computed(() => {
  if (!searchTrainer.value) return trainers.value;

  return trainers.value.filter((trainer) => trainer.name.toLowerCase().includes(searchTrainer.value.toLowerCase()));
});

const filteredAvailableTrainers = computed(() => {
  return filteredTrainers.value.filter((p) => p.id !== props.team?.trainer?.id);
});
</script>
<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center bg-primary">
        <Icon class="mr-2" icon="mdi:account-switch" height="20" />
        <span class="text-h6 text-white">Cambiar Entrenador</span>
        <v-spacer />
        <v-btn icon variant="text" @click="closeDialog">
          <Icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0 flex-grow-1 tw:overflow-y-auto">
        <v-form ref="form" @submit.prevent="saveChangeTrainer">
          <v-card-text class="pa-0">
            <v-toolbar class="px-3 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50 ma-0" flat v-motion>
              <VTextField
                v-model="searchTrainer"
                placeholder="Buscar..."
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
            </v-toolbar>
            <div class="pl-4">
              <v-radio-group v-model="selectedTrainer" hide-details>
                <v-radio v-for="p in filteredAvailableTrainers" :key="p.id" :label="p.name" :value="p.id"></v-radio>
              </v-radio-group>
            </div>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
        <v-spacer />
        <v-btn color="error" variant="flat" :disabled="isLoading" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="flat" :loading="isLoading" @click="saveChangeTrainer"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
