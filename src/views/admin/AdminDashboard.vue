<script setup lang="ts">
// imported components
import ChartCards from '@/views/widgets/chart/components/ChartCards.vue';
import RepeatCustomer from '@/views/widgets/chart/components/RepeatCustomer.vue';
import ProjectOverview from '@/views/widgets/chart/components/ProjectOverview.vue';
import UserCard from '@/views/widgets/statistics/components/UserCard.vue';
import TransactionCard from '@/views/widgets/data/components/TransactionCard.vue';
import TotalIncome from '@/views/widgets/chart/components/TotalIncome.vue';
import ProjectCard from '../dashboards/default/components/ProjectCard.vue';
import { adminStore } from '@/stores/adminStore';

const stores = adminStore();
</script>

<template>
    <h3 class="text-h3 tw:font-semibold pb-3">¡Hola, {{ stores.user.name }}!</h3>
  <ChartCards />

  <v-row class="mb-0">
    <v-col cols="12" xl="9" md="8">
      <v-row>
        <v-col cols="12">
          <RepeatCustomer />
        </v-col>
        <v-col cols="12">
          <ProjectOverview />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" xl="3" md="4">
      <v-row>
        <v-col cols="12">
          <ProjectCard />
        </v-col>
        <v-col cols="12">
          <UserCard />
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="6">
      <TransactionCard />
    </v-col>
    <v-col cols="12" md="6">
      <TotalIncome />
    </v-col>
  </v-row>
</template>
