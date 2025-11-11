<script setup lang="ts">
import { trainerStore } from '@/stores/trainerStore.ts';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, ref } from 'vue';
import useTrainerTeams from '@/composables/trainer/team/useTrainerTeam.ts';

const store = trainerStore();
const { teams } = useTrainerTeams(store.trainer.id);
const router = useRouter();

const getLocalCardImage = (idx: number): string => {
  const imgs = shuffledBlogImages.value.length ? shuffledBlogImages.value : (Object.values(imageModules) as string[]);
  if (!imgs || imgs.length === 0) return '';
  return imgs[idx % imgs.length];
};

const imageModules = import.meta.glob('@/assets/images/blog/*.{jpg,jpeg,png}', { eager: true, as: 'url' });
const shuffledBlogImages = ref<string[]>([]);
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
onMounted(() => {
  const imgs = Object.values(imageModules) as string[];
  shuffledBlogImages.value = shuffle(imgs);
});
</script>
<template>
  <div>
    <UiParentCard title="Mis Entrenamientos">
      <v-row>
        <v-col v-for="(team, idx) in teams" :key="team.id" cols="12" md="6">
          <v-card elevation="2" class="overflow-visible">
            <v-row class="mt-md-0 mt-sm-3 mt-3">
              <v-col cols="6" sm="6">
                <v-card-item class="pb-3">
                  <h5 class="text-h5" v-text="team.name"></h5>
                  <div class="text-body-1 textSecondary mt-1" v-text="team.training.name"></div>
                  <div class="text-caption textSecondary mt-2">
                    Nivel: {{ team.training.courseLevel ?? team.trainingData?.curseLevel ?? 'N/A' }}
                  </div>
                  <div class="text-caption textSecondary">Inicio: {{ new Date(team.training.startDate).toLocaleDateString() }}</div>
                  <div class="text-caption textSecondary">Fin: {{ new Date(team.training.endDate).toLocaleDateString() }}</div>
                  <div class="text-caption textSecondary">Sede: {{ team.training?.campus?.city ?? 'N/A' }}</div>
                  <div class="text-caption textSecondary">Participantes: {{ team.users?.length ?? 0 }}</div>
                  <div class="d-flex align-center justify-center mt-8">
                    <v-chip class="text-success"> ACTIVO </v-chip>
                    <v-btn
                      size="23"
                      icon
                      variant="flat"
                      class="grey100 ml-4"
                      @click="router.push({ name: 'trainer-team', params: { id: team.id } })"
                    >
                      <v-avatar size="23" color="info">
                        <Icon icon="mdi:eye" />
                      </v-avatar>
                    </v-btn>
                  </div>
                </v-card-item>
              </v-col>
              <v-col cols="6" sm="6" class="py-0 pl-0">
                <img :src="getLocalCardImage(idx)" class="rounded-e-md w-100 h-100 obj-cover" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col v-if="!teams || teams.length === 0" cols="12" class="tw-text-center tw-py-10">
          <p class="tw-text-gray-500">No tienes entrenamientos asignados.</p>
          <v-row class="tw-justify-center tw-gap-2 tw-mt-4">
            <v-col v-for="(img, idx) in shuffledBlogImages.slice(0, 8)" :key="idx" cols="6" sm="3">
              <v-img :src="img" class="tw-rounded-lg tw-shadow-sm" height="120" cover />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </UiParentCard>
  </div>
  <v-row> </v-row>
</template>

<style scoped></style>
