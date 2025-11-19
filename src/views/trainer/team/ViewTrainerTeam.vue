<script setup lang="ts">
import type { Team } from '@/models/Participants.ts';
import TeamBanner from '@/components/team/TeamBanner.vue';
import TeamMasterLifeDashboard from '@/components/team/TeamMasterLifeDashboard.vue';
import TeamFocusDashboard from '@/components/team/TeamFocusDashboard.vue';
interface TrainerTeamProps {
  team: Team;
}

const props = defineProps<TrainerTeamProps>();
</script>

<template>
  <TeamBanner :team class="mb-5" />
  <!-- LIFE DASHBOARD -->
  <TeamMasterLifeDashboard v-if="team?.trainingData?.curseLevel?.includes('LIFE')" :team="team" class="mb-2" />
  <!-- YOUR DASHBOARD -->

  <!-- FOCUS DASHBOARD -->
  <TeamFocusDashboard v-if="team?.trainingData?.curseLevel?.includes('FOCUS')" :team="team" class="mb-2" />
</template>
<style scoped></style>
