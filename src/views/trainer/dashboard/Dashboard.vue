<script setup lang="ts">
import { trainerStore } from '@/stores/trainerStore.ts';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';

const store = trainerStore();
const router = useRouter();

const teamView = (teamId: string) => {
  router.push({
    name: 'trainer-team',
    params: { id: teamId }
  });
};
</script>
<template>
  <div>
    <UiParentCard title="Mis Entrenamientos">
      <v-row>
        <v-col v-for="team in store.trainer.teams" :key="team.id" cols="12" md="6">
          <v-card class="tw-bg-white tw-shadow-md">
            <v-card-title class="tw-font-bold tw-text-lg">{{ team.name }}</v-card-title>
            <v-card-text>
              <p><strong>Entrenamiento:</strong> {{ team.training.name }}</p>
              <p><strong>Fecha de Creación:</strong> {{ new Date(team.training.startDate).toLocaleDateString() }}</p>
              <!--              <p><strong>Número de Participantes:</strong> {{ team.participants.length }}</p>-->
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="teamView(team.id)"> Ver Detalles </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-if="store.trainer.length === 0" cols="12" class="tw-text-center tw-py-10">
          <p class="tw-text-gray-500">No tienes entrenamientos asignados.</p>
        </v-col>
      </v-row>
    </UiParentCard>
  </div>
</template>

<style scoped></style>
