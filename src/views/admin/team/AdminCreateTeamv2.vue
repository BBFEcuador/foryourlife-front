<script setup lang="ts">
import img1 from '@/assets/images/blog/blog-img1.jpg';
import img2 from '@/assets/images/blog/blog-img2.jpg';
import img3 from '@/assets/images/blog/blog-img3.jpg';
import ParticipantsSelect from '@/components/participants/ParticipantsSelect.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import LevelsGrid from '@/components/shared/LevelsGrid.vue';
import TrainerCarousel from '@/components/trainers/TrainerCarousel.vue';
import TrainingList from '@/components/trainings/TrainingList.vue';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import useTrainingsByLvl from '@/composables/admin/training/useTrainingsByLvl';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import type { Trainers } from '@/models/Trainers';
import type { TrainingData } from '@/models/Training';
import { router } from '@/router';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);

const { saveTeamMutations } = useAdminTeamMutations();
const { isTrainingsError, isTrainingsLoading, lvl, trainings } = useTrainingsByLvl()
const { availableTrainerMutation } = useTrainerMutations()
const { getByLvlMutation } = useParticipantMutations()

const lasStep = ref(7)
const staffStepNumber = ref(6)
const visStepNumber = ref(5)
const masterLifeStepNumber = ref(5)
const trainers = ref<Trainers[]>([])
const participant = ref<Participant[]>([])

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
const onTrainingSelectedNext = () => {
  if (selectedTraining.value) {
    availableTrainerMutation.mutate({
      endDate: selectedTraining.value.endDate,
      startDate: selectedTraining.value.startDate
    })
  }
}
watch(availableTrainerMutation.isSuccess, () => {
  if (availableTrainerMutation.isSuccess.value) {
    const response = availableTrainerMutation.data.value
    if (response) {
      trainers.value = response
      step.value++
    }
  }
})
const onTrainingBack = () => {
  window.value = '1'
  selectedTraining.value = null
}

const onTrainerSelected = (trainer: Trainers) => {
  selectedTrainer.value = trainer;
}


const onlevelSelected = (level: string) => {
  lvl.value = level
  switch (level) {
    case 'FOCUS':
      lasStep.value = 7
      staffStepNumber.value = 6
      visStepNumber.value = 5
      masterLifeStepNumber.value = 5
      break;

    case 'YOUR':
      lasStep.value = 6
      staffStepNumber.value = 5
      visStepNumber.value = 5
      masterLifeStepNumber.value = 5
      break;
    case 'LIFE':
      lasStep.value = 6
      staffStepNumber.value = 5
      visStepNumber.value = 5
      masterLifeStepNumber.value = 5
      break;

    default:
      break;
  }
  step.value++
};

const window = ref("1")
const onTrainerNext = () => {
  getByLvlMutation.mutate(lvl.value)
  step.value++
}


watch(getByLvlMutation.isError,() => {
  
})

watch(getByLvlMutation.isSuccess,() => {
  if (getByLvlMutation.isSuccess.value) {
    const response = getByLvlMutation.data.value
    if (response) {
      participant.value = response
    }
  }
})

const step = ref(1)
const onClickFinish = () => {
  alert('Equipo creado con éxito')
}
</script>
<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <VStepperVertical v-model="step">
    <VStepperVerticalItem hide-actions :complete="step > 1" subtitle="Paso 1" title="Selecciona el tipo de equipo"
      :value="1">
      <v-card elevation="0">
        <v-card-text>
          <v-card-item class="text-center text-h3 font-weight-medium mb-2">
            ¿Qué equipo vas a crear? ✨
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
              <LevelsGrid @level-selected="onlevelSelected" :image="img3" description="Avanzado" title="Life" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > 2" subtitle="Paso 2" title="Selecciona el entrenamiento"
      :value="2">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Entrenamiento</h4>
          <v-divider></v-divider>
          <p class="mt-4">Selecciona el entrenamiento para tu equipo.</p>
          <TrainingList :trainings="trainings" @send-training="onTrainingSelected" />
        </v-card-text>
      </v-card>
      <v-btn color="secondary" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="onTrainingSelectedNext" :disabled="selectedTraining == null">
        Siguiente
      </v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > 3" subtitle="Paso 3" title="Selecciona el entrenador"
      :value="3">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Entrenador</h4>
          <v-divider></v-divider>
          <p class="mt-4">Selecciona el entrenador conforme a lo seleccionado.</p>
          <TrainerCarousel :trainers="trainers" />
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="onTrainerNext">Siguiente</v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > 4" subtitle="Paso 4" title="Selecciona los participantes"
      :value="4">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Participantes</h4>
          <v-divider></v-divider>
          <ParticipantsSelect :participants="participant" :team="team"/>
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="step++" :disabled="team.users.length <= 0">Siguiente</v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > visStepNumber" :subtitle="`Paso ${visStepNumber}`"
      title="Selecciona los Visio" :value="visStepNumber" v-if="lvl == 'FOCUS'">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Vis</h4>
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="step++">Siguiente</v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > staffStepNumber" :subtitle="`Paso ${staffStepNumber}`"
      title="Selecciona los Staff" :value="staffStepNumber" v-if="lvl == 'FOCUS' || lvl == 'YOUR'">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Staff</h4>
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="step++">Siguiente</v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :complete="step > masterLifeStepNumber" :subtitle="`Paso ${masterLifeStepNumber}`"
      title="Selecciona los masterlife" :value="masterLifeStepNumber" v-if="lvl == 'LIFE'">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Master</h4>
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="primary" @click="step++">Siguiente</v-btn>
    </VStepperVerticalItem>

    <VStepperVerticalItem hide-actions :subtitle="`Paso ${lasStep}`" title="Confirmación" :value="lasStep">
      <v-card elevation="0">
        <v-card-text>
          <h4 class="text-h4 pb-2">Confirmación</h4>
          <v-divider></v-divider>
          <p class="mt-4">Revisa y confirma los datos antes de finalizar.</p>
          <p>Entrenamiento seleccionado: {{ selectedTraining?.name }}</p>
        </v-card-text>
      </v-card>

      <v-btn variant="plain" @click="step--">Atrás</v-btn>
      <v-btn color="success" @click="onClickFinish">Finalizar</v-btn>
    </VStepperVerticalItem>
  </VStepperVertical>
</template>


<style scoped></style>