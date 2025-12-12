<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import type { Team } from '@/models/Participants';
import OperativeAssistantDashboard from '@/components/reports/OperativeAssistantDashboard.vue';

const breadcrumbs = ref([{ title: 'Reportes', disabled: false, href: '#' }]);

const selectedTeam = ref<Team | null>(null);
const teamId = ref('');
const nameTeam = ref('');
const debouncedSearch = ref('');

const { isLoading, criteriaMutations, refetchTeams, teamsData, page, perPage, search } = useAdminTeams();

const handleTeamChange = (team: Team | null) => {
  selectedTeam.value = team;
  teamId.value = team?.id ?? '';
  nameTeam.value = team?.name ? `${team.name}` : '';
  console.log('Selected Team:', teamId.value);
};

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});
</script>

<template>
  <!-- <div class=""> -->
  <BaseBreadcrumb :title="'Asistente Operativo'" :breadcrumbs="breadcrumbs" />
  <div class="mb-4 ">
    <div class="d-flex tw:items-center text-primary">
      <Icon icon="mdi-account-group" height="24" class="mr-2" />
      <div class="tw:font-bold">Equipo</div>
    </div>
    <div class="d-sm-flex align-center justify-space-between mt-1">
      <VCombobox
        v-model="selectedTeam"
        :items="teamsData.content"
        item-title="name"
        item-value="id"
        variant="outlined"
        :placeholder="teamsData.totalElements > 0 ? 'Seleccionar Equipo' : 'No hay equipos disponibles'"
        return-object
        :search="debouncedSearch"
        @update:model-value="handleTeamChange"
        hide-details
        class="tw:bg-white"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-avatar color="primary" size="32">
                <span class="tw:text-white">{{ item.raw.name?.charAt(0) || 'C' }}</span>
              </v-avatar>
            </template>
            <v-list-item-subtitle>{{ item.raw?.trainingNumber }}</v-list-item-subtitle>
          </v-list-item>
        </template>
      </VCombobox>
      <v-spacer></v-spacer>
      <div class="align-center tw:align-middle ml-5">
        <VBtn class="" color="success" variant="flat" @click="refetchTeams()">
          <Icon icon="mdi-microsoft-excel" class="mr-2" height="20" />
          Exportar
        </VBtn>
      </div>
    </div>
  </div>

  
    <OperativeAssistantDashboard :teamId="teamId" :teamName="nameTeam" />
  <!-- </div> -->
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
  color: #334155;
  padding: 16px;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: background-color 0.2s ease;
}
</style>
