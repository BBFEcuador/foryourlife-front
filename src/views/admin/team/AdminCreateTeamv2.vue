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
import { Icon } from '@iconify/vue/dist/iconify.js';
import LevelsGrid from '@/components/shared/LevelsGrid.vue';
import img1 from '@/assets/images/blog/blog-img1.jpg';
import img2 from '@/assets/images/blog/blog-img2.jpg';
import img3 from '@/assets/images/blog/blog-img3.jpg';

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

const showResume = ref(false);

const openResumeDialog = () => {
  showResume.value = true;
};

watch(() => team.value.name, () => {
  if (team.value.name) {
    showForm2.value = true;
  }
}, { immediate: true });
const selectedTrainer = ref<Trainers>();


watch(saveTeamMutations.isSuccess, () => {
  if (saveTeamMutations.isSuccess.value) {
    showSuccessToast('Equipo Agregado correctamente');
    showResume.value = false;
    router.push({ name: 'teams-admin' })
  }
})

watch(saveTeamMutations.isError, () => {
  if (saveTeamMutations.isError.value) {
    let error = saveTeamMutations.error.value as AxiosError<ErrorApiResponse>
    showErrorToast(error);
  }
})
const selectedTraining = ref<TrainingData | null>(null);

const onTrainingSelected = (item: TrainingData[]) => {
  selectedTraining.value = item[0]
}

const onTrainerSelected = (trainer: Trainers) => {
  selectedTrainer.value = trainer;
}


const onlevelSelected = (level: string) => {
  console.log("Nivel seleccionado:", level);
  window.value = "2";
};

const goNext = () => {
  window.value = String(Number(window.value) + 1);
};

const goBack = () => {
  window.value = String(Number(window.value) - 1);
};
const window = ref("1")
</script>
<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VWindow show-arrows v-model="window">
    <VWindowItem value="1">
      <v-card elevation="0">
        <v-card-text>
          <v-card-item class="text-center text-h3 font-weight-medium mb-2">
            ¿Qué Equipo vas a crear? ✨
          </v-card-item>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" md="4">
              <LevelsGrid @level-selected="onlevelSelected" :image="img1" description="Básico" title="Focus" />
            </v-col>
            <v-col cols="12" md="4">
              <LevelsGrid @level-selected="onlevelSelected" :image="img2" description="Normal" title="Your" />
            </v-col>
            <v-col cols="12" md="4">
              <LevelsGrid @level-selected="onlevelSelected" :image="img3" description="Buenazo" title="Life" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </VWindowItem>
    <VWindowItem value="2">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Entrenamiento</h4>
          <v-divider></v-divider>
          <p class="mt-4">Selecciona el entrenamiento para tu equipo.</p>
          <TrainingList :trainings="trainings" @send-training="onTrainingSelected" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="goBack">Atrás</v-btn>
          <v-btn color="primary" @click="goNext">Siguiente</v-btn>
        </v-card-actions>
      </v-card>
    </VWindowItem>

    <!-- PASO 3 -->
    <VWindowItem value="3">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Entrenador</h4>
          <v-divider></v-divider>
          <p class="mt-4">Selecciona el entrenador conforme a lo seleccionado.</p>
          <div class="upload-btn-wrapper position-relative overflow-hidden d-flex justify-center" elevation="10">
            <v-avatar size="100" class="mt-2">
              <v-img :src="getDicebearAvatarUrl(selectedTrainer?.name!)" alt="Avatar" />
            </v-avatar>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="goBack">Atrás</v-btn>
          <v-btn color="primary" @click="goNext">Siguiente</v-btn>
        </v-card-actions>
      </v-card>
    </VWindowItem>

    <!-- PASO 4 -->
    <VWindowItem value="4">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Participantes</h4>
          <v-divider></v-divider>
          <ParticipantsSelect :participants="participants" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="goBack">Atrás</v-btn>
          <v-btn color="primary" @click="goNext">Siguiente</v-btn>
        </v-card-actions>
      </v-card>
    </VWindowItem>

    <!-- PASO 5 -->
    <VWindowItem value="5">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Confirmación</h4>
          <v-divider></v-divider>
          <p class="mt-4">Revisa y confirma los datos antes de finalizar.</p>
          <p>Entrenamiento seleccionado: {{ selectedTraining?.name }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="goBack">Atrás</v-btn>
          <v-btn color="success">Finalizar</v-btn>
        </v-card-actions>
      </v-card>
    </VWindowItem>
  </VWindow>
</template>


<style scoped></style>