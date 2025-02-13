<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useParticipants from '@/composables/admin/participants/useParticipants';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import ParticipantFilters from './ParticipantFilters.vue';
import type { Criteria, Filter } from '@/models/Criteria';
import useInvitation from '@/composables/invitation/useInvitation';

const showFilters = ref(false);
const showFiltersDrawer = ref(false);
const { lgAndUp } = useDisplay();
const { isParticipantsError, isParticipantsLoading, participants, criteriaMutations, refetchParticipants, data } = useParticipants();
const { generateInvitationMutation } = useInvitation()
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel actual', value: 'participantLevel.courseLevel' },
  { title: 'Documento', value: 'profile.dni' },
  { title: 'Acciones', value: 'actions', width: 50 }
];

const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const onFilterSubmit = (criteria: Criteria) => {
  criteriaMutations.mutate(criteria);
};

const onFilterClear = () => {
  criteriaMutations.mutate({ filters: [] as Filter[], limit: 0, offset: 0 });
};

const showInvitation = ref(false);
const userId = "FFJKHkjhJKHhjfJKJFzx365jjf";
const invitationLink = ref('') 
const copied = ref(false);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error("Error al copiar el enlace:", err);
  }
};

const handleGenerateInvitation = async () => {
  const userId = "3936ae5e-0cc1-4375-abc7-520d16999110"; 
  generateInvitationMutation.mutate(
    { userId },
    {
      onSuccess: (data) => {
        const { token, userId } = data;

        invitationLink.value = `http://localhost:8080/invite/${userId}?token=${token}`;
        showInvitation.value = true;
      },
      onError: (error) => {
        console.error('Error al generar la invitación:', error);
      },
    }
  );
};
// const onInvit = () => {
//   generateInvitationMutation.mutate({userId:"3936ae5e-0cc1-4375-abc7-520d16999110"})
// }

</script>
<template>
  <BaseBreadcrumb :title="'Participantes'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters">
      <UiParentCard title="Filtros">
        <PerfectScrollbar class="max-h d-flex flex-column ga-3">
          <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
        </PerfectScrollbar>
      </UiParentCard>
    </VCol>
    <VCol cols="12" :lg="showFilters ? 12 : 9">
      <div class="d-flex flex-column ga-4">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <div class="w-full d-flex">
              <VTextField placeholder="buscar" hide-details>
                <template #prepend-inner>
                  <Icon icon="material-symbols:search" />
                </template>
              </VTextField>
              <VSpacer />

              <VBtn color="primary" @click="handleGenerateInvitation">
                <Icon icon="material-symbols:add-rounded" />
              </VBtn>
              <v-dialog v-model="showInvitation" width="700">
                <v-card>
                  <v-card-title></v-card-title>
                  <v-card-item>
                    <v-text-field type="text" v-model="invitationLink" readonly />
                    <VBtn @click="copyLink">Copiar enlace</VBtn>
                    <p v-if="copied" style="color: green;">¡Enlace copiado!</p>
                  </v-card-item>
                </v-card>
              </v-dialog>
              <VBtn variant="text" @click="showFilters = !showFilters" v-if="lgAndUp">
                <template #prepend>
                  <Icon icon="material-symbols:filter-alt" height="16" />
                </template>
                <p>Filtros</p>
              </VBtn>
              <VBtn variant="text" @click="showFiltersDrawer = !showFiltersDrawer" v-else>
                <template #prepend>
                  <Icon icon="material-symbols:filter-alt" height="16" />
                </template>
                <p>Filtros</p>
              </VBtn>
            </div>
          </v-card-text>
        </v-card>
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTable :items="participants" :loading="isParticipantsLoading || criteriaMutations.isPending.value"
              :headers="headers">
            </VDataTable>
          </v-card-text>
        </v-card>
      </div>
    </VCol>
    <Teleport to="body">
      <VNavigationDrawer temporary v-model="showFiltersDrawer">
        <UiParentCard title="Filtros">
          <ParticipantFilters />
        </UiParentCard>
      </VNavigationDrawer>
    </Teleport>
  </VRow>
</template>

<style scoped>
.max-h {
  max-height: 700px;
}
</style>
