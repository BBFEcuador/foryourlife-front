<script setup lang="ts">
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import useMasterlifeMutations from '@/composables/masterlife/useMasterlifeMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant, Team } from '@/models/Participants';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: Team;
}

const props = defineProps<props>();
const vmodel = defineModel({
  default: [] as Participant[]
});

const headers = ref([
  { title: 'Nombre', value: 'user.name', class: 'my-header-style', sortable: true },
  { title: 'Cédula', value: 'user.email', class: 'my-header-style', sortable: true },
  { title: 'Telefono', value: 'role', sortable: true }
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
        :items="props.team.masterLife"
        hide-default-footer
        :headers="headers"
        show-select
        v-model="vmodel"
        return-object
        :search="searchQuery"
      >
      </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
