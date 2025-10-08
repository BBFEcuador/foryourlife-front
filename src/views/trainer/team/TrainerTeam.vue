<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';
import type { Team } from '@/models/Participants.ts';
import { trainerStore } from '@/stores/trainerStore.ts';
import { useRoute } from 'vue-router';

const store = trainerStore();
const route = useRoute();

const teamId = route.params.id as string;

const team = store.trainer.teams.find((t: Team) => t.id === teamId);

const breadcrumbs = ref();
</script>

<template>
  <BaseBreadcrumb :title="'Equipo'" :breadcrumbs="breadcrumbs" />
  {{ team }}
</template>

<style scoped></style>
