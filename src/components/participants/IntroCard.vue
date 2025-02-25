<script setup lang="ts">
import type { Participant } from '@/models/Participants';
import { Icon } from '@iconify/vue/dist/iconify.js';

interface props {
    participant: Participant;
}

const props = defineProps<props>();
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0">
                <v-card-item>
                    <h4 class="text-h4">Información del entrenamiento</h4>
                    <p class="my-5 text-subtitle-1 lh-md textSecondary">
                        Actualmente pertenece al nivel <strong>{{ participant.participantLevel.courseLevel }}</strong> y
                        al equipo <strong>{{ participant.team?.name }}</strong>
                    </p>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="mdi:alert-circle-outline" height="21" />
                        <span class="text-h6" v-if="participant.lingerer === true">REZAGADO</span>
                        <span class="text-h6" v-else>NO REZAGADO</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="material-symbols:person" height="21" />
                        <span class="text-h6">
                            {{ participant.team?.trainer?.name ? participant.team.trainer.name : 'No pertenece a ningún equipo' }}
                        </span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="material-symbols:alternate-email" height="21" />
                        <span class="text-h6">{{ participant.team?.trainer.email }}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="material-symbols:call-outline" height="21" />
                        <span class="text-h6">{{ participant.team?.trainer.phone }}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="ri:graduation-cap-fill" height="21" />
                        <span class="text-h6">{{ participant.team?.trainingData?.name }}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="carbon:skill-level" height="21" />
                        <span class="text-h6">{{ participant.team?.trainingData?.curseLevel }}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="streamline:startup-solid" height="21" />
                        <span class="text-h6">{{ participant.team?.trainingData?.startDate }}</span>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
