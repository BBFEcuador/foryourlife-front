<script setup lang="ts">
import ParticipantsSelect from '@/components/participants/ParticipantsSelect.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TrainerCarousel from '@/components/trainers/TrainerCarousel.vue';
import TrainingCarousel from '@/components/trainings/TrainingCarousel.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import type { Trainers } from '@/models/Trainers';
import type { Training } from '@/models/Training';
import { getDicebearAvatarUrl, getInitialsAvatarUrl } from '@/service/getAvatar';
import { ref, watch } from 'vue';
import { TeapotIcon } from 'vue-tabler-icons';

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
const selectedTraining = ref<Training>();
const selectedParticipants = ref<Participant[]>([]);
const showResume = ref(false);

const openResumeDialog = () => {
  showResume.value = true;
};
const currentStep = ref(1);
const resetWizard = () => {
  currentStep.value = 1;
  team.value.name = "";
};

watch(() => team.value.name, () => {
  if (team.value.name) {
    showForm2.value = true;
  }
}, { immediate: true });

const onSaveTeam = () => {
  saveTeamMutations.mutate(team.value);
};

const onTrainerSelected = (trainer: Trainers) => {
  selectedTrainer.value = trainer;
}

const onTrainingSelected = (training: Training) => {
  selectedTraining.value = training;
}

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
      <p class="textSecondary text-12 mt-1">¿Cómo lo vas a nombrar?.</p>

      <!-- <v-btn class="mt-4" color="primary" @click="showForm2 = true; currentStep = 1;">
        Siguiente
      </v-btn> -->
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
        <!-- Step 1: Select trainer -->
        <v-stepper-window-item :value="1" :transition="'slide-x-reverse'">
          <v-card class="mb-4" elevation="0">
            <v-card-text v-model="team.name">
              <h5 class="text-h5 pb-2">Entrenador: {{ team.name }}</h5>
              <p class="textSecondary text-12 mt-1">
                Selecciona el entrenador de tu preferencia.
              </p>
              <v-divider></v-divider>
              <TrainerCarousel :trainers="trainers" @trainer-selected="onTrainerSelected" />
            </v-card-text>
          </v-card>
          <v-stepper-actions @click:next="currentStep = 2" :color="'primary'" :next-text="'Siguiente'">
            <template #prev>
              <VSpacer />
            </template>
          </v-stepper-actions>
        </v-stepper-window-item>

        <!-- Step 2: Training -->
        <v-stepper-window-item :value="2">
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <h5 class="text-h5 pb-2">Entrenamiento</h5>
              <v-divider></v-divider>
              <p class="mt-4">Configura el entrenamiento para tu equipo.</p>
              <v-divider />
              <TrainingCarousel :trainings="trainings" @training-selected="onTrainingSelected" />
            </v-card-text>
          </v-card>
          <v-stepper-actions :next-text="'Siguiente'" :prev-text="'Atrás'" @click:next="currentStep = 3"
            @click:prev="currentStep = 1" color="primary"></v-stepper-actions>
        </v-stepper-window-item>

        <!-- Paso 3: Participantes -->
        <v-stepper-window-item :value="3">
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <h5 class="text-h5 pb-2">Participantes</h5>
              <v-divider></v-divider>
              <ParticipantsSelect :participants="participants" />
              <p class="mt-4">¡Proceso completado!</p>
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

  <v-dialog v-model="showResume" max-width="600px">
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
        <v-list>
          <v-list-item v-for="participant in selectedParticipants" :key="participant.id">
            <v-list-item-title>{{ participant.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
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