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

const sp = defineModel({
  default:[] as Participant[],
})


const headers = ref([
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' }
]);

const searchQuery = ref('');
</script>

<template>
  <v-card variant="flat">
    <div>
      <v-text-field v-model="searchQuery" label="Buscar por Nombre" outlined dense clearable>
        <template #prepend-inner>
          <Icon icon="mdi-magnify" />
        </template>
      </v-text-field>
      <VDataTable
        :items="props.team.users"
        hide-default-footer
        :headers="headers"
        show-select
        v-model="sp"
        return-object
        :search="searchQuery"
      >
      </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
