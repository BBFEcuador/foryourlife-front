<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ViewTrainerTeam from '@/views/trainer/team/ViewTrainerTeam.vue';
import useTrainerTeam from '@/composables/trainer/team/useTrainerTeam.ts';

const route = useRoute();
const teamId = route.params.id as string;
const { team, isTeamLoading } = useTrainerTeam(teamId);
const breadcrumbs = ref();
</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs" />
  <vRow>
    <v-col cols="12">
      <div v-if="isTeamLoading" class="text-center pa-4">
        <VProgressLinear color="primary" indeterminate class="tw:rounded-t-xl" height="2" />
        <div class="tw:flex tw:justify-center tw:py-12 tw:bg-gray-50/30">
          <div class="tw:flex tw:items-center tw:gap-4 tw:bg-white tw:px-6 tw:py-6 tw:rounded-2xl tw:shadow-lg">
            <VProgressCircular indeterminate color="primary" size="24" width="3" />
            <div class="ma-3 tw:m-4">
              <p class="tw:font-medium tw:text-gray-700">Cargando datos</p>
              <p class="tw:text-sm tw:text-gray-500">Por favor espere...</p>
            </div>
          </div>
        </div>
      </div>
      <ViewTrainerTeam v-else :team="team!" />
    </v-col>
  </vRow>
</template>
<style scoped></style>
