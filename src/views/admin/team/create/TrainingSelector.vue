<script setup lang="ts">
import TrainingList from '@/components/trainings/TrainingList.vue';
import useTrainingsMutation from '@/composables/admin/training/useTrainingsMutation';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TeamWriteModel } from '@/models/Team';
import type { TrainingData } from '@/models/Training';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: TeamWriteModel;
}

const props = defineProps<props>();

const emit = defineEmits(['back', 'next']);
const { availableTrainingMutations } = useTrainingsMutation();
const trainings = ref<TrainingData[]>([]);

const onTrainingSelected = (item: TrainingData[]) => {
  console.log(item[0]);
    if (item[0]) {
        props.team.trainingObj = item[0];
        props.team.training = item[0].id;
    }else{
        //@ts-ignore
        props.team.trainingObj = null;
        //@ts-ignore
        props.team.training = null;
    }
};

onBeforeMount(() => {
  availableTrainingMutations.mutate(props.team.lvl);
});

watch(availableTrainingMutations.isError, () => {
  if (availableTrainingMutations.isError.value) {
    const error = availableTrainingMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(availableTrainingMutations.isSuccess, () => {
  if (availableTrainingMutations.isSuccess.value) {
    const response = availableTrainingMutations.data.value;
    if (response) {
      trainings.value = response;
    }
  }
});
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-4">
      <Icon icon="mdi-dumbbell" size="28" class="mr-2" color="primary" />
      <h4 class="text-h4">Entrenamiento</h4>
    </div>
    <v-divider class="mb-4"></v-divider>
    <p class="text-body-1 mb-6">Selecciona el entrenamiento para tu equipo.</p>
    <v-progress-circular v-if="availableTrainingMutations.isPending.value" indeterminate color="primary"></v-progress-circular>
    <v-alert v-else-if="availableTrainingMutations.isError.value" type="error" class="mb-4"> Error al cargar los entrenamientos </v-alert>
    <TrainingList :trainings="trainings" v-else @send-training="onTrainingSelected" />

    <v-card-actions class="mt-6">
      <v-btn variant="outlined" @click="emit('back')">
        <Icon icon="mdi-arrow-left" />
        Atrás
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="emit('next')" :disabled="team.trainingObj == null">
        <Icon icon="mdi-arrow-right" />
        Siguiente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
