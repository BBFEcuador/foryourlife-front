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
import ViewTeam from './ViewTeam.vue';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

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
  <div v-if="checkPermission(PermissionEnum.UPDATE_TEAMS)">
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
        <ViewTeam :team="team" :is-team-error="isTeamError" :is-team-loading="isTeamLoading" :is-for-edit="true" />
      </v-col>
    </vRow>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>

<style scoped></style>
