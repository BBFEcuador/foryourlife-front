<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TrainerSelect from './TrainerSelect.vue';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Trainers } from '@/models/Trainers';
import ParticipantsSelect from '@/components/team/ParticipantsSelect.vue';
import NewParticipantsSelect from '@/components/team/NewParticipantsSelect.vue';
import NewStaffSelect from '@/components/team/NewStaffSelect.vue';
import MasterlifeSelect from '@/components/team/MasterlifeSelect.vue';
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import NewMasterlifeSelect from '@/components/team/NewMasterlifeSelect.vue';

const breadcrumbs = ref([
  {
    title: 'Equipos',
    disabled: false,
    href: '/admin'
  }
]);

const route = useRoute();
const router = useRouter();
const { isTeamError, isTeamLoading, team, refetchTeam, promotionLifeRequest } = useAdminTeam(route.params.id.toString());

const trainers = ref<Trainers[]>([]);
const { availableTrainerMutation } = useTrainerMutations();
const { promoteToLifeMutation, promoteToLife2Mutation, promoteToLife3Mutation, promoteToLifeGraduateMutation } = useAdminTeamMutations();

const showTrainerSelect = ref(false);

const handleTrainerSelected = (trainer: Trainers[]) => {
  team.value.trainer = trainer[0];
  showTrainerSelect.value = false;
};
const loadAvailableTrainers = async () => {
  if (showTrainerSelect.value) {
    showTrainerSelect.value = false;
    trainers.value = [];
    return;
  }

  const params = {
    startDate: team.value?.training?.nextLevel.startDate || '',
    endDate: team.value?.training?.nextLevel.endDate || ''
  };

  availableTrainerMutation.mutate(params, {
    onSuccess(data) {
      trainers.value = data;
      showTrainerSelect.value = true;
    },
    onError(e) {
      let error = e as AxiosError<ErrorApiResponse>;
      showErrorToast(error);
    }
  });
};
const tab = ref('actualParticipants');
const tab2 = ref('actualMasterlife');

const activeTab = ref(0);

const tabs = ref([
  { label: 'Entrenador', icon: 'cbi:roomsgym', color: 'primary' },
  { label: 'Participantes', icon: 'mdi:account-multiple', color: 'info' },
  { label: 'Masterlife', icon: 'eos-icons:master-outlined', color: 'success' }
]);

const setActiveTab = (index: number) => {
  activeTab.value = index;
};

const showConfirmDialog = ref(false);

const getPromotionMutation = () => {
  const currentLevel = team.value?.training?.nextLevel?.courseLevel;
  switch (currentLevel) {
    case 'LIFE':
      return promoteToLifeMutation;
    case 'LIFE2':
      return promoteToLife2Mutation;
    case 'LIFE3':
      return promoteToLife3Mutation;
    case 'GRADUATE':
      return promoteToLifeGraduateMutation;
    default:
      return promoteToLifeMutation;
  }
};

const isGraduation = computed(() => {
  return team.value?.training?.nextLevel?.courseLevel === 'GRADUATE';
});

const promotionButtonText = computed(() => {
  return isGraduation.value ? 'Graduar' : 'Promover';
});

const onPromoteTeam = () => {
  const mutation = getPromotionMutation();
  mutation.mutate(promotionLifeRequest.value);
  showConfirmDialog.value = false;
};

watch(
  [promoteToLifeMutation.isError, promoteToLife2Mutation.isError, promoteToLife3Mutation.isError, promoteToLifeGraduateMutation.isError],
  () => {
    const mutation = getPromotionMutation();
    if (mutation.isError.value) {
      let error = mutation.error.value as AxiosError<ErrorApiResponse>;
      showErrorToast(error);
    }
  }
);

watch(
  [
    promoteToLifeMutation.isSuccess,
    promoteToLife2Mutation.isSuccess,
    promoteToLife3Mutation.isSuccess,
    promoteToLifeGraduateMutation.isSuccess
  ],
  () => {
    const mutation = getPromotionMutation();
    if (mutation.isSuccess.value) {
      router.push({ name: 'teams-admin' });
    }
  }
);

