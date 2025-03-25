<script setup lang="ts">
// imported components
import WelcomeBanner from '../dashboards/default/components/WelcomeBanner.vue';
import ProjectCard from '../dashboards/default/components/ProjectCard.vue';
import TransactionCard from '../widgets/data/components/TransactionCard.vue';
import QrComponent from '@/layouts/dashboard/QrComponent.vue';
import useUserActiveInvitation from '@/composables/participants/invitation/useUserActiveInvitation';

const { data,error,isError,isFetching,refetch } = useUserActiveInvitation()


const getErrorMessage = () => {
  return error.value?.response?.data?.message ?? "Error en el servidor"
}
</script>

<template>
  <v-row class="my-0">
    <v-col cols="12">
      <WelcomeBanner @link-create="(params) => {
        refetch()
      }"/>
    </v-col>
  </v-row>
  <v-row class="mb-0" v-if="isFetching">
    <v-col cols="12" >
      <div class="tw:w-full tw:h-96 tw:grid tw:place-content-center">
        <VProgressCircular indeterminate/>
      </div>
    </v-col>
  </v-row>
  <v-row class="mb-0" v-else-if="isError">
    <v-col cols="12" >
      <div class="tw:w-full tw:h-96 tw:grid tw:place-content-center">
        {{ getErrorMessage() }}
      </div>
    </v-col>
  </v-row>
  <v-row class="mb-0" v-else>
    <v-col cols="12" md="6">
      <QrComponent :invitations="data!"/>
    </v-col>
    
    <!-- <v-col cols="12" md="6">
      <v-col cols="12">
        <ProjectCard />
      </v-col>
    </v-col> -->
  </v-row>
</template>
