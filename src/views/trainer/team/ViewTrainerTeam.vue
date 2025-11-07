<script setup lang="ts">
import type { Team } from '@/models/Participants.ts';
import TeamBanner from '@/components/team/TeamBanner.vue';
import TeamDetails from '@/components/team/TeamDetails.vue';

interface TrainerTeamProps {
  team: Team;
}

const props  = defineProps<TrainerTeamProps>();
// const items = [
//   {
//     title: 'FDS1'
//   },
//   {
//     title: 'FDS2'
//   },
//   {
//     title: 'FDS3'
//   }
// ];
</script>

<template>
  <TeamBanner :team class="mb-2" />
    <!-- <v-row>
      <VCol cols="12" md="12" sm="12" class="tw:grid tw:gap-4">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <div v-if="team?.trainingData?.curseLevel == 'LIFE'">
              <h2 class="text-h5 mb-4">LifeDashboard</h2>
              <v-expansion-panels multiple>
                <v-expansion-panel v-for="(item, index) in items" :key="index">
                  <v-expansion-panel-title>
                    {{ item.title }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text> </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
      </VCol>
    </v-row> -->
</template>
<style scoped></style>
