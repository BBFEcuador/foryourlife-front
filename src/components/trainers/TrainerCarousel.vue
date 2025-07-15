<script setup lang="ts">
import type { Trainers } from '@/models/Trainers';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';

interface Props {
  trainers: Trainers[];
}

const props = defineProps<Props>();
const emits = defineEmits(['trainer-selected']);

const headers = ref([
  { title: 'Nombre', value: 'name' },
  { title: 'Correo electronico', value: 'email' },
  { title: 'Telf', value: 'phone' }
]);
const searchQuery3 = ref('');

const selectedTraining = ref<Trainers[]>([]);

watch(selectedTraining, () => {
  if (selectedTraining.value.length > 0 ) {
    emits('trainer-selected', selectedTraining.value[0]);
  }
});
</script>

<template>
  <v-text-field v-model="searchQuery3" label="Buscar" outlined dense clearable>
    <template #prepend-inner>
      <Icon icon="mdi-magnify" />
    </template>
  </v-text-field>
  <VDataTable
    :items="props.trainers"
    :search="searchQuery3"
    v-model="selectedTraining"
    :headers="headers"
    return-object
    show-select
    select-strategy="single"
  />
</template>

<style scoped>
.thumbnail-image {
  transition: transform 0.3s ease;
}

.thumbnail-image:hover {
  transform: scale(1.1);
}

.selected-image {
  border: 1px solid #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
