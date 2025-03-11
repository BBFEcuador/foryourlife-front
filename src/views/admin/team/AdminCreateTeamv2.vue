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
import { Icon } from '@iconify/vue/dist/iconify.js';
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
  saveTeamMutations.mutate({
    ...team.value,
    training: selectedTraining.value?.id ?? '',
    trainer: selectedTrainer.value?.id ?? ''
  })
}
</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-container class="pa-4">
    <v-card class="mb-4" variant="outlined">
      <v-card-item>
        <v-card-title class="d-flex align-center">
          <Icon icon="mdi-account-group" size="32" class="mr-2" color="primary" />
          Crear Nuevo Equipo
        </v-card-title>
        <v-card-subtitle>
          Sigue los pasos para configurar tu equipo
        </v-card-subtitle>
      </v-card-item>
    </v-card>

    <VStepperVertical v-model="step" class="elevation-1">
      <VStepperVerticalItem hide-actions :complete="step > 1" subtitle="Paso 1" title="Selecciona el tipo de equipo"
        :value="1">
        <v-card variant="flat" class="pa-4">
          <p class="text-center text-h4 font-weight-medium mb-6">
            ¿Qué equipo vas a crear? 
          </p>
          <v-row>
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
                  <LevelsGrid @level-selected="onlevelSelected" :image="img1" description="Básico" title="Focus" />
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
                  <LevelsGrid @level-selected="onlevelSelected" :image="img2" description="Normal" title="Your" />
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
                  <LevelsGrid @level-selected="onlevelSelected" :image="img3" description="Avanzado" title="Life" />
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 2" subtitle="Paso 2" title="Selecciona el entrenamiento"
        :value="2">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-dumbbell" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Entrenamiento</h4>
          </div>
          <v-divider class="mb-4"></v-divider>
          <p class="text-body-1 mb-6">Selecciona el entrenamiento para tu equipo.</p>
          <v-progress-circular v-if="isTrainingsLoading" indeterminate color="primary"></v-progress-circular>
          <v-alert v-else-if="isTrainingsError" type="error" class="mb-4">
            Error al cargar los entrenamientos
          </v-alert>
          <TrainingList :trainings="trainings" v-else @send-training="onTrainingSelected" />

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left"/>
              Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onTrainingSelectedNext"
              :disabled="selectedTraining == null || isTrainingsLoading">
              <Icon icon="mdi-arrow-right"/>
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 3" subtitle="Paso 3" title="Selecciona el entrenador"
        :value="3">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-account-tie" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Entrenador</h4>
          </div>
          <v-divider class="mb-4"></v-divider>
          <p class="text-body-1 mb-6">Selecciona el entrenador conforme a lo seleccionado.</p>

          <v-progress-circular v-if="availableTrainerMutation.isPending.value" indeterminate color="primary">
          </v-progress-circular>
          <v-alert v-else-if="availableTrainerMutation.isError.value" type="error" class="mb-4">
            Error al cargar los entrenadores
          </v-alert>
          <TrainerCarousel v-else :trainers="trainers" @trainer-selected="onTrainerSelected" />

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left"/>
              Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onTrainerNext"
              :disabled="!selectedTrainer || availableTrainerMutation.isPending.value">
              <Icon icon="mdi-arrow-right"/>
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 4" subtitle="Paso 4" title="Selecciona los participantes"
        :value="4">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-account-group" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Participantes</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-progress-circular v-if="getByLvlMutation.isPending.value" indeterminate color="primary"></v-progress-circular>
          <v-alert v-else-if="getByLvlMutation.isError.value" type="error" class="mb-4">
            Error al cargar los participantes
          </v-alert>
          <ParticipantsSelect v-else :team="team" :participants="participant" />

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left"/>
              Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="step++"
              :disabled="team.users.length <= 0 || getByLvlMutation.isPending.value">
              <Icon icon="mdi-arrow-right"/>
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="lvl == 'FOCUS'" hide-actions :complete="step > visStepNumber"
        :subtitle="`Paso ${visStepNumber}`" title="Selecciona los Visio" :value="visStepNumber">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-eye" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Visionario</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left"/>
              Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="step++">
              <Icon icon="mdi-arrow-right"/>
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="lvl == 'FOCUS' || lvl == 'YOUR'" hide-actions :complete="step > staffStepNumber"
        :subtitle="`Paso ${staffStepNumber}`" title="Selecciona los Staff" :value="staffStepNumber">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-account-tie-voice" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Staff</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left"/>
              Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="step++">
              <Icon icon="mdi-arrow-right"/>
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="lvl == 'LIFE'" hide-actions :complete="step > masterLifeStepNumber"
        :subtitle="`Paso ${masterLifeStepNumber}`" title="Selecciona los masterlife" :value="masterLifeStepNumber">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-star" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Master Life</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="step--">Atrás</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" append-icon="mdi-arrow-right" @click="step++">
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :subtitle="`Paso ${lasStep}`" title="Confirmación" :value="lasStep">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-check-circle" size="28" class="mr-2" color="success" />
            <h4 class="text-h4">Confirmación</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-container class="px-0">
            <v-row>
              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <template v-slot:prepend>
                      <Icon icon="mdi-dumbbell" color="primary" size="24"/>
                    </template>
                    <v-card-title>Entrenamiento</v-card-title>
                    <v-card-subtitle class="mt-1">
                      <div class="d-flex align-center">
                        <span class="text-primary font-weight-medium">{{ selectedTraining?.name }}</span>
                      </div>
                      <div class="mt-2 text-caption">
                        <Icon icon="mdi-calendar" class="mr-1" size="16"/>
                        {{ selectedTraining?.startDate }} - {{ selectedTraining?.endDate }}
                      </div>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <template v-slot:prepend>
                      <Icon icon="mdi-account-tie" color="primary" size="24"/>
                    </template>
                    <v-card-title>Entrenador</v-card-title>
                    <v-card-subtitle class="mt-1">
                      <div class="d-flex align-center">
                        <span class="text-primary font-weight-medium">{{ selectedTrainer?.name }}</span>
                      </div>
                      <div class="mt-2 text-caption d-flex align-center">
                        <Icon icon="mdi-email" class="mr-1" size="16"/>
                        {{ selectedTrainer?.email }}
                      </div>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <template v-slot:prepend>
                      <Icon icon="mdi-account-group" color="primary" size="24"/>
                    </template>
                    <v-card-title>Participantes</v-card-title>
                    <v-card-subtitle class="mt-1">
                      <div class="d-flex align-center">
                        <span class="text-primary font-weight-medium">{{ team.users.length }} participantes</span>
                      </div>
                      <div class="mt-2 text-caption">
                        <Icon icon="mdi-information" class="mr-1" size="16"/>
                        Seleccionados para el equipo
                      </div>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <template v-slot:prepend>
                      <Icon icon="mdi-flag" color="primary" size="24"/>
                    </template>
                    <v-card-title>Nivel</v-card-title>
                    <v-card-subtitle class="mt-1">
                      <div class="d-flex align-center">
                        <span class="text-primary font-weight-medium">{{ lvl }}</span>
                      </div>
                      <div class="mt-2 text-caption">
                        <Icon icon="mdi-star" class="mr-1" size="16"/>
                        Nivel del equipo
                      </div>
                    </v-card-subtitle>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>

            <v-card-actions class="mt-4">
              <v-btn variant="outlined" @click="step--">
                <Icon icon="mdi-arrow-left" class="mr-2"/>
                Atrás
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn 
                color="success" 
                :loading="saveTeamMutations.isPending.value"
                :disabled="saveTeamMutations.isPending.value"
                @click="onClickFinish">
                <Icon icon="mdi-check" class="mr-2"/>
                Confirmar Equipo
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </VStepperVerticalItem>
    </VStepperVertical>
  </v-container>
</template>

<style scoped>
.v-stepper {
  border: 1px solid rgb(var(--v-theme-outlineBorder));
  border-radius: 8px;
}

.transition-swing {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>