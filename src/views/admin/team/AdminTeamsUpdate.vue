<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TeamBanner from '@/components/team/TeamBanner.vue';
import TeamDetails from '@/components/team/TeamDetails.vue';
import TeamMasterLife from '@/components/team/TeamMasterLife.vue';
import TeamParticipantsList from '@/components/team/TeamParticipantsList.vue';
import TeamStaff from '@/components/team/TeamStaff.vue';
import TeamVisionary from '@/components/team/TeamVisionary.vue';
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { isTeamError, isTeamLoading, team, refetchTeam } = useAdminTeam(route.params.id.toString());

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '/admin'
  }
]);

const fetchTeamData = async () => {
  await refetchTeam();
};

const onPromoteTeam = () => {
  const courseLevel = team.value.training.courseLevel;
  const teamId = team.value.id;
  switch (courseLevel) {
    case 'FOCUS':
      router.push({ name: 'promote-focus', params: { id: teamId } });
      break;
    case 'YOUR':
      router.push({ name: 'promote-your', params: { id: teamId } });
      break;
    case 'LIFE':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'LIFE_2':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'LIFE_3':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'GRADUATE':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    default:
      console.error(`Nivel desconocido: ${courseLevel}`);
  }
};

const tab = ref('1');
</script>
<template>
  <BaseBreadcrumb :title="'Editar equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6"> </BaseBreadcrumb>
  <vRow>
    <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isTeamLoading">
      <v-progress-circular indeterminate color="primary" class="tw:rounded-t-xl" size="80" width="8" />
    </v-col>
    <v-col cols="12" v-else-if="isTeamError">
      <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
        <Icon icon="material-symbols:search-off-rounded" height="68" class="tw:mb-4" />
        <p class="tw:text-4xl">Error al cargar el equipo</p>
        <p class="tw:text-lg tw:mt-1">Intenta cargar de nuevo</p>
      </div>
    </v-col>
    <v-col cols="12" v-else>
      <TeamBanner :team class="mb-2" />
      <v-row>
        <VCol cols="12" md="3" sm="12" class="tw:flex tw:flex-col tw:items-center">
          <TeamDetails :team />
        </VCol>
        <VCol cols="12" md="9" sm="12" class="tw:grid tw:gap-4">
          <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
            <v-tabs v-model="tab">
              <v-tab value="1">Participantes</v-tab>
              <v-tab value="2" v-if="team.training.courseLevel == 'FOCUS'">Visionarios</v-tab>
              <v-tab value="3"
                v-if="team.training.courseLevel == 'YOUR' || team.training.courseLevel == 'FOCUS'">Staff</v-tab>
              <v-tab value="4" v-if="team.training.courseLevel == 'LIFE'">Master life</v-tab>
            </v-tabs>
            <v-card-text>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="1">
                  <TeamParticipantsList :team="team" :isTeamLoading="isTeamLoading" :isTeamError="isTeamError"
                    @refetchTeam="fetchTeamData" />
                </v-tabs-window-item>
                <v-tabs-window-item value="2" v-if="team.training.courseLevel == 'FOCUS'">
                  <TeamVisionary :team="team" :isTeamLoading="isTeamLoading" :isTeamError="isTeamError"
                    @refetchTeam="fetchTeamData" />
                </v-tabs-window-item>
                <v-tabs-window-item value="3"
                  v-if="team.training.courseLevel == 'YOUR' || team.training.courseLevel == 'FOCUS'">
                  <TeamStaff :team="team" :isTeamLoading="isTeamLoading" :isTeamError="isTeamError"
                    @refetchTeam="fetchTeamData" />
                </v-tabs-window-item>
                <v-tabs-window-item value="4" v-if="team.training.courseLevel == 'LIFE'">
                  <TeamMasterLife :team="team" :isTeamLoading="isTeamLoading" :isTeamError="isTeamError"
                    @refetchTeam="fetchTeamData" />
                </v-tabs-window-item>
              </v-tabs-window>
              <div class="tw:p-4 tw:bg-gray-50">
                <v-btn v-if="team.training.courseLevel !== 'LIFE_GRADUATE'" color="primary" variant="flat" size="large"
                  class="tw:w-full tw:py-3 tw:text-lg tw:rounded-xl tw:shadow-md" @click="onPromoteTeam">
                  🚀 Promover Equipo
                </v-btn>
                <v-btn v-else disabled color="secondary" variant="flat" size="large"
                  class="tw:w-full tw:py-3 tw:text-lg tw:rounded-xl tw:shadow-md">
                  El equipo ya se encuentra graduado.
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </VCol>
      </v-row>
    </v-col>
  </vRow>
</template>

<style scoped></style>
