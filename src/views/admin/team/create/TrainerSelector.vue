<script setup lang="ts">
import TrainerCarousel from '@/components/trainers/TrainerCarousel.vue';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TeamWriteModel } from '@/models/Team';
import type { Trainers } from '@/models/Trainers';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: TeamWriteModel;
}

const props = defineProps<props>();

const emit = defineEmits(['back', 'next']);

const { availableTrainerMutation } = useTrainerMutations();
const trainers = ref<Trainers[]>([]);

const onTrainerSelected = (trainer: Trainers) => {
  props.team.trainerObj = trainer;
  props.team.trainer = trainer.id;
};

onBeforeMount(() => {
  availableTrainerMutation.mutate({
    endDate: props.team.trainingObj.endDate,
    startDate: props.team.trainingObj.startDate
  });
});
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
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-4">
      <Icon icon="mdi-account-tie" size="28" class="mr-2" color="primary" />
      <h4 class="text-h4">Entrenador</h4>
    </div>
    <v-divider class="mb-4"></v-divider>
    <p class="text-body-1 mb-6">Selecciona el entrenador conforme a lo seleccionado.</p>

    <v-progress-circular v-if="availableTrainerMutation.isPending.value" indeterminate color="primary"> </v-progress-circular>
    <v-alert v-else-if="availableTrainerMutation.isError.value" type="error" class="mb-4"> Error al cargar los entrenadores </v-alert>
    <TrainerCarousel v-else :trainers="trainers" @trainer-selected="onTrainerSelected" />

    <v-card-actions class="mt-6">
      <v-btn variant="outlined" @click="emit('back')">
        <Icon icon="mdi-arrow-left" />
        Atrás
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="emit('next')" :disabled="!team.trainer">
        <Icon icon="mdi-arrow-right" />
        Siguiente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
