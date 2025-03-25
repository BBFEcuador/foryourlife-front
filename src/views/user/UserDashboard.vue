<script setup lang="ts">
// imported components
import WelcomeBanner from '../dashboards/default/components/WelcomeBanner.vue';
import ProjectCard from '../dashboards/default/components/ProjectCard.vue';
import TransactionCard from '../widgets/data/components/TransactionCard.vue';
import QrComponent from '@/layouts/dashboard/QrComponent.vue';
import useUserActiveInvitation from '@/composables/participants/invitation/useUserActiveInvitation';
import { Icon } from '@iconify/vue/dist/iconify.js';

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
        <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:bg-gray-50/30">
        <div class="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-gray-100 tw:to-transparent tw:opacity-50"></div>
        <div class="tw:relative tw:z-10">
          <Icon icon="fluent-color:warning-32" height="64" class="tw:text-gray-400 tw:mb-2" />
          <div class="tw:absolute tw:-top-1 tw:-right-1">
            <div class="tw:relative">
              <Icon icon="mdi:close-circle" class="tw:text-red-500" height="24" />
              <div class="tw:absolute tw:inset-0 tw:bg-red-500 tw:opacity-25 tw:blur-sm tw:rounded-full"></div>
            </div>
          </div>
        </div>
        <h3 class="tw:text-xl tw:font-medium tw:text-gray-700 tw:mb-2">{{ getErrorMessage() }}</h3>        
      </div>
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
