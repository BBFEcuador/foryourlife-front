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
  const training = props.team?.training;
  if (!training) return;
  getByLvlMutation.mutate({ lvl: training.courseLevel, ...(training.campus?.id && { campusId: training.campus.id }) });
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
  { title: 'Nombre', value: 'user.name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Telefono', value: 'user.phone' },
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
    if (item?.modules?.hasYour) {
      return true;
    } else {
      return false;
    }
  }
  if (props.origin === 'YOUR') {
    if (item?.modules?.hasLife) {
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
    <v-alert v-else-if="getByLvlMutation.isError.value" type="error" class="mb-4"> Error al cargar los participantes </v-alert>
    <div v-else>
      <v-text-field v-model="searchQuery" label="Buscar por Nombre" outlined dense clearable>
        <template #prepend-inner>
          <Icon icon="mdi-magnify" />
        </template>
      </v-text-field>
      <VDataTable
        v-model="sp"
        :items="participants"
        :headers="headers"
        show-select
        return-object
        :search="searchQuery"
        :page="page"
        :item-selectable="getDisabledRow"
        :items-per-page="perPage"
      >
        <template #item="{ item, internalItem }">
          <v-data-table-row :item="internalItem" :class="getAvailableRowClass(item)">
            <template #item.isLingerer="{ item }">
              <VChip :color="item.isLingerer ? 'error' : 'success'">
                {{ item.isLingerer ? 'Rezagado' : 'Jornada' }}
              </VChip>
            </template>
            <template #item.participantLevel.courseLevel="{ item }">
              <div class="d-flex align-middle">
                {{ item.participantLevel.courseLevel }}
                <div v-if="!getDisabledRow(item)" class="d-flex pb-2">
                  <v-tooltip interactive>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-icon class="ml-2" color="error" v-bind="activatorProps">
                        <Icon icon="mdi-information-outline"></Icon>
                      </v-icon>
                    </template>
                    <span>El participante no cuenta con el siguiente nivel</span>
                  </v-tooltip>
                </div>
              </div>
            </template>
          </v-data-table-row>
        </template>
      </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
