<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TrainerCarousel from '@/components/trainers/TrainerCarousel.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { ref } from 'vue';

const breadcrumbs = ref([
    {
        title: 'Equipos',
        disabled: false,
        href: '#'
    }
]);

const { saveTeamMutations } = useAdminTeamMutations();
const {isError,isFetching,trainers} = useTrainer();
const { criteriaMutations, isParticipantsError, isParticipantsLoading, participants, refetchParticipants } = useParticipants();
const { isTrainingError, isTrainingsLoading, trainings } = useTrainings();

const team = ref({
    users: [] as Participant[],
} as TeamWriteModel);

const showForm2 = ref(false);
const showForm3 = ref(false);

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
      <p class="textSecondary text-12 mt-1">Asigna el nombre que tendrá tu equipo.</p>

      <v-btn class="mt-4" color="primary" @click="showForm2 = true">
        Siguiente
      </v-btn>
    </v-card-text>
  </v-card>

  <v-fade-transition>
    <v-card v-if="showForm2" class="mt-4" elevation="3">
      <v-card-text>
        <h5 class="text-h5 pb-2">Entrenador</h5>
        <v-divider></v-divider>

        <v-text-field type="text" variant="outlined" hide-details v-model="team.name"></v-text-field>
        <p class="textSecondary text-12 mt-1">Selecciona el entrenador de tu preferencia.</p>
        <v-btn class="mt-4" @click="showForm3 = true" color="success">Siguiente</v-btn>
      </v-card-text>
    </v-card>
  </v-fade-transition>
  <v-fade-transition>
    <v-card v-if="showForm3" class="mt-4" elevation="3">
      <v-card-text>
        <h5 class="text-h5 pb-2">Entrenador</h5>
        <v-divider></v-divider>
        <TrainerCarousel :trainers="trainers" />
      </v-card-text>
      <v-card-actions>
        <v-btn class="mt-4" variant="flat" color="success">Siguiente</v-btn>
      </v-card-actions>
    </v-card>
  </v-fade-transition>
</template>


<style scoped></style>