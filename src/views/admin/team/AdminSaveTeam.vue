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
import { computed, ref, watch } from 'vue';
import AdminParticipants from '../participants/AdminParticipants.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Participant } from '@/models/Participants';

const { saveTeamMutations } = useAdminTeamMutations();
const { criteriaMutations, isParticipantsError, isParticipantsLoading, participants, refetchParticipants } = useParticipants();
const { isError, isFetching, trainers } = useTrainer();
const { isTrainingError, isTrainingsLoading, trainings } = useTrainings();

const team = ref<TeamWriteModel>({
  users: [] as Participant[]
} as TeamWriteModel);
const searchQuery = ref('');
const searchQuery2 = ref('');
const searchQuery3 = ref('');
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

const getAvatarUrl = (name: string) => {
  // Usar UI Avatars para generar un avatar basado en el nombre
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
};

const filteredTrainers = computed(() => {
  if (!searchQuery.value) return trainers.value;
  return trainers.value.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredTraining = computed(() => {
  if (!searchQuery2.value) return trainings.value;
  return trainings.value.filter(trainings =>
    trainings.name.toLowerCase().includes(searchQuery2.value.toLowerCase())
  );
});

const filteredParticipants = computed(() => {
  if (!searchQuery3.value) return participants.value;
  return participants.value.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery3.value.toLowerCase())
  );
});

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
  console.log('Equipo :', team.value);
};

const selectedTraining = (trainer: Training) => {
  team.value.training = trainer.id;
  console.log('Entrenamiento seleccionado:', trainer);
};

const headers = ref([
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' },
  { title: 'Acciones', value: 'actions', width: 50 }
]);

const getTrainerName = (id: number | string) => {
  const trainer = trainers.value.find(t => t.id === id);
  return trainer ? trainer.name : 'Desconocido';
};

const getTrainingName = (id: number | string) => {
  const training = trainings.value.find(t => t.id === id);
  return training ? training.name : 'Desconocido';
};

const removeParticipant = (index: number) => {
  team.value.users.splice(index, 1);
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
              <v-text-field class="mt-2" v-model="searchQuery" label="Buscar" outlined dense clearable>
                <template #prepend-inner>
                  <Icon icon="mdi-magnify" />
                </template>
              </v-text-field>
              <v-virtual-scroll :items="filteredTrainers" :item-height="3" height="150">
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" @click="selectedTrainer(item)"
                    :class="{ 'text-primary': team.trainer === item.id }">
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img :src="getAvatarUrl(item.name)" alt="Avatar" />
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-1 font-weight-medium text-capitalize">
                      {{ item.name }}
                    </v-list-item-title>
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
              <v-text-field class="mt-2" v-model="searchQuery2" label="Buscar" outlined dense clearable>
                <template #prepend-inner>
                  <Icon icon="mdi-magnify" />
                </template>
              </v-text-field>
              <v-virtual-scroll :items="filteredTraining" :item-height="3" height="150">
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" @click="selectedTraining(item)"
                    :class="{ 'text-primary': team.training === item.id }">
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img :src="getAvatarUrl(item.name)" alt="Avatar" />
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-1 font-weight-medium text-capitalize">
                      {{ item.name }} - {{ item.courseLevel }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-virtual-scroll>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4" class="py-1">
      <v-card elevation="0" class="mb-6 h-max" :height="510">
        <v-card-text class="pb-0">
          <h5 class="text-h5 mb-4">Vista Previa</h5>
          <v-list dense>
            <v-list-item>
              <v-list-item-title>
                <div class="d-flex justify-center">
                  <v-avatar size="80">
                    <v-img :src="getAvatarUrl(team.name)" alt="Avatar" v-if="team.name" />
                    <Icon icon="fluent:people-team-20-filled" height="80" v-else />
                  </v-avatar>
                </div>
                <div class="d-flex justify-center mt-3">
                  {{ team.name || 'Nombre del Equipo' }}
                </div>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar size="35">
                  <v-img :src="getAvatarUrl(getTrainerName(team.trainer))" v-if="team.trainer" />
                  <Icon icon="simple-icons:trainerroad" height="50" v-else />
                </v-avatar>
              </template>
              <v-list-item-title>
                <strong>Entrenador:</strong> {{ team.trainer ? getTrainerName(team.trainer) : 'Sin asignar' }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-avatar size="35">
                  <v-img :src="getAvatarUrl(getTrainingName(team.training))" v-if="team.training" />
                  <Icon icon="oui:training" height="28" v-else />
                </v-avatar>
              </template>
              <v-list-item-title>
                <strong>Entrenamiento:</strong> {{ team.training ? getTrainingName(team.training) : 'Sin asignar' }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item variant="tonal" color="primary">
              <v-list-item-title><strong>Participantes: {{ team.users.length }}</strong></v-list-item-title>
              <v-list dense>
                <v-virtual-scroll :items="team.users" :item-height="3" height="110">
                  <template v-slot:default="{ item }">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-avatar size="30">
                          <v-img :src="getAvatarUrl(item.name)" alt="Avatar" />
                        </v-avatar>
                      </template>
                      <v-list-item-title class="text-subtitle-1 font-weight-medium text-capitalize">
                        {{ item.name }}
                      </v-list-item-title>
                      <template v-slot:append #prepend-inner>
                        <v-btn color="error" variant="text" @click="removeParticipant(index)" height="
                          30">
                          <Icon icon="mdi-minus-circle"></Icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </template>
                </v-virtual-scroll>
              </v-list>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="pt-0">
          <VSpacer />
          <VBtn variant="elevated" block color="primary" @click="onSaveTeam">Crear equipo</VBtn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card elevation="0" class="mb-6">
        <v-card-text>
          <h5 class="text-h5 mb-8">Participantes</h5>
          <v-text-field v-model="searchQuery3" label="Buscar por Nombre" outlined dense clearable>
            <template #prepend-inner>
              <Icon icon="mdi-magnify" />
            </template>
          </v-text-field>
          <VDataTable :items="participants" :headers="headers" show-select v-model="team.users" return-object :search="searchQuery3">
          </VDataTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
