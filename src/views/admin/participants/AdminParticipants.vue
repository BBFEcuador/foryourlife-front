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
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast } from '@/service/sweetAlert';
import InputSection from '@/components/forms/InputSection.vue';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { useRouter } from 'vue-router';

const showFilters = ref(false);
const showFiltersDrawer = ref(false);
const { lgAndUp } = useDisplay();
const { isParticipantsError, isParticipantsLoading, participants, criteriaMutations, refetchParticipants, data } = useParticipants();
const { generateInvitationMutation, generateInvitationWithQuantityMutation } = useInvitation();
const router = useRouter()

const adminStore = userStore();
const headers = [
  {
    title: 'Nombre',
    value: 'name',
    width: '200',
    class: 'tw:text-nowrap',
  },
  {
    title: 'Correo',
    value: 'email',
    width: '200',
  },
  {
    title: 'Equipo',
    value: 'team.name',
    width: '150',
  },
  {
    title: 'Nivel',
    value: 'participantLevel.courseLevel',
    width: '150',
  },
  {
    title: 'Documento',
    value: 'profile.dni',
    width: '100',
  },
  {
    title: 'Acciones',
    value: 'actions',
    align: 'center' as const,
    width: '100',
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
const showInvitationLot = ref(false);
const quantity = ref(1);
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

const handleGenerateInvitation = () => {
  const userId = adminStore.user.id;
  generateInvitationMutation.mutate(
    { userId },
    {
      onSuccess: (data) => {
        invitationLink.value = `${window.location.origin}/register/${data}`;
        showInvitation.value = true;
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
};

const handleGenerateInvitationLot = () => {
  const userId = adminStore.user.id;
  generateInvitationWithQuantityMutation.mutate(
    { id: userId, quantity: quantity.value.toString() },
    {
      onSuccess: (data) => {
        invitationLink.value = `${window.location.origin}/register/${data}`;
        showInvitationLot.value = false;
        showInvitation.value = true;
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
};

const editParticipant = (item: string) => {
  router.push({ name: 'participants-admin-edit', params: { id: item } });
};

const getLevelColor = (level: string) => {
  const colors = {
    'INIT': 'primary',
    'FOCUS': 'secondary',
    'YOUR': 'info',
    'LIFE': 'success',
    'LIFE_1': 'warning',
    'LIFE_2': 'error',
    'LIFE_3': 'darkprimary',
    'MASTER_LIFE': 'background',
    'LIFE_GRADUATE': 'background',
  };  
  return colors[level] || 'gray';
};

const getLevelIcon = (level: string) => {
  const icons = {
    'INIT': 'tabler:circle-number-1',
    'FOCUS': 'tabler:circle-number-2',
    'YOUR': 'tabler:circle-number-3',
    'LIFE': 'tabler:circle-number-4',
    'LIFE_1': 'tabler:circle-number-5',
    'LIFE_2': 'tabler:circle-number-6',
    'LIFE_3': 'tabler:circle-number-7',
    'MASTER_LIFE': 'eos-icons:master-outlined',
    'LIFE_GRADUATE': 'fluent:hat-graduation-sparkle-16-regular',
  };
  return icons[level] || 'mdi:help-circle';
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

  <VRow v-auto-animate>
    <VCol cols="0" lg="3" v-if="lgAndUp && !showFilters" v-motion :initial="{ opacity: 0, x: 20 }"
      :enter="{ opacity: 1, x: 0 }" :delay="100">
      <VCard variant="flat" class="tw:rounded-xl tw:bg-white tw:shadow-sm">
        <UiParentCard title="Filtros">
          <PerfectScrollbar class="tw:max-h-[700px] d-flex flex-column ga-3">
            <ParticipantFilters @update-filters="onFilterSubmit" @clear-filters="onFilterClear" />
          </PerfectScrollbar>
        </UiParentCard>
      </VCard>
    </VCol>
    <VCol cols="12" :lg="showFilters ? 12 : 9">
      <VCard variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-text>
          <VDataTable :items="participants" :headers="headers" :search="search" :loading="isParticipantsLoading"
            :loading-text="'Cargando participantes...'" :no-data-text="'No se encontraron participantes'" hover
            class="tw:rounded-xl elevation-0" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }"
            :delay="200">
            <template #top>
              <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                <div class="tw:flex-1 tw:max-w-md tw:relative">
                  <VTextField v-model="search" placeholder="Buscar equipos..." variant="outlined" density="comfortable"
                    hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm" bg-color="white">
                    <template #prepend-inner>
                      <div class="tw:relative">
                        <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                        <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
                        </div>
                      </div>
                    </template>
                    <template #append v-if="search">
                      <VBtn icon variant="text" size="small" @click="search = ''"
                        class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                        <Icon icon="mdi:close" height="18" />
                      </VBtn>
                    </template>
                  </VTextField>
                </div>
                <VSpacer />
                <VBtn variant="tonal" class="mr-2 tw:bg-secondary/5 hover:tw:bg-secondary/10 tw:transition-all"
                  color="secondary" @click="showFilters = !showFilters" v-if="lgAndUp">
                  <div class="tw:relative">
                    <Icon icon="mdi:filter-variant" class="mr-2" />
                    <div
                      class="tw:absolute tw:-right-1 tw:-top-1 tw:w-2 tw:h-2 tw:bg-secondary tw:rounded-full tw:animate-pulse">
                    </div>
                  </div>
                  Filtros
                </VBtn>
                <VBtn variant="tonal" class="mr-2 tw:bg-secondary/5 hover:tw:bg-secondary/10 tw:transition-all"
                  color="secondary" @click="showFiltersDrawer = !showFiltersDrawer" v-else>
                  <div class="tw:relative">
                    <Icon icon="mdi:filter-variant" class="mr-2" />
                    <div
                      class="tw:absolute tw:-right-1 tw:-top-1 tw:w-2 tw:h-2 tw:bg-secondary tw:rounded-full tw:animate-pulse">
                    </div>
                  </div>
                  Filtros
                </VBtn>
                <VBtn variant="elevated" color="primary" class="mr-2" @click="handleGenerateInvitation"
                  :loading="generateInvitationMutation.isPending.value">
                  <Icon icon="weui:add-friends-filled" class="mr-2" height="20" /> Invitar Participante
                </VBtn>
                <VBtn variant="elevated" color="primary" @click="showInvitationLot = true"
                  :loading="generateInvitationMutation.isPending.value">
                  <Icon icon="weui:add-friends-filled" class="mr-2" height="20" /> Invitar lote
                </VBtn>
              </v-toolbar>
            </template>
            <template #item.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap">
                <div
                  class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                  <Icon icon="mdi:account" class="tw:text-gray-600" />
                </div>
                <div
                    class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-10 tw:transition-opacity">
                  </div>
                  <div>
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                      item.name }}</span>
                    <div class="tw:text-xs  group-hover:tw:opacity-100">{{ item.phone }}</div>
                  </div>
              </div>
            </template>

            <template #item.email="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                <Icon icon="mdi:email" />
                <span>{{ item.email }}</span>
              </div>
            </template>

            <template #item.team.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                <v-chip color="primary">
                  <Icon icon="mdi:account-group" class="mr-2" />
                  <span>{{ item?.team?.name ?? 'No Asignado' }}</span>
                </v-chip>
              </div>
            </template>

            <template #item.participantLevel.courseLevel="{ item }">
              <div class="tw:text-nowrap">
                <VChip
                  :color="item.participantLevel.courseLevel === 'LIFE_GRADUATE' ? undefined : getLevelColor(item.participantLevel.courseLevel)"
                  variant="flat"
                  class="!tw:font-medium tw:min-w-[120px] !tw:justify-center tw:transition-all group-hover:tw:shadow-md group-hover:tw:scale-105"
                  :class="{ 'animated-gradient': item.participantLevel.courseLevel === 'LIFE_GRADUATE' }" size="small">
                  <div class="tw:relative">
                    <Icon :icon="getLevelIcon(item.participantLevel.courseLevel)" height="20"
                      class="mr-2 tw:transition-transform group-hover:tw:scale-110" />
                  </div>
                  <div v-if="item.participantLevel.courseLevel === 'LIFE_GRADUATE'">GRADUADO</div>
                  <div v-else>{{ item.participantLevel.courseLevel }}</div>
                </VChip>
              </div>
            </template>

            <template #item.actions="{ item }">
              <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-nowrap">
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
        </v-card-text>
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

  <VDialog v-model="showInvitationLot" width="500">
    <UiParentCard title="Generar invitaciones">
      <InputSection label="Usos">
        <VNumberInput variant="outlined" placeholder="cantidad de usos para este token" v-model="quantity" :min="1" />
      </InputSection>
      <div class="tw:flex tw:justify-end">
        <VBtn color="primary" @click="handleGenerateInvitationLot"
          :loading="generateInvitationWithQuantityMutation.isPending.value">Generar</VBtn>
      </div>
    </UiParentCard>
  </VDialog>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}

.animated-gradient {
  background: linear-gradient(-45deg, #ffa63d, #ff3d77, #338aff, #3cf0c5);
  background-size: 600%;
  animation: anime 12s linear infinite;
  color: rgba(255, 255, 255, 90%) !important;
}

@keyframes anime {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