const isPromoting = computed(() => {
  const mutation = getPromotionMutation();
  return mutation.isPending.value;
});
</script>
<template>
  <BaseBreadcrumb :title="'Promover equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6"></BaseBreadcrumb>
  <v-container>
    <VRow v-if="isTeamLoading">
      <VCol cols="12">
        <div class="tw:grid tw:place-content-center tw:h-96">
          <VProgressCircular indeterminate color="primary" size="40" class="tw:mx-auto" />
        </div>
      </VCol>
    </VRow>
    <VRow v-else-if="isTeamError">
      <VCol cols="12">
        <v-alert type="error" variant="tonal" class="tw:mb-4 tw:rounded-lg" border="start" elevation="2">
          Error cargando el equipo. Por favor intente nuevamente.
        </v-alert>
      </VCol>
    </VRow>
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200">
          <v-card-item>
            <v-card-title class="d-flex align-center tw:gap-4">
              <div class="tw:bg-primary tw:bg-opacity-10 tw:p-2 tw:rounded-lg">
                <Icon icon="mdi:account-group" size="32" class="text-primary" />
              </div>
              <span class="tw:flex-1">
                Promover al equipo "<strong class="text-primary">{{ team.name }}</strong
                >" al nivel
                <v-chip color="info" variant="tonal" class="tw:ml-2">
                  {{ team?.training?.nextLevel?.courseLevel }}
                </v-chip>
              </span>
              <v-btn
                v-if="team.training.courseLevel === 'LIFE_3'"
                color="primary"
                variant="flat"
                class="tw:rounded-lg"
                @click="showConfirmDialog = true"
              >
                GRADUAR EL EQUIPO 🚀
              </v-btn>
              <v-btn v-else color="primary" @click="showConfirmDialog = true" variant="flat" class="tw:rounded-lg">
                <Icon icon="mdi:check" class="mr-2" />
                Promover
              </v-btn>
            </v-card-title>
          </v-card-item>
        </v-card>
      </v-col>

      <VCol cols="12">
        <v-card elevation="2" class="tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200">
          <v-card-title class="d-flex align-center tw:gap-4"> Nombre del equipo </v-card-title>
          <VCardSubtitle>
            <p>Puede asignar un nombre personalizado al equipo, de no asignarlo se quedara con el nombre del entrenamiento (LIFE-100)</p>
          </VCardSubtitle>
          <VCardItem>
            <VTextField placeholder="Nombre del equipo" v-model="promotionLifeRequest.name" />
          </VCardItem>
        </v-card>
      </VCol>

      <v-col cols="12">
        <v-row class="tw:py-6">
          <v-col cols="12" sm="4" v-for="(tab, index) in tabs" :key="index">
            <v-card
              :color="activeTab === index ? tab.color : undefined"
              :variant="activeTab === index ? 'flat' : 'tonal'"
              v-motion
              :initial="{ opacity: 0, y: -10 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="200 * (index + 1)"
              :duration="150"
              :elevation="activeTab === index ? 3 : 1"
              class="tw:cursor-pointer tw:transition-all tw:duration-300 tw:ease-in-out tw:rounded-xl tw:border hover:tw:scale-102"
              :class="{ 'tw:border-primary': activeTab === index }"
              @click="setActiveTab(index)"
            >
              <v-card-title class="tw:py-6 tw:flex tw:items-center tw:justify-center tw:gap-3">
                <Icon :icon="tab.icon" height="26" />
                {{ tab.label }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-card
          class="tw:mb-4 fill-height tw:rounded-xl"
          elevation="2"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
          :duration="150"
          v-if="activeTab === 0"
        >
          <v-card-item>
            <v-card-title class="tw:mb-6 tw:flex tw:items-center tw:gap-3">
              <div class="tw:bg-primary tw:bg-opacity-10 tw:p-2 tw:rounded-lg">
                <Icon icon="map:gym" size="32" class="text-primary" />
              </div>
              <span class="tw:flex-1">
                Entrenador actual:
                <strong class="text-primary">{{ team.trainer?.name || 'No asignado' }}</strong>
              </span>
            </v-card-title>
            <v-card-text class="tw:mb-4">
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-4">
                <span class="tw:text-gray-600">¿Deseas cambiar el entrenador del equipo?</span>
                <v-btn
                  :color="showTrainerSelect ? 'error' : 'primary'"
                  :variant="showTrainerSelect ? 'outlined' : 'flat'"
                  @click="loadAvailableTrainers"
                  class="tw:rounded-lg"
                >
                  <Icon :icon="showTrainerSelect ? 'mdi:close' : 'material-symbols:change-circle-outline'" class="tw:mr-2" />
                  {{ showTrainerSelect ? 'Cancelar cambio' : 'Cambiar entrenador' }}
                </v-btn>
              </div>
            </v-card-text>
            <v-expand-transition>
              <TrainerSelect v-if="showTrainerSelect" :trainer="trainers" @trainer-selected="handleTrainerSelected" class="tw:mt-4" />
            </v-expand-transition>
          </v-card-item>
        </v-card>

        <v-card
          elevation="2"
          class="fill-height tw:rounded-xl"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
          :duration="150"
          v-if="activeTab === 1"
        >
          <v-card-item>
            <v-card-title class="tw:mb-6 tw:flex tw:items-center tw:gap-3">
              <div class="tw:bg-info tw:bg-opacity-10 tw:p-2 tw:rounded-lg">
                <Icon icon="mdi:account-multiple" size="32" class="text-info" />
              </div>
              <span class="tw:flex-1">
                Participantes actuales:
                <v-chip color="info" variant="tonal" class="tw:ml-2">
                  {{ team.users.length }}
                </v-chip>
              </span>
            </v-card-title>
            <v-tabs v-model="tab" color="primary" align-tabs="center" class="tw:border-b" slider-color="primary">
              <v-tab value="actualParticipants" class="text-none tw:py-4">
                <Icon icon="mdi:account-multiple" class="mr-2" />
                Participantes actuales
              </v-tab>
            </v-tabs>
            <v-card-text class="tw:p-0">
              <v-window v-model="tab" class="tw:mt-4">
                <v-window-item value="actualParticipants">
                  <NewParticipantsSelect :team="team" v-model="promotionLifeRequest.users" />
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card-item>
        </v-card>
        <v-card
          class="mb-4"
          elevation="1"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
          :duration="150"
          v-if="activeTab === 2"
        >
          <v-card-item>
            <v-card-title class="tw:mb-6 tw:flex tw:items-center tw:gap-3">
              <div class="tw:bg-primary tw:bg-opacity-10 tw:p-2 tw:rounded-lg">
                <Icon icon="ic:twotone-support-agent" size="32" class="mr-2 text-primary" />
              </div>
              <span class="tw:text-1">
                Masterlife Actual:
                <v-chip color="info" variant="tonal" class="tw:ml-2">
                  {{ team.masterLife?.length }}
                </v-chip>
              </span>
            </v-card-title>
            <v-tabs v-model="tab2" color="primary" align-tabs="center" class="tw:border-b" slider-color="primary">
              <v-tab value="actualMasterlife" class="text-none">
                <Icon icon="ic:twotone-support-agent" class="mr-2" />
                Masterlife Actuales
              </v-tab>
              <!-- <v-tab value="newMasterlife" class="text-none">
                                <Icon icon="ic:twotone-support-agent" class="mr-2" />
                                Nuevos Masterlife
                            </v-tab> -->
            </v-tabs>
            <v-card-text>
              <v-window v-model="tab2">
                <v-window-item value="actualMasterlife">
                  <MasterlifeSelect :team="team" v-model="promotionLifeRequest.masterLife" />
                </v-window-item>
                <v-window-item value="newMasterlife">
                  <NewMasterlifeSelect :team="team" v-model="promotionLifeRequest.masterLife" />
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showConfirmDialog" width="500">
    <v-card class="rounded-lg">
      <v-card-title class="py-4 px-6 bg-gray-50">
        <Icon icon="mdi:arrow-up-circle" class="mr-2" />
        Confirmar promoción
      </v-card-title>
      <v-card-text class="py-6 px-6">
        <template v-if="team?.training?.nextLevel?.courseLevel === 'LIFE_GRADUATE'">
          ¿Está seguro de graduar al equipo "<strong>{{ team.name }}</strong
          >"?
        </template>
        <template v-else>
          ¿Estás seguro de promover al equipo "<strong>{{ team.name }}</strong
          >" al nivel <strong>{{ team?.training?.nextLevel?.courseLevel }}</strong
          >?
        </template>
      </v-card-text>

      <v-card-actions class="p-4">
        <v-spacer></v-spacer>
        <v-btn color="error" variant="tonal" @click="showConfirmDialog = false" class="mr-2"> Cancelar </v-btn>
        <v-btn color="primary" variant="flat" @click="onPromoteTeam" :loading="isPromoting">
          {{ promotionButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped></style>
