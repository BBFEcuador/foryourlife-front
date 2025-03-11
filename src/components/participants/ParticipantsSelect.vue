<script setup lang="ts">
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';


interface Props {
    participants: Participant[];
    team:TeamWriteModel
}

const props = defineProps<Props>();
const headers = ref([
    { title: 'Nombre', value: 'name', class: 'my-header-style' },
    { title: 'Cédula', value: 'profile.dni', class: 'my-header-style' },
    { title: 'Correo', value: 'email' },
    { title: 'Telefono', value: 'phone' },
    { title: 'Nivel', value: 'participantLevel.courseLevel' },
    { title: 'Acciones', value: 'actions', width: 50 }
]);

const emit = defineEmits(['send-participants']);
const searchQuery3 = ref('');


</script>
<template>
    <v-text-field v-model="searchQuery3" label="Buscar por Nombre" outlined dense clearable>
        <template #prepend-inner>
            <Icon icon="mdi-magnify" />
        </template>
    </v-text-field>
    <VDataTable :items="participants" :headers="headers" show-select v-model="team.users" return-object
        :search="searchQuery3">

    </VDataTable>
</template>


<style scoped></style>