<script setup lang="ts">
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TeamWriteModel, Training } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import useVuelidate from '@vuelidate/core';
import { and, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';

const { saveTeamMutations } = useAdminTeamMutations();
const { criteriaMutations, isParticipantsError, isParticipantsLoading, participants, refetchParticipants } = useParticipants();
const { isError, isFetching, trainers } = useTrainer();
const { isTrainingError, isTrainingsLoading, trainings } = useTrainings();

const team = ref<TeamWriteModel>({} as TeamWriteModel);

const rules = {
  id: { required },
  name: { required },
  training: { required },
  users: { required }
};

const validator = useVuelidate(rules, team);

const onSaveTeam = () => {
  saveTeamMutations.mutate(team.value);
};

watch(saveTeamMutations.isError, () => {
  if (saveTeamMutations.isError.value) {
    const error = saveTeamMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveTeamMutations.isSuccess, () => {
  if (saveTeamMutations.isSuccess.value) {
    alert('gut');
  }
});
</script>

<template>
  <VTextField placeholder="name" v-model="team.name" />
  <VSelect multiple :items="participants" item-title="name" return-object placeholder="participantes" v-model="team.users" />
  <VSelect :items="trainers" item-title="name" item-value="id" placeholder="entrenador" v-model="team.trainer" />
  <VSelect :items="trainings" item-title="name" item-value="id" placeholder="entrenamiento" v-model="team.training" />
  <VBtn @click="onSaveTeam">guardar</VBtn>
</template>

<style scoped></style>
