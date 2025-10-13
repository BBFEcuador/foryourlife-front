<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ViewTrainerTeam from '@/views/trainer/team/ViewTrainerTeam.vue';
import useTrainerTeam from '@/composables/trainer/team/useTrainerTeam.ts';

const route = useRoute();
const teamId = route.params.id as string;
const { team } = useTrainerTeam(teamId);
const breadcrumbs = ref();

</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs" />
  <vRow>
    <v-col cols="12">
      <ViewTrainerTeam :team="team!"/>
    </v-col>
  </vRow>
</template>
<style scoped></style>
