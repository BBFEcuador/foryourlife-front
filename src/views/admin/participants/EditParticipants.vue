<script setup lang="ts">
import IntroCard from '@/components/participants/IntroCard.vue';
import ModuleUpdate from '@/components/participants/ModuleUpdate.vue';
import ParticipantBanner from '@/components/participants/ParticipantBanner.vue';
import ParticipantUpdate from '@/components/participants/ParticipantUpdate.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useParticipant from '@/composables/admin/participants/useParticipant';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = ref([
    {
        title: 'Entrenamiento',
        disabled: false,
        href: '/admin'
    }
]);
const { isParticipantError, isParticipantLoading, participant } = useParticipant(route.params.id.toString());
</script>
<template>
    <BaseBreadcrumb :title="'Editar participante'" :breadcrumbs="breadcrumbs" />
    <VRow>
        <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isParticipantLoading">
            <v-progress-circular indeterminate color="primary" size="80" width="8" />
        </v-col>
        <v-col cols="12" v-else-if="isParticipantError">
            <v-alert type="error">Error al cargar el participante</v-alert>
        </v-col>
        <v-col cols="12" v-else>
            <ParticipantBanner :participant class="mb-2"/>
            <v-row>
                <VCol cols="12" md="3" sm="12" class="tw:flex tw:flex-col tw:items-center">
                    <IntroCard :participant/>           
                </VCol>
                <VCol cols="12" md="9" sm="12" class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
                    <ParticipantUpdate :participant/>
                    <ModuleUpdate :participant/>
                </VCol>
            </v-row>
        </v-col>
    </VRow>
</template>


<style scoped></style>