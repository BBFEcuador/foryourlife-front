<script setup lang="ts">
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { Participant, ParticipantUpdate } from '@/models/Participants';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps<props>();

interface props {
    participant: Participant;
}

const { updateParticipantMutation } = useParticipantMutations();

const onSubmitParticipant = () => {
    let participantUpdate = { ...props.participant }
    delete participantUpdate['modules'];
    delete participantUpdate['participantLevel'];
    delete participantUpdate['contacts'];
    delete participantUpdate['team'];
    updateParticipantMutation.mutate(participantUpdate);
}

watch(updateParticipantMutation.isError, () => {
    if (updateParticipantMutation.isError.value) {
        let errorMessage = 'Error en el servidor';
        let error = updateParticipantMutation.error.value as AxiosError<{
            message: string;
        }>;
        if (error.response?.data?.message) {
            errorMessage = JSON.stringify(error.response?.data?.message);
        }
        toast.error(errorMessage, {
            autoClose: 3000,
            closeButton: true

        })
    }
})



const properties = ref(['FOCUS', 'YOUR', 'LIFE']);

</script>

<template>
    <v-card elevation="0" class="">
        <v-card-item>
            <h4 class="text-h4 mb-2 font-weight-bold">Información personal</h4>
            <v-text-field v-model="participant.name" label="Nombre" variant="outlined" dense readonly />
            <v-text-field v-model="participant.email" label="Correo Electrónico" variant="outlined" dense readonly />
            <v-text-field v-model="participant.phone" label="Teléfono" variant="outlined" dense readonly />
            <v-text-field v-model="participant.profile.address" label="Dirección" variant="outlined" dense readonly />
            <v-text-field v-model="participant.profile.occupation" label="Ocupación" variant="outlined" dense
                readonly />
            <v-text-field label="Género" variant="outlined" dense readonly
                :value="participant.profile.gender === 'M' ? 'Masculino' : 'Femenino'" />
            <v-text-field v-model="participant.profile.civilStatus" label="Estado Civil" variant="outlined" dense
                readonly />
            <v-text-field v-model="participant.profile.city" label="Ciudad" variant="outlined" dense readonly />
            <v-text-field v-model="participant.profile.dni" label="Cédula" variant="outlined" dense readonly />
            <v-text-field v-model="participant.profile.birthday" label="Fecha de Nacimiento" variant="outlined" dense
                readonly />
            <v-spacer />
            <v-btn color="primary" @click="onSubmitParticipant">Actualizar</v-btn>
        </v-card-item>
    </v-card>
</template>

<style scoped></style>