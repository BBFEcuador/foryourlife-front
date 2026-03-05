<script setup lang="ts">
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';

interface Props {
  participants: Participant[];
  team: TeamWriteModel;
}

const props = defineProps<Props>();

const statusFilter = ref('Todos');
const filterOptions = ['Todos', 'Jornada', 'Rezagado'];

const filteredParticipants = computed(() => {
  let items = props.participants;

  if (statusFilter.value === 'Jornada') {
    items = items.filter((p) => !p.isLingerer);
  } else if (statusFilter.value === 'Rezagado') {
    items = items.filter((p) => p.isLingerer);
  }

  return [...items].sort((a, b) => Number(a.isLingerer) - Number(b.isLingerer));
});

const headers = ref([
  { title: 'Nombre', value: 'user.name', class: 'my-header-style' },
  { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
  { title: 'Correo', value: 'user.email' },
  { title: 'Telefono', value: 'user.phone' },
  { title: 'Nivel', value: 'participantLevel.courseLevel' },
  { title: 'Estado', value: 'state', width: 50 }
]);

const emit = defineEmits(['send-participants']);
const searchQuery3 = ref('');
</script>
<template>
  <div class="d-flex tw:gap-x-4 mb-2 align-center">
    <v-text-field
      v-model="searchQuery3"
      label="Buscar por Nombre"
      outlined
      dense
      clearable
      hide-details
      class="flex-grow-1"
    >
      <template #prepend-inner>
        <Icon icon="mdi-magnify" />
      </template>
    </v-text-field>
    
    <v-select
      v-model="statusFilter"
      :items="filterOptions"
      label="Filtrar por Estado"
      outlined
      dense
      hide-details
      style="max-width: 200px;"
      class="flex-shrink-0"
    ></v-select>
  </div>

  <VDataTable v-model="team.users" :items="filteredParticipants" :headers="headers" show-select return-object :search="searchQuery3">
    <template #item.state="{ item }">
      <VChip :color="item.isLingerer ? 'error' : 'success'">
        {{ item.isLingerer ? 'Rezagado' : 'Jornada' }}
      </VChip>
    </template>
  </VDataTable>
</template>

<style scoped></style>
