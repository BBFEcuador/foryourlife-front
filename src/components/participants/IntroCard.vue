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
                        Actualmente pertenece al nivel <strong>{{ participant.participantLevel.courseLevel }}</strong> y al equipo <strong>{{ participant.team.name }}</strong>
                    </p>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="material-symbols:alternate-email" height="21" />
                        <span class="text-h6" v-if="participant.lingerer === true">REZAGADO</span>
                        <span class="text-h6" v-else>NO REZAGADO</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{ participant.team.trainer.name }}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.team.trainer.email}}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.team.trainer.phone}}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.team.training?.name}}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.profile.occupation}}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.profile.birthday}}</span>
                    </div>
                    <div class="d-flex tw:gap-3 mb-5">
                        <Icon icon="" height="21" />
                        <span class="text-h6">{{participant.profile.civilStatus}}</span>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
