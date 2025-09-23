<script setup lang="ts">
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant, Team } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: Team;
  origin: string;
}

const props = defineProps<props>();
const sp = defineModel({
  default: [] as Participant[]
});

const page = ref(1);
const perPage = ref(10);
const search = ref('');

const { getByLvlMutation } = useParticipantMutations();
const participants = ref<Participant[]>([]);

onBeforeMount(() => {
  getByLvlMutation.mutate(props.team.training.courseLevel);
});
watch(getByLvlMutation.isError, () => {
  if (getByLvlMutation.isError.value) {
    const error = getByLvlMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(getByLvlMutation.isSuccess, () => {
  if (getByLvlMutation.isSuccess.value) {
    const response = getByLvlMutation.data.value;
    if (response) {
      participants.value = response;
    }
  }
});

const headers = ref([
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' },
  { title: 'Rezagado', value: 'isLingerer' }
]);

const searchQuery = ref('');

const getAvailableRowClass = (item: Participant) => {
  if (props.origin === 'FOCUS') {
    if (item.modules.hasYour) {
      return '';
    } else {
      return 'tw:bg-red-200';
    }
  }
  if (props.origin === 'YOUR') {
    if (item.modules.hasLife) {
      return '';
    } else {
      return 'tw:bg-red-200';
    }
  }
  if (props.origin === 'LIFE') {
    return '';
  }
};

const getDisabledRow = (item: Participant) => {
  if (props.origin === 'FOCUS') {
    if (item.modules.hasYour) {
      return true;
    } else {
      return false;
    }
  }
  if (props.origin === 'YOUR') {
    if (item.modules.hasLife) {
      return true;
    } else {
      return false;
    }
  }
  if (props.origin === 'LIFE') {
    return true;
  }
};
</script>

<template>
  <v-card variant="flat">
    <v-progress-circular v-if="getByLvlMutation.isPending.value" indeterminate color="primary"></v-progress-circular>
    <v-alert v-else-if="getByLvlMutation.isError.value" type="error" class="mb-4"> Error al cargar los participantes
    </v-alert>
    <div v-else>
      <v-text-field v-model="searchQuery" label="Buscar por Nombre" outlined dense clearable>
        <template #prepend-inner>
          <Icon icon="mdi-magnify" />
        </template>
      </v-text-field>
      <VDataTable
        :items="participants"
        :headers="headers"
        show-select
        v-model="sp"
        return-object
        :search="searchQuery"
        :page="page"
        :items-per-page="perPage"
      >
        <template #item.isLingerer="{ item }">
          <VChip :color="item.isLingerer ? 'error' : 'success'">
            {{ item.isLingerer ? 'Rezagado' : 'No rezagado' }}
          </VChip>
        </template>

        <template #item.participantLevel.courseLevel="{ item }">
          <div class="d-flex align-center">
            {{ item.participantLevel.courseLevel }}
            <div v-if="!getDisabledRow(item)" class="d-flex pb-2">
              <v-tooltip interactive>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-icon class="ml-2" color="error" v-bind="activatorProps">
                    <Icon icon="mdi-information-outline" />
                  </v-icon>
                </template>
                <span>El participante no cuenta con el siguiente nivel</span>
              </v-tooltip>
            </div>
          </div>
        </template>
      </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
