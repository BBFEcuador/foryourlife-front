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
import { userStore } from '@/stores/useStore';
import { router } from '@/router';

const showFilters = ref(false);
const showFiltersDrawer = ref(false);
const { lgAndUp } = useDisplay();
const { isParticipantsError, isParticipantsLoading, participants, criteriaMutations, refetchParticipants, data } = useParticipants();
const { generateInvitationMutation } = useInvitation();
const adminStore = userStore();
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel actual', value: 'participantLevel.courseLevel' },
  { title: 'Documento', value: 'profile.dni' },
  { title: 'Acciones', value: 'actions', width: 50 }
];

const participantsTest = [
  {
    name: 'Nombre1',
    email: 'correo1',
    phone: 'telefono1',
    participantLevel: { courseLevel: 'nivel1' },
    profile: { dni: 'documento1' }
  },
  {
    name: 'Nombre2',
    email: 'correo2',
    phone: 'telefono2',
    participantLevel: { courseLevel: 'nivel2' },
    profile: { dni: 'documento2' }
  },
  {
    name: 'Nombre3',
    email: 'correo3',
    phone: 'telefono3',
    participantLevel: { courseLevel: 'nivel3' },
    profile: { dni: 'documento3' }
  }
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
const invitationLink = ref('');
const copied = ref(false);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error('Error al copiar el enlace:', err);
  }
};

const handleGenerateInvitation = async () => {
  const userId = adminStore.user.id;
  generateInvitationMutation.mutate(
    { userId },
    {
      onSuccess: (data) => {
        invitationLink.value = `${window.location.origin}/register/${data}`;
        showInvitation.value = true;
      },
      onError: (error) => {
        console.error('Error al generar la invitación:', error);
      }
    }
  );
};

const editParticipant = (item: string) => {
  router.push({ name: 'participants-admin-edit', params: { id: item } });
};
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

              <VBtn icon color="secondary" variant="text" @click="handleGenerateInvitation">
                <Icon icon="weui:add-friends-filled" height="20" />
              </VBtn>
              <v-dialog v-model="showInvitation" class="mx-auto" width="500">
                <v-card>
                    <v-card-title class="text-h3 font-weight-bold">
                      Invitar Participante
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="invitationLink" readonly outlined dense hide-details class="mb-2">
                        <template v-slot:append>
                          <v-btn color="primary" variant="flat" rounded @click="copyLink">
                            Copiar enlace
                          </v-btn>
                        </template>
                      </v-text-field>
                      <p v-if="copied" color="success" class="text-caption">¡Enlace copiado!</p>
                    </v-card-text>
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
              <template v-slot:item.actions="{ item }">
                <VBtn icon color="primary" @click="editParticipant(item.id)">
                  <Icon icon="akar-icons:edit" />
                </VBtn>
                </template>
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
