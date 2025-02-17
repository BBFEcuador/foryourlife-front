<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TeamWriteModel, Training } from '@/models/Team';
import type { Trainers } from '@/models/Trainers';
import { showErrorToast } from '@/service/sweetAlert';
import useVuelidate from '@vuelidate/core';
import { and, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import AdminParticipants from '../participants/AdminParticipants.vue';

const { saveTeamMutations } = useAdminTeamMutations();
const { criteriaMutations, isParticipantsError, isParticipantsLoading, participants, refetchParticipants } = useParticipants();
const { isError, isFetching, trainers } = useTrainer();
const { isTrainingError, isTrainingsLoading, trainings } = useTrainings();

const team = ref<TeamWriteModel>({} as TeamWriteModel);

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);

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

const selectedTrainer = (trainer: Trainers) => {
  team.value.trainer = trainer.id;
  console.log('Entrenador seleccionado:', trainer);
};
</script>

<template>
  <BaseBreadcrumb :title="'Crear Equipo'" :breadcrumbs="breadcrumbs" />
  <v-row>
    <v-col cols="12" md="8" class="py-1">
      <v-card elevation="0" class="mb-6">
        <v-card-text>
          <h5 class="text-h5 mb-8">Equipo</h5>
          <v-row class="d-flex flex-cols gap-3">
            <v-col cols="12">
              <v-label class="font-weight-medium mb-2">Nombre del Equipo <span
                  class="text-error ms-1">*</span></v-label>
              <VTextField type="text" placeholder="Nombre Name" variant="outlined" hide-details v-model="team.name">
              </VTextField>
              <p class="textSecondary text-12 mt-1">Ingresa el nombre que va a tener el equipo.</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col cols="12" md="6" class="py-1">
          <v-card elevation="0" class="mb-6">
            <v-card-text>
              <h5 class="text-h5">Entrenador</h5>
              <v-virtual-scroll :items="trainers" :item-height="3" height="150">
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" @click="selectedTrainer(item)"
                    :class="{ 'text-primary': team.trainer === item.id }">
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-virtual-scroll>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="py-1">
          <v-card elevation="0" class="mb-6">
            <v-card-text>
              <h5 class="text-h5">Entrenamiento</h5>
              <VSelect :items="trainings" item-title="name" item-value="id" placeholder="entrenamiento"
        v-model="team.training" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card elevation="0" class="mb-6">
            <v-card-text>
              <h5 class="text-h5 mb-8">Participantes</h5>
              <VSelect multiple :items="participants" item-title="name" return-object placeholder="participantes"
        v-model="team.users" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4" class="py-1">
      <v-card elevation="0" class="mb-6 h-max" :height="600">
        <v-card-text>
          <h5 class="text-h5">Vista Previa</h5>
          <VSpacer/>
          <VBtn @click="onSaveTeam">guardar</VBtn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.selected-item {
  background-color: #e0f7fa;
  /* Color de fondo cuando está seleccionado */
}
</style>
