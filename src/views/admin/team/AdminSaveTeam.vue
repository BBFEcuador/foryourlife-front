<script setup lang="ts">
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { TeamWriteModel } from '@/models/team';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ref } from 'vue';

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
</script>

<template>
  <VTextField placeholder="name" v-model="team.name" />
  <VSelect multiple :items="participants" item-title="name" return-object placeholder="participantes" />
  <VSelect :items="trainers" item-title="name" return-object placeholder="entrenador" />
  <VSelect :items="trainings" item-title="name" return-object placeholder="entrenamiento" />
</template>

<style scoped></style>
