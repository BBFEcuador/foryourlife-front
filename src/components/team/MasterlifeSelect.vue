<script setup lang="ts">
import type { MasterLife } from '@/models/MasterLife';
import type { Participant, Team } from '@/models/Participants';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';

interface props {
  team: Team;
}

const props = defineProps<props>();
const vModel = defineModel({
  default: [] as MasterLife[]
});

const headers = ref([
  { title: 'Nombre', value: 'user.name', class: 'my-header-style', sortable: false },
  { title: 'Cédula', value: 'user.email', class: 'my-header-style', sortable: false },
  { title: 'Telefono', value: 'user.phone', sortable: false }
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
      <VDataTable :items="props.team.masterLife" hide-default-footer :headers="headers" show-select v-model="vModel"
        return-object :search="searchQuery">
      </VDataTable>
    </div>
  </v-card>
</template>

<style scoped></style>
