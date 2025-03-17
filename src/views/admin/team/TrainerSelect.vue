<script setup lang="ts">
import type { Trainers } from '@/models/Trainers';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';


const trainers = ref<Trainers[]>([]);
interface Props {
    trainer: Trainers[];
}

const props = defineProps<Props>();

const emit = defineEmits(['trainer-selected']);
const selectedTrainer = ref<Trainers | null>(null);

const search = ref();
const headers = [
    { title: 'Nombre', value: 'name', sortable: true },
    { title: 'E-mail', value: 'email', sortable: true },
    { title: 'Teléfono', value: 'phone', sortable: true }
];

const confirmTrainer = () => {
    if (selectedTrainer.value) {
        emit('trainer-selected', selectedTrainer.value);
        selectedTrainer.value = null;
    }
};

</script>
<template>
    <v-data-table :headers="headers" :search="search" :items="props.trainer" :loading="false" v-model="selectedTrainer"
        return-object show-select hide-default-footer select-strategy="single" class="tw:rounded-xl elevation-0"
        :loading-text="'Cargando entrenadores...'" :no-data-text="'No se encontraron entrenadores'" hover>
        <template v-slot:top>
            <v-toolbar class="bg-containerBg" flat v-motion :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                <div class="tw:flex-1 tw:max-w-md tw:relative">
                    <VTextField v-model="search" placeholder="Buscar por nombre, email o teléfono..." variant="outlined"
                        density="comfortable" hide-details class="tw:rounded-lg" bg-color="white">
                        <template #prepend-inner>
                            <Icon icon="mdi:magnify" height="18" />
                        </template>
                        <template #append v-if="search">
                            <VBtn icon variant="text" size="small" @click="search = ''">
                                <Icon icon="mdi:close" height="18" />
                            </VBtn>
                        </template>
                    </VTextField>
                </div>
            </v-toolbar>
        </template>

        <template #item.name="{ item }">
            <div class="tw:flex tw:items-center tw:gap-3">
                <span class="tw:font-medium">{{ item.name }}</span>
            </div>
        </template>

        <template #item.email="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
                <Icon icon="mdi:email" class="tw:text-gray-400" />
                <span>{{ item.email }}</span>
            </div>
        </template>

        <template #item.phone="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
                <Icon icon="mdi:phone" class="tw:text-gray-400" />
                <span>{{ item.phone }}</span>
            </div>
        </template>

        <template #item.active="{ item }">
            <VChip :color="item.active ? 'success' : 'error'" size="small" variant="flat"
                class="!tw:font-normal tw:text-xs !tw:min-w-[80px]"
                :class="item.active ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'">
                <template #prepend>
                    <Icon :icon="item.active ? 'mdi:check-circle' : 'mdi:close-circle'" class="tw:mr-1" />
                </template>
                {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
        </template>

        <template #loading>
            <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
        </template>

        <template #no-data>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="mdi:dumbbell" height="48" class="tw:mb-4" />
                <p class="tw:text-lg">No se encontraron entrenadores</p>
                <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
            </div>
        </template>
    </v-data-table>
    <v-expand-transition>
        <div v-if="selectedTrainer" class="tw:mt-4 tw:flex tw:justify-center">
            <v-btn color="primary" variant="flat" class="tw:w-full tw:max-w-md tw:py-2 tw:rounded-xl tw:text-lg"
                @click="confirmTrainer">
                ✅ Confirmar Selección
            </v-btn>
        </div>
    </v-expand-transition>
</template>
<style scoped></style>