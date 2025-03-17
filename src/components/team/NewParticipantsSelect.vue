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
}

const props = defineProps<props>();

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
]);

const searchQuery = ref('');
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
    <VDataTable :items="props.team.users" hide-default-footer :headers="headers" show-select v-model="props.team.users" return-object
        :search="searchQuery">
    </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
