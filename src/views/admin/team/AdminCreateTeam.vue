<script setup lang="ts">
import ParticipantsSelect from '@/components/participants/ParticipantsSelect.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TrainerCarousel from '@/components/trainers/TrainerCarousel.vue';
import TrainingCarousel from '@/components/trainings/TrainingCarousel.vue';
import TrainingList from '@/components/trainings/TrainingList.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import type { Trainers } from '@/models/Trainers';
import type { TrainingData } from '@/models/Training';
import { router } from '@/router';
import { getDicebearAvatarUrl, getInitialsAvatarUrl } from '@/service/getAvatar';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import moment from 'moment';
import { ref, watch } from 'vue';

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);

const { saveTeamMutations } = useAdminTeamMutations();
const { isError, isFetching, trainers } = useTrainer();
const { criteriaMutations, isParticipantsError, isParticipantsLoading, participants, refetchParticipants } = useParticipants();
const { isTrainingError, isTrainingsLoading, trainings } = useTrainings();

const team = ref({
  users: [] as Participant[],
} as TeamWriteModel);

const showForm2 = ref(false);

const selectedTrainer = ref<Trainers>();
const selectedTraining = ref<TrainingData | null>(null);
const selectedParticipants = ref<Participant[]>([]);
const showResume = ref(false);

const openResumeDialog = () => {
  showResume.value = true;
};
const currentStep = ref(1);

watch(() => team.value.name, () => {
  if (team.value.name) {
    showForm2.value = true;
  }
}, { immediate: true });

const onSaveTeam = () => {
  team.value.trainer = selectedTrainer.value!.id
  team.value.training = selectedTraining.value!.id
  team.value.users = JSON.parse(JSON.stringify(selectedParticipants.value))
  team.value.users.map(x =>{
    x.profile.birthday = moment(x.profile.birthday).format("YYYY-MM-DD")
  })
  saveTeamMutations.mutate(team.value);
};

const onTrainerSelected = (trainer: Trainers) => {
  selectedTrainer.value = trainer;
}


const onTrainingSelected = (item: TrainingData[]) => {
  selectedTraining.value = item[0]
}

watch(saveTeamMutations.isSuccess, () => {
  if (saveTeamMutations.isSuccess.value) {
    showSuccessToast('Equipo Agregado correctamente');
    showResume.value = false;
    router.push({ name: 'teams-admin' })
  }
}) 

watch(saveTeamMutations.isError, () =>{
  if(saveTeamMutations.isError.value){
    let error = saveTeamMutations.error.value as AxiosError<ErrorApiResponse>
    showErrorToast(error);
  }
})

</script>
<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-card elevation="0">
    <v-card-text>
      <v-card-item class="text-center text-h3 font-weight-medium mb-2">
        Vamos a crear tu equipo ✨
      </v-card-item>
      <v-divider></v-divider>
      <v-label class="font-weight-medium py-2">
        Nombre <span class="text-error ms-1">*</span>
      </v-label>
      <v-text-field type="text" variant="outlined" hide-details v-model="team.name"></v-text-field>
      <p class="textSecondary text-12 mt-1">¿Cómo lo vas a nombrar?</p>
    </v-card-text>
  </v-card>

  <v-fade-transition>
    <v-stepper v-if="showForm2" v-model="currentStep" alt-labels elevation="0">
      <v-stepper-header>
        <v-stepper-item :value="1" :complete="currentStep > 1" title="Entrenador" editable></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item :value="2" :complete="currentStep > 2" title="Entrenamiento" editable></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item :value="3" title="Participantes" editable></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1" :transition="'slide-x-reverse'">
          <v-card class="mb-4" elevation="0">
            <v-card-text v-model="team.name">
              <h4 class="text-h4 pb-2">Equipo: {{ team.name }}</h4>
              <p class="textSecondary text-12 mt-1">
                Selecciona el entrenador.
              </p>
              <v-divider></v-divider>
              <TrainerCarousel :loading="isFetching" :trainers="trainers" @trainer-selected="onTrainerSelected" />
            </v-card-text>
          </v-card>
          <v-stepper-actions @click:next="currentStep = 2" :color="'primary'" :next-text="'Siguiente'">
            <template #prev>
              <VSpacer />
            </template>
          </v-stepper-actions>
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <h4 class="text-h4 pb-2">Entrenamiento</h4>
              <v-divider></v-divider>
              <p class="mt-4">Selecciona el entrenamiento para tu equipo.</p>
              <v-divider />
              <TrainingList :trainings="trainings" @send-training="onTrainingSelected" />
            </v-card-text>
          </v-card>
          <v-stepper-actions :next-text="'Siguiente'" :prev-text="'Atrás'" @click:next="currentStep = 3"
            @click:prev="currentStep = 1" color="primary"></v-stepper-actions>
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <h5 class="text-h5 pb-2">Participantes</h5>
              <v-divider></v-divider>
              <ParticipantsSelect :participants="participants"
                @send-participants="(params) => { selectedParticipants = params }" />
            </v-card-text>
          </v-card>
          <v-stepper-actions @click:prev="currentStep = 2" :prev-text="'Atrás'">
            <template #next>
              <v-btn color="primary" @click="openResumeDialog" :disabled="false">Crear Equipo</v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-fade-transition>

  <v-dialog v-model="showResume" persistent max-width="600px">
    <v-card class="d-flex gap-4">
      <h4 class="text-h4 bg-primary text-center py-4">Resumen del Equipo</h4>
      <v-card-text>
        <h5 class="text-h5">Nombre del Equipo: <strong>{{ team.name }}</strong></h5>
        <v-row>
          <v-col cols="12" sm="6" class="justify-center d-flex align-self-stretch">
            <v-card height="100%" class="cursor-pointer pa-4 hover:shadow-xl d-flex flex-column justify-space-between"
              variant="outlined">
              <h5 class=" text-h5 text-center pb-2">Entrenador:</h5>
              <div class="upload-btn-wrapper position-relative overflow-hidden d-flex justify-center" elevation="10">
                <v-avatar size="100" class="mt-2">
                  <v-img :src="getDicebearAvatarUrl(selectedTrainer?.name!)" alt="Avatar" />
                </v-avatar>
              </div>
              <p class="text-12 textSecondary text-center mt-5">
                {{ selectedTrainer?.name }}
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" class="justify-center d-flex align-self-stretch">
            <v-card height="100%" class="cursor-pointer pa-4 hover:shadow-xl d-flex flex-column justify-space-between"
              variant="outlined">
              <h5 class="text-h5 text-center pb-2">Entrenamiento:</h5>
              <div class="upload-btn-wrapper position-relative overflow-hidden d-flex justify-center" elevation="10">
                <v-avatar size="100" class="mt-2">
                  <v-img :src="getInitialsAvatarUrl(selectedTraining?.name!)" alt="Avatar" />
                </v-avatar>
              </div>
              <p class="text-12 textSecondary text-center mt-5">
                {{ selectedTraining?.name }} - {{ selectedTraining?.courseLevel }}
              </p>
            </v-card>
          </v-col>
        </v-row>
        <v-list-item-title class="font-weight-bold">Participantes:</v-list-item-title>
        <v-virtual-scroll :items="selectedParticipants" item-height="3">
          <template v-slot:default="{ item }">
            <v-list-item>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn color="secondary" @click="showResume = false">Seguir Creando</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="onSaveTeam">Guardar Equipo</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped></style>