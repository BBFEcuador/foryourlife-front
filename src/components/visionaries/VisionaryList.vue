<script setup lang="ts">
import useVisionaries from '@/composables/admin/visionaries/useVisionaries';
import type { Visionary } from '@/models/Visionary';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';

const { visionariesData, isVisionariesError, isVisionariesloading, refetchVisionaries } = useVisionaries();

const emit = defineEmits(['select-visionaries']);

const selectedVisionaries = ref<Visionary[]>([]);

const onSelectionUpdate = (items: Visionary[]) => {
    selectedVisionaries.value = items;
    emit('select-visionaries', items);
};

watch(selectedVisionaries, (newVal) => {
    emit('select-visionaries', newVal);
}, { deep: true });

const search = ref('');

const headers = [
    { title: 'Nombre', value: 'user.name', sortable: true },
    { title: 'E-mail', value: 'user.email', sortable: true },
    { title: 'Rol', value: 'role', sortable: true },
    { title: 'Estado', value: 'active', sortable: true }
] as const;
</script>

<template>
    <v-data-table v-model="selectedVisionaries" :headers="headers" :items="visionariesData" :search="search"
        :loading="isVisionariesloading" show-select return-object class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="bg-surface">
                <v-text-field v-model="search" hide-details placeholder="Buscar Visionarios" class="custom-card px-4"
                    density="compact">
                    <template #prepend-inner>
                        <Icon icon="mdi-magnify" />
                    </template>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn v-if="selectedVisionaries.length" color="error" variant="tonal" size="small"
                    @click="selectedVisionaries = []">
                    <Icon icon="mdi-close" class="mr-1" />
                    Limpiar Selección ({{ selectedVisionaries.length }})
                </v-btn>
            </v-toolbar>
        </template>

        <template v-slot:item.role="{ item }">
            <v-chip size="small" :color="item.role === 'FOCUS' ? 'deep-purple' : item.role === 'YOUR' ? 'indigo' : 'blue'" class="text-capitalize">
                {{ item.role.toLowerCase() }}
            </v-chip>
        </template>

        <template v-slot:item.active="{ item }">
            <v-chip size="small" :color="item.active ? 'success' : 'error'" variant="tonal">
                {{ item.active ? 'Activo' : 'Inactivo' }}
            </v-chip>
        </template>
    </v-data-table>
    <div v-if="isVisionariesError" class="error-state text-center pa-8">
        <Icon icon="mdi-alert-circle" color="error" size="48" />
        <div class="text-h6 mt-2">Error al cargar los visionarios</div>
        <v-btn color="primary" class="mt-4" @click="refetchVisionaries">
            <Icon icon="mdi-refresh" class="mr-2" />
            Reintentar
        </v-btn>
    </div>
</template>

<style scoped>
.custom-card {
  border-radius: 8px;
  background-color: rgb(var(--v-theme-surface));
}

:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}
</style>