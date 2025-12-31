<script setup lang="ts">
import ParticipantsSelect from '@/components/participants/ParticipantsSelect.vue';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: TeamWriteModel;
}

const props = defineProps<props>();
  console.log('Props en ParticipantTeamSelector:', props.team.trainingObj);

const emit = defineEmits(['back', 'next']);
const { getByLvlMutation } = useParticipantMutations();
const participant = ref<Participant[]>([]);

onBeforeMount(() => {
  const training = props.team?.trainingObj;
  if (!training) return;
  console.log('Nivel del equipo:', props.team);
  getByLvlMutation.mutate({ lvl: training.courseLevel, ...(training.campus?.id && { campusId: training.campus.id }) });
});
watch(getByLvlMutation.isError, () => {
  if (getByLvlMutation.isError.value) {
    const error = getByLvlMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(getByLvlMutation.isSuccess, () => {
  if (getByLvlMutation.isSuccess.value) {
    const response = getByLvlMutation.data.value;
    if (response) {
      participant.value = response;
    }
  }
});
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-4">
      <Icon icon="mdi-account-group" size="28" class="mr-2" color="primary" />
      <h4 class="text-h4">Participantes</h4>
    </div>
    <v-divider class="mb-4"></v-divider>

    <v-progress-circular v-if="getByLvlMutation.isPending.value" indeterminate color="primary"></v-progress-circular>
    <v-alert v-else-if="getByLvlMutation.isError.value" type="error" class="mb-4"> Error al cargar los participantes </v-alert>
    <ParticipantsSelect v-else :team="team" :participants="participant" />

    <v-card-actions class="mt-6">
      <v-btn variant="outlined" @click="emit('back')">
        <Icon icon="mdi-arrow-left" />
        Atrás
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="emit('next')" :disabled="team.users.length <= 0">
        <Icon icon="mdi-arrow-right" />
        Siguiente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
