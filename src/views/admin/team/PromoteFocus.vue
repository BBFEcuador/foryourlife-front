<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import TeamLevelSelector from './create/TeamLevelSelector.vue';
import TrainingSelector from './create/TrainingSelector.vue';

const breadcrumbs = ref([
    {
        title: 'Equipos',
        disabled: false,
        href: '/admin'
    }
]);

const lasStep = ref(7)
const staffStepNumber = ref(6)
const visStepNumber = ref(5)
const masterLifeStepNumber = ref(5)
const step = ref(1)
const route = useRoute();
const { isTeamError, isTeamLoading, team, refetchTeam } = useAdminTeam(route.params.id.toString())
</script>
<template>
    <BaseBreadcrumb :title="'Promover equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6">asdas
    </BaseBreadcrumb>
    <v-container>
        <v-card class="mb-4" elevation="1">
            <v-card-item>
                <v-card-title class="d-flex align-center">
                    <Icon icon="mdi-account-group" size="32" class="mr-2" color="primary" />
                    Promover equipo al nivel {{ team?.training?.nextLevel?.courseLevel }}
                </v-card-title>
                <v-card-subtitle class="mt-2">Puedes actualizar el nombre del equipo <strong>{{ team.name }}</strong>
                    aquí</v-card-subtitle>
                <v-card-text>
                    <v-text-field v-model="team.name" label="Nombre del equipo"
                        placeholder="Ingresa el nombre del equipo" hide-details="auto" variant="outlined"
                        density="comfortable" class="mt-2"></v-text-field>
                </v-card-text>
            </v-card-item>
        </v-card>

    </v-container>
</template>
<style scoped></style>