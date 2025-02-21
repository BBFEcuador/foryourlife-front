<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useParticipant from '@/composables/admin/participants/useParticipant';
import useParticipants from '@/composables/admin/participants/useParticipants';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = ref([
    {
        title: 'Entrenamiento',
        disabled: false,
        href: '#'
    }
]);
const { isParticipantError, isParticipantLoading, participant } = useParticipant(route.params.id.toString());
</script>
<template>
    <BaseBreadcrumb :title="'Editar participante'" :breadcrumbs="breadcrumbs" />
    <v-card variant="outlined" class="tw-p-4">
        {{ participant }}
    </v-card>
    <VRow>
        <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isParticipantLoading">
            <v-progress-circular indeterminate color="primary" size="80" width="8" />
        </v-col>
        <v-col cols="12" v-else-if="isParticipantError">
            <v-alert type="error">Error al cargar el participante</v-alert>
        </v-col>
        <v-col cols="12" v-else>
            <VCol cols="12" md="3" sm="6">
                <v-card>
                    <v-label v-model="participant.name" label="Nombre" required />
                    <v-label v-model="participant.email" label="Correo electrónico" type="email" required />
                </v-card>
            </VCol>
            <VCol cols="12" md="9" sm="6">
                <VTextField v-model="participant.email" label="Correo electrónico" type="email" required />
            </VCol>
            <VCol cols="12">
                <VBtn type="submit" color="primary">Actualizar</VBtn>
            </VCol>
        </v-col>
    </VRow>
</template>


<style scoped></style>