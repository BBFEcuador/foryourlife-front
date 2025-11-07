<script setup lang="ts">
import IntroCard from '@/components/participants/IntroCard.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import InvitedEnrolled from '@/components/participants/InvitedEnrolled.vue';
import ModuleUpdate from '@/components/participants/ModuleUpdate.vue';
import ParticipantBanner from '@/components/participants/ParticipantBanner.vue';
import ParticipantUpdate from '@/components/participants/ParticipantUpdate.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useParticipant from '@/composables/admin/participants/useParticipant';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const route = useRoute();

const breadcrumbs = ref([
  {
    title: 'Participantes',
    disabled: false,
    href: '/admin/participants'
  }
]);
const { isParticipantError, isParticipantLoading, participant } = useParticipant(route.params.id.toString());
</script>
<template>
  <BaseBreadcrumb :title="'Editar participante'" :breadcrumbs="breadcrumbs" />
  <div v-if="checkPermission(PermissionEnum.UPDATE_PARTICIPANTS)">
    <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isParticipantLoading">
      <v-progress-circular indeterminate color="primary" size="80" width="8">
        <template #default="slotProps"></template>
      </v-progress-circular>
    </v-col>
    <v-col cols="12" v-else-if="isParticipantError">
      <v-alert type="error">Error al cargar el participante</v-alert>
    </v-col>
    <div v-else>
      <ParticipantBanner  :participant />
      <v-row dense class="mt-4">
        <VCol cols="12" md="4" sm="12" class="tw:flex tw:flex-col tw:items-center tw:gap-y-4">
          <IntroCard :participant />
          <InvitedEnrolled :token="participant.invitationToken" :id="participant.id" />
        </VCol>
        <VCol cols="12" md="5" sm="12" class="tw:flex tw:flex-col tw:items-center">
          <ParticipantUpdate :participant />
        </VCol>
        <VCol cols="12" md="3" sm="12" class="tw:flex tw:flex-col tw:items-center">
          <ModuleUpdate :participant />
        </VCol>
      </v-row>
    </div>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>

<style scoped></style>
