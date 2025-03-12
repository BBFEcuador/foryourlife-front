<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ConfirmationStep from '@/components/shared/ConfirmationStep.vue';
import type { Participant } from '@/models/Participants';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';
import type { Visionary } from '@/models/Visionary';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';
import ParticipantTeamSelector from './create/ParticipantTeamSelector.vue';
import StaffSelector from './create/StaffSelector.vue';
import TeamLevelSelector from './create/TeamLevelSelector.vue';
import TrainerSelector from './create/TrainerSelector.vue';
import TrainingSelector from './create/TrainingSelector.vue';
import VisionariesSelector from './create/VisionariesSelector.vue';

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '#'
  }
]);


const lasStep = ref(7)
const staffStepNumber = ref(6)
const visStepNumber = ref(5)
const masterLifeStepNumber = ref(5)


const team = ref({
  users: [] as Participant[],
  visionaries:[] as Visionary[],
  masterLife:[] as Participant[],
  staffs:[] as StaffWriteModel[],
} as TeamWriteModel);




watch(()=>team.value.lvl,() => {
  console.log(team.value.lvl);
  switch (team.value.lvl) {
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
})

const step = ref(1)


</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

  <v-container class="pa-4">
    <v-card class="mb-4" elevation="1">
      <v-card-item>
        <v-card-title class="d-flex align-center">
          <Icon icon="mdi-account-group" size="32" class="mr-2" color="primary" />
          Crear Nuevo Equipo
        </v-card-title>
        <v-card-subtitle class="mt-2">Ingresa el nombre del equipo para comenzar</v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="team.name" label="Nombre del equipo" placeholder="Ingresa el nombre del equipo"
            hide-details="auto" variant="outlined" density="comfortable" class="mt-2"></v-text-field>
        </v-card-text>
      </v-card-item>
    </v-card>

    <VStepperVertical v-model="step" elevation="1">
      <VStepperVerticalItem hide-actions :complete="step > 1" subtitle="Paso 1" title="Selecciona el tipo de equipo"
        :value="1">
        <TeamLevelSelector :team="team" @level-selected="() => {
          step++
        }"/>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 2" subtitle="Paso 2" title="Selecciona el entrenamiento"
        :value="2">
        <TrainingSelector :team="team" @back="() => {
          step--
        }" @next="() => {
          step++
        }"/>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 3" subtitle="Paso 3" title="Selecciona el entrenador"
        :value="3">
       <TrainerSelector :team="team" @back="() => {
          step--
        }" @next="() => {
          step++
        }"/>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :complete="step > 4" subtitle="Paso 4" title="Selecciona los participantes"
        :value="4">
        <ParticipantTeamSelector :team="team"  @back="() => {
          step--
        }" @next="() => {
          step++
        }"/>
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="team.lvl === 'FOCUS'" hide-actions :complete="step > visStepNumber"
        :subtitle="`Paso ${visStepNumber}`" title="Selecciona los Visionarios" :value="visStepNumber">
       <VisionariesSelector :team="team" @back="() => {
          step--
        }" @next="() => {
          step++
        }"/>
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="team.lvl === 'FOCUS' || team.lvl === 'YOUR'" hide-actions :complete="step > staffStepNumber"
        :subtitle="`Paso ${staffStepNumber}`" title="Selecciona el Staff" :value="staffStepNumber">
        <StaffSelector :team="team" @back="() => {
          step--
        }" @next="() => {
          step++
        }"/> 
      </VStepperVerticalItem>

      <VStepperVerticalItem v-if="team.lvl === 'LIFE'" hide-actions :complete="step > masterLifeStepNumber"
        :subtitle="`Paso ${masterLifeStepNumber}`" title="Selecciona los masterlife" :value="masterLifeStepNumber">
        <v-card variant="flat" class="pa-4">
          <div class="d-flex align-center mb-4">
            <Icon icon="mdi-star" size="28" class="mr-2" color="primary" />
            <h4 class="text-h4">Master Life</h4>
          </div>
          <v-divider class="mb-4"></v-divider>

          <v-card-actions class="mt-6">
            <v-btn variant="outlined" @click="step--">
              <Icon icon="mdi-arrow-left" />
              Atrás
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="step++">
              <Icon icon="mdi-arrow-right" />
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-card>
      </VStepperVerticalItem>

      <VStepperVerticalItem hide-actions :subtitle="`Paso ${lasStep}`" title="Confirmación" :value="lasStep">
        <ConfirmationStep 
          :team="team"
          :disabled="!team.name || !team.trainerObj || !team.trainerObj || team.users.length === 0"
          @back="step--"
        />
      </VStepperVerticalItem>
    </VStepperVertical>
  </v-container>
</template>

<style scoped>
.v-stepper {
  border: 1px solid rgb(var(--v-theme-outlineBorder));
  border-radius: 8px;
}

.timeline-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.2);
}

:deep(.v-timeline-item__body) {
  margin-bottom: 24px;
}

:deep(.v-timeline-divider__dot) {
  background: transparent !important;
  box-shadow: none;
}

.transition-swing {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>