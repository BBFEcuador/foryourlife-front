<script setup lang="ts">
import type { Participant } from '@/models/Participants';

const props = defineProps<props>();

interface props {
    participant: Participant;
}
</script>

<template>
    <v-card class="tw-p-6 tw-w-full">
        <v-card-title class="text-h6">Información del Participante</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <h4 class="text-h6 mb-2 font-weight-bold">General</h4>

                    <v-text-field v-model="participant.name" label="Nombre" variant="outlined" dense readonly />
                    <v-text-field v-model="participant.email" label="Correo Electrónico" variant="outlined" dense
                        readonly />
                    <v-text-field v-model="participant.phone" label="Teléfono" variant="outlined" dense readonly />
                    <v-text-field v-model="participant.profile.address" label="Dirección" variant="outlined" dense
                        readonly />
                    <v-text-field v-model="participant.profile.occupation" label="Ocupación" variant="outlined" dense
                        readonly />

                    <v-text-field label="Género" variant="outlined" dense readonly
                        :value="participant.profile.gender === 'M' ? 'Masculino' : 'Femenino'" />
                    <v-text-field v-model="participant.profile.civilStatus" label="Estado Civil" variant="outlined"
                        dense readonly />
                    <v-text-field v-model="participant.profile.city" label="Ciudad" variant="outlined" dense
                        readonly />
                    <v-text-field v-model="participant.profile.dni" label="Cédula" variant="outlined" dense
                        readonly />
                    <v-text-field v-model="participant.profile.birthday" label="Fecha de Nacimiento"
                        variant="outlined" dense readonly />
                </v-col>
                <v-col cols="12" md="6">
                    <h4 class="text-h6 mb-2 font-weight-bold">Detalles del Equipo</h4>

                    <v-text-field v-model="participant.participantLevel.courseLevel" label="Nivel" variant="outlined"
                        dense readonly />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<style scoped></style>