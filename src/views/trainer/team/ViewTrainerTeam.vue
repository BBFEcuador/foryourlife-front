<script setup lang="ts">
import type { Team } from '@/models/Participants.ts';
import TeamBanner from '@/components/team/TeamBanner.vue';

interface TrainerTeamProps {
  team: Team
}
const props = defineProps<TrainerTeamProps>();
</script>

<template>
<!--  {{team}}-->
  <TeamBanner :team />
  <VDataTable>

  </VDataTable>
</template>
<style scoped>

</style>
