<script setup lang="ts">
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { ref, watch } from 'vue';


interface Props {
    participants: Participant[];
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
const team = ref<TeamWriteModel>({
    users: [] as Participant[]
} as TeamWriteModel);

const handleCheckboxChange = (value: boolean, item: Participant) => {
    if (value) {
        team.value.users.push(item);
    } else {
        team.value.users = team.value.users.filter(participant => participant.id !== item.id);
    }
};

watch(
    () => team.value.users,
    (newSelectedParticipants) => {
        emit('send-participants', newSelectedParticipants);
    },
    { deep: true }
);
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