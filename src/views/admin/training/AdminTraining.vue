<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import type { Trainers } from '@/models/Trainers';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import TrainerForm from './TrainerForm.vue';
import { v4 as uuidv4 } from 'uuid';

const { isError, isFetching, trainers } = useTrainer();
const { saveTrainerMutations } = useTrainerMutations();
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const showForm = ref(false);
const search = ref();
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'E-mail', value: 'email' },
  { title: 'Teléfono', value: 'phone' },
  { title: 'Acciones', value: 'actions', width: 50 }
];

const trainer = ref<Trainers>({} as Trainers);

const onTrainerSubmit = (trainer: Trainers) => {
  if (!trainer.id) {
    trainer.id = uuidv4();
  }
  saveTrainerMutations.mutate(trainer);
};

watch(saveTrainerMutations.isError, () => {
  if (saveTrainerMutations.isError.value) {
  }
});

watch(saveTrainerMutations.isSuccess, () => {
  if (saveTrainerMutations.isSuccess.value) {
    trainers.value.push(saveTrainerMutations.variables.value!);
  }
});
</script>
<template>
  <BaseBreadcrumb :title="'Entrenadores'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de entrenadores">
        <v-data-table :headers="headers" :search="search" :items="trainers" :loading="isFetching">
          <template v-slot:top>
            <v-toolbar
              class="bg-surface tw-px-3"
              flat
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }"
              :delay="200"
              :duration="250"
            >
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card">
                <Icon icon="mdi-magnify" height="18"></Icon>
              </VTextField>
              <v-spacer></v-spacer>
              <VBtn variant="tonal" color="success" @click="showForm = true">Agregar</VBtn>
            </v-toolbar>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
    <VDialog v-model="showForm" max-width="500">
      <VCard>
        <VCardTitle>
          <h3>Crear entrenador</h3>
        </VCardTitle>
        <VCardItem>
          <TrainerForm :trainer="trainer" :is-loading="saveTrainerMutations.isPending.value" @onsubmit="onTrainerSubmit" />
        </VCardItem>
      </VCard>
    </VDialog>
  </v-row>
</template>

<style scoped></style>
