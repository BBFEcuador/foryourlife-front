<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ViewTrainerTeam from '@/views/trainer/team/ViewTrainerTeam.vue';
import useTrainerTeam from '@/composables/trainer/team/useTrainerTeam.ts';

const route = useRoute();
const teamId = route.params.id as string;
const { team, isTeamLoading, isTeamError } = useTrainerTeam(teamId);
const breadcrumbs = ref();
</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs" homeRoute="trainer-home" />
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
    <v-col v-else cols="12">
      <ViewTrainerTeam :team="team!" />
    </v-col>
  </vRow>
</template>
<style scoped></style>
