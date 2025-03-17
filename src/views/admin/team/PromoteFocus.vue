<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TrainerSelect from './TrainerSelect.vue';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Trainers } from '@/models/Trainers';
import ParticipantsSelect from '@/components/team/ParticipantsSelect.vue';
import StaffSelect from '@/components/team/StaffSelect.vue';
import NewParticipantsSelect from '@/components/team/NewParticipantsSelect.vue';
import NewStaffSelect from '@/components/team/NewStaffSelect.vue';


const breadcrumbs = ref([
    {
        title: 'Equipos',
        disabled: false,
        href: '/admin'
    }
]);


const route = useRoute();
const { isTeamError, isTeamLoading, team, refetchTeam } = useAdminTeam(route.params.id.toString())

const trainers = ref<Trainers[]>([]);
const { availableTrainerMutation } = useTrainerMutations();

const showTrainerSelect = ref(false);

const handleTrainerSelected = (trainer: Trainers[]) => {
    team.value.trainer = trainer[0];
    showTrainerSelect.value = false;
}
const loadAvailableTrainers = async () => {

    if (showTrainerSelect.value) {
        showTrainerSelect.value = false;
        trainers.value = [];
        return;
    }

    const params = {
        startDate: team.value?.training?.nextLevel.startDate || '',
        endDate: team.value?.training?.nextLevel.endDate || ''
    };

    availableTrainerMutation.mutate(params, {
        onSuccess(data) {
            console.log('Entrenadores obtenidos:', data);
            trainers.value = data;
            showTrainerSelect.value = true;
        },
        onError(e) {
            let error = e as AxiosError<ErrorApiResponse>;
            showErrorToast(error);
        }
    });
};
const tab = ref('actualParticipants');
const tab2 = ref('actualStaff');

const activeTab = ref(0);

const tabs = ref([
    { label: 'Entrenador', icon: 'cbi:roomsgym', color: 'primary' },
    { label: 'Participantes', icon: 'mdi:account-multiple', color: 'info' },
    { label: 'Staff', icon: 'mdi:magic-staff', color: 'success' },
]);

const setActiveTab = (index: number) => {
    activeTab.value = index;
};
</script>
<template>
    <BaseBreadcrumb :title="'Promover equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6"></BaseBreadcrumb>
    <v-container>


        <VRow v-if="isTeamLoading">
            <VCol cols="12">

            </VCol>
        </VRow>
        <VRow v-else-if="isTeamError">
            <VCol cols="12">

            </VCol>
        </VRow>
        <v-row v-else>
            <v-card elevation="1">
                <v-card-item>
                    <v-card-title class="d-flex align-center">
                        <Icon icon="mdi-account-group" size="32" class="mr-2" color="primary" />
                        Promover al equipo "<strong>{{ team.name }}</strong>" al nivel {{
                            team?.training?.nextLevel?.courseLevel }}
                    </v-card-title>
                    <v-card-subtitle class="mt-2">Puedes actualizar el nombre del equipo <strong>{{
                        team.name }}</strong>
                        aquí</v-card-subtitle>
                    <v-card-text>
                        <v-text-field v-model="team.name" label="Nombre del equipo"
                            placeholder="Ingresa el nombre del equipo" hide-details="auto" variant="outlined"
                            density="comfortable" class="mt-2"></v-text-field>
                    </v-card-text>
                </v-card-item>
            </v-card>
            <v-row class="py-4">
                <v-col cols="12" sm="4" v-for="(tab, index) in tabs" :key="index">
                    <v-card :color="tab.color" variant="tonal" v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200"
                        :duration="150" :elevation="activeTab === index ? 12 : 4"
                        :class="{ 'tw:border-blue-500 tw:bg-blue-100 tw:scale-105': activeTab === index }"
                        class="tw:cursor-pointer tw:transition-all tw:duration-300 tw:ease-in-out hover:tw:scale-105 tw:rounded-2xl tw:shadow-md tw:border"
                        @click="setActiveTab(index)">
                        <v-card-title class="tw:text-center tw:font-semibold tw:text-lg">
                            <Icon :icon="tab.icon" height="26" />
                            {{ tab.label }}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <v-card class="mb-4 fill-height" elevation="1" v-motion :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="150" v-if="activeTab === 0">
                <v-card-item>
                    <v-card-title class="mb-3 d-flex align-center">
                        <Icon icon="map:gym" size="32" class="mr-2" color="primary" />
                        Este es tu entrenador: {{ team.trainer?.name || 'No asignado' }}
                    </v-card-title>
                    <v-card-text class="mb-2 tw:grid tw:grid-cols-2">
                        Deseas cambiar el entrenador del equipo?
                        <v-btn color="primary" variant="flat" @click="loadAvailableTrainers">
                            <Icon icon="material-symbols:change-circle-outline" class="tw:mr-1" />
                            {{ showTrainerSelect ? 'No Cambiar' : 'Cambiar' }}
                        </v-btn>
                    </v-card-text>
                    <v-expand-transition>
                        <TrainerSelect v-if="showTrainerSelect" :trainer="trainers"
                            @trainer-selected="handleTrainerSelected" />
                    </v-expand-transition>
                </v-card-item>
            </v-card>
            <v-card elevation="1" class="fill-height" v-motion :initial="{ opacity: 0, y: -10 }"
                :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="150" v-if="activeTab === 1">
                <v-card-item>
                    <v-card-title class="d-flex align-center">
                        <Icon icon="mdi:account-multiple" size="32" class="mr-2" color="primary" />
                        Participantes actuales: {{ team.users.length }}
                    </v-card-title>
                    <v-tabs v-model="tab" color="primary" align-tabs="center">
                        <v-tab value="actualParticipants" class="text-none">
                            <Icon icon="mdi:account-multiple" class="mr-2" />
                            Participantes actuales
                        </v-tab>
                        <v-tab value="newParticipants" class="text-none">
                            <Icon icon="mdi:account-multiple" class="mr-2" />
                            Nuevos participantes
                        </v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-window v-model="tab">
                            <v-window-item value="actualParticipants">
                                <ParticipantsSelect :team="team" />
                            </v-window-item>
                            <v-window-item value="newParticipants">
                                <NewParticipantsSelect :team="team" />
                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card-item>
            </v-card>

            <v-card class="mb-4" elevation="1" v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }"
                :delay="200" :duration="150" v-if="activeTab === 2">
                <v-card-item>
                    <v-card-title class="d-flex align-center">
                        <Icon icon="mdi:magic-staff" size="32" class="mr-2" color="primary" />
                        Staff Actual
                    </v-card-title>
                    <v-tabs v-model="tab2" color="primary" align-tabs="center">
                        <v-tab value="actualStaff" class="text-none">
                            <Icon icon="mdi:magic-staff" class="mr-2" />
                            Staff
                        </v-tab>
                        <v-tab value="newStaff" class="text-none">
                            <Icon icon="mdi:magic-staff" class="mr-2" />
                            Nuevos Staff
                        </v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-window v-model="tab2">
                            <v-window-item value="actualStaff">
                                <StaffSelect :team="team" />
                            </v-window-item>
                            <v-window-item value="newStaff">
                                <NewStaffSelect :team="team" />
                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card-item>
            </v-card>
        </v-row>

    </v-container>
</template>
<style scoped>
</style>