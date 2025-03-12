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
  { 
    title: 'Nombre',
    value: 'name',
    class: 'my-header-style',
    width: '25%',
  },
  { 
    title: 'Correo',
    value: 'email',
    width: '25%',
  },
  { 
    title: 'Telefono',
    value: 'phone',
    width: '15%',
  },
  { 
    title: 'Nivel actual',
    value: 'participantLevel.courseLevel',
    width: '20%',
  },
  { 
    title: 'Documento',
    value: 'profile.dni',
    width: '10%',
  },
  { 
    title: 'Acciones',
    value: 'actions',
    align: 'center' as const,
    width: '15%',
    sortable: false,
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

const search = ref();

</script>

<template>
  <BaseBreadcrumb :title="'Participantes'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    <template #action>
      <VBtn color="primary" variant="elevated" @click="handleGenerateInvitation">
        <Icon icon="mdi:account-plus" class="tw:mr-2" />
        Invitar Participante
      </VBtn>
    </template>
  </BaseBreadcrumb>

  <VRow >
    <VCol v-if="showFilters && lgAndUp" cols="0" lg="3" v-motion :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0 }"
      :delay="100">
      <VCard variant="flat" class="tw:rounded-xl tw:bg-white tw:shadow-sm">
        <UiParentCard title="Filtros">
          <PerfectScrollbar class="tw:max-h-[700px] d-flex flex-column ga-3">
            <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
          </PerfectScrollbar>
        </UiParentCard>
      </VCard>
    </VCol>

    <VNavigationDrawer v-model="showFiltersDrawer" location="left" temporary>
      <div class="tw:p-6">
        <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
      </div>
    </VNavigationDrawer>
    <VCol :cols="showFilters && lgAndUp ? 9 : 12" class="d-flex justify-end tw:h-min">
      <VCard variant="flat" class="tw:rounded-xl tw:bg-white tw:shadow-sm">
        <div class="tw:p-6 ">
          <VDataTable :items="participants" :headers="headers" :search="search" :loading="isParticipantsLoading"
            :loading-text="'Cargando participantes...'" :no-data-text="'No se encontraron participantes'" hover
            class="tw:rounded-xl elevation-0" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }"
            :delay="200">
            <template #top>
              <v-toolbar class="px-6 bg-surface" flat v-motion :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                <div class="tw:flex-1 tw:max-w-md tw:relative">
                  <VTextField v-model="search" placeholder="Buscar por nombre, email o teléfono..." variant="outlined"
                    density="comfortable" hide-details class="tw:rounded-lg" bg-color="white">
                    <template #prepend-inner>
                      <Icon icon="mdi:magnify" height="18" />
                    </template>
                    <template #append v-if="search">
                      <VBtn icon variant="text" size="small" @click="search = ''">
                        <Icon icon="mdi:close" height="18" />
                      </VBtn>
                    </template>
                  </VTextField>
                </div>
                <v-spacer></v-spacer>
                <VBtn variant="elevated" color="secondary" @click="showFilters = !showFilters" v-if="lgAndUp"
                  class="!tw:font-normal mr-2">
                  <Icon icon="mdi:filter" class="mr-2" />
                  Filtros
                </VBtn>
                <VBtn variant="elevated" color="secondary" @click="showFiltersDrawer = !showFiltersDrawer" v-else
                  class="!tw:font-normal mr-2" >
                  <Icon icon="mdi:filter" class="mr-2" />
                  Filtros
                </VBtn>
                <VBtn variant="elevated" color="primary" @click="handleGenerateInvitation">
                  <Icon icon="weui:add-friends-filled" class="mr-2" height="20" /> Invitar Participante
                </VBtn>
              </v-toolbar>
            </template>
            <template #item.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3">
                <div
                  class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                  <Icon icon="mdi:account" class="tw:text-gray-600" />
                </div>
                <span class="tw:font-medium">{{ item.name }}</span>
              </div>
            </template>

            <template #item.email="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2">
                <Icon icon="mdi:email" />
                <span>{{ item.email }}</span>
              </div>
            </template>

            <template #item.phone="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2">
                <Icon icon="mdi:phone" />
                <span>{{ item.phone }}</span>
              </div>
            </template>

            <template #item.participantLevel.courseLevel="{ item }">
              <VChip
                :color="item.participantLevel.courseLevel === 'FOCUS' ? 'primary' : item.participantLevel.courseLevel === 'YOUR' ? 'secondary' : 'success'"
                variant="flat" class="!tw:font-normal" size="small">
                {{ item.participantLevel.courseLevel }}
              </VChip>
            </template>

            <template #item.actions="{ item }">
              <div class="tw:flex tw:items-center tw:justify-center tw:gap-2">
                <VBtn icon variant="text" color="primary" height="32"
                  class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                  v-tooltip="'Editar participante'" @click="editParticipant(item.id)">
                  <Icon icon="mdi:pencil" />
                </VBtn>
              </div>
            </template>

            <template #loading>
              <VProgressLinear color="primary" indeterminate class="tw:rounded-t-xl" />
            </template>

            <template #no-data>
              <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="mdi:account-search" height="48" class="tw:mb-4" />
                <p class="tw:text-lg">No se encontraron participantes</p>
                <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </template>
          </VDataTable>
        </div>
      </VCard>
    </VCol>


  </VRow>

  <VDialog v-model="showInvitation" width="500">
    <VCard class="tw:rounded-xl">
      <VCardTitle class="tw:p-6 tw:pb-0">
        <h3 class="tw:text-xl tw:font-medium">Invitar Participante</h3>
      </VCardTitle>
      <VCardText class="tw:p-6">
        <VTextField v-model="invitationLink" readonly variant="outlined" density="comfortable" hide-details
          class="tw:mb-2">
          <template #append>
            <VBtn color="primary" variant="elevated" @click="copyLink" class="!tw:font-normal">
              {{ copied ? 'Copiado!' : 'Copiar enlace' }}
            </VBtn>
          </template>
        </VTextField>
      </VCardText>
    </VCard>
  </VDialog>
</template>
