<script setup lang="ts">
import { trainerStore } from '@/stores/trainerStore.ts';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, ref } from 'vue';
import useTrainerTeams from '@/composables/trainer/team/useTrainerTeams.ts';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

const store = trainerStore();
const { teams, isTeamLoading, isTeamError } = useTrainerTeams(store.trainer.id);
const router = useRouter();
const breadcrumbs = ref();

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
    <BaseBreadcrumb :title="'Mis Entrenamientos'" :breadcrumbs="breadcrumbs" homeRoute="trainer-home" />
    <div v-if="isTeamLoading" class="text-center pa-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-caption mt-4">Cargando datos...</p>
    </div>
    <div v-else-if="isTeamError" class="text-center pa-12">
      <v-card variant="flat" border class="rounded-xl text-center pa-8">
        <div class="d-flex align-center justify-center">
          <Icon icon="solar:danger-bold-duotone" class="text-warning text-center mb-4" height="48" />
        </div>
        <p class="text-h6">Error al cargar los datos</p>
      </v-card>
    </div>
    <div v-else>
      <v-row>
        <v-col v-for="(team, idx) in teams" :key="team.id" cols="12" md="6">
          <v-card
            elevation="1"
            class="team-card overflow-hidden rounded-xl"
            @click="router.push({ name: 'trainer-team', params: { id: team.id } })"
          >
            <v-row no-gutters class="fill-height">
              <v-col cols="7" class="pa-6 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex align-center mb-2">
                    <v-chip size="x-small" color="success" variant="flat" class="text-uppercase font-weight-bold px-2"> Activo </v-chip>
                  </div>

                  <h3 class="font-weight-black text-primary mb-1">
                    {{ team?.training?.name }}
                  </h3>

                  <div class="font-weight-bold mb-4">
                    {{ team?.name }}
                  </div>

                  <v-row no-gutters class="mt-2">
                    <v-col cols="12" class="mb-2">
                      <div class="d-flex align-center">
                        <Icon icon="mdi-signal" size="16" color="primary" class="mr-2"></Icon>
                        <span>
                          Nivel: <strong>{{ team?.training?.courseLevel ?? team?.trainingData?.curseLevel ?? 'N/A' }} </strong></span
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" class="mb-2">
                      <div class="d-flex align-center">
                        <Icon icon="mdi-map-marker-outline" size="16" color="primary" class="mr-2"></Icon>
                        <span class="">{{ team?.training?.campus?.city ?? 'Sede N/A' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="d-flex align-center">
                        <Icon icon="mdi-account-group-outline" size="16" color="primary" class="mr-2"></Icon>
                        <span>{{ team.users?.length ?? 0 }} Participantes</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <div class="mt-4 pt-4 border-t d-flex align-center justify-space-between">
                  <div class="date-range">
                    <div class="text-overline leading-none text-grey-darken-1">Periodo</div>
                    <div class="font-weight-bold">
                      {{
                        team?.training?.startDate
                          ? new Date(team?.training?.startDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
                          : 'N/A'
                      }}
                      -
                      {{
                        team?.training?.endDate
                          ? new Date(team?.training?.endDate).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              year: '2-digit'
                            })
                          : 'N/A'
                      }}
                    </div>
                  </div>

                  <v-btn icon color="primary" variant="tonal" size="small" class="rounded-lg">
                    <Icon icon="mdi-chevron-right" height="25"></Icon>
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="5" class="relative">
                <v-img :src="getLocalCardImage(idx)" cover height="100%" class="team-image">
                  <div class="image-overlay"></div>
                </v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col v-if="!teams || teams.length === 0" cols="12" class="text-center py-12">
          <v-avatar size="80" color="grey-lighten-4" class="mb-4">
            <Icon icon="mdi-minus-circle-outline" height="40" color="grey-lighten-1"></Icon>
          </v-avatar>
          <h3 class="text-h5 font-weight-bold text-grey-darken-2">Sin entrenamientos</h3>
          <p class="text-body-1 text-grey mb-8">No tienes equipos asignados en este momento.</p>

          <v-row justify="center">
            <v-col v-for="(img, idx) in shuffledBlogImages.slice(0, 4)" :key="idx" cols="6" sm="3" md="2">
              <v-hover v-slot="{ isHovering, props }">
                <v-img
                  v-bind="props"
                  :src="img"
                  class="rounded-lg elevation-2 transition-swing"
                  :class="{ 'scale-105': isHovering }"
                  height="100"
                  cover
                />
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.team-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  background: #ffffff;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.team-image {
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.scale-105 {
  transform: scale(1.05);
}

.leading-none {
  line-height: 1;
}
</style>
