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

const headers = ref([
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Telefono', value: 'phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' }
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
        v-model="sp"
        show-select
        return-object
        :search="searchQuery"
        :item-selectable="getDisabledRow"
      >
        <template #item="{ item, internalItem }">
          <v-data-table-row :item="internalItem" :class="getAvailableRowClass(item)">
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
