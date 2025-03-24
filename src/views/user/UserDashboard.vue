<script setup lang="ts">
// imported components
import WelcomeBanner from '../dashboards/default/components/WelcomeBanner.vue';
import ProjectCard from '../dashboards/default/components/ProjectCard.vue';
import TransactionCard from '../widgets/data/components/TransactionCard.vue';
</script>

<template>
  <v-row class="my-0">
    <v-col cols="12">
      <WelcomeBanner />
    </v-col>
  </v-row>
  <!-- <v-row class="mb-0">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <ProjectCard />
        </v-col>
      </v-row>
    </v-col>
  </v-row> -->
</template>
