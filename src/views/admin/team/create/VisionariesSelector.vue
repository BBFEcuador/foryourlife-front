<script setup lang="ts">
import VisionaryList from '@/components/visionaries/VisionaryList.vue';
import useVisionarymutations from '@/composables/admin/visionaries/useVisionarymutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TeamWriteModel } from '@/models/Team';
import type { Visionary } from '@/models/Visionary';
import { showErrorToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: TeamWriteModel;
}

const props = defineProps<props>();
const emit = defineEmits(['back', 'next']);
const { availableVisionaryMutations } = useVisionarymutations();
const visionaries = ref<Visionary[]>([]);

onBeforeMount(() => {
    availableVisionaryMutations.mutate({
    endDate: props.team.trainingObj.endDate,
    startDate: props.team.trainingObj.startDate
  });
});
watch(availableVisionaryMutations.isError, () => {
  if (availableVisionaryMutations.isError.value) {
    const error = availableVisionaryMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(availableVisionaryMutations.isSuccess, () => {
  if (availableVisionaryMutations.isSuccess.value) {
    const response = availableVisionaryMutations.data.value;
    if (response) {
        visionaries.value = response;
    }
  }
});
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-4">
      <Icon icon="mdi-eye" size="28" class="mr-2" color="primary" />
      <h4 class="text-h4">Visionarios</h4>
    </div>
    <v-divider class="mb-4"></v-divider>
    <div v-if="team.visionaries.length > 0" class="mb-4">
      <div class="text-subtitle-1 mb-2">Visionarios Seleccionados:</div>
      <v-chip-group>
        <v-chip v-for="visionary in team.visionaries" :key="visionary.user.id" color="deep-purple" variant="outlined" class="mr-2">
          {{ visionary.user.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <VisionaryList :team="team" :visionaries="visionaries" :is-visionariesloading="availableVisionaryMutations.isPending.value" />
    <v-card-actions class="mt-6">
      <v-btn variant="outlined" @click="emit('back')">
        <Icon icon="mdi-arrow-left" />
        Atrás
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="emit('next')">
        <Icon icon="mdi-arrow-right" />
        Siguiente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
