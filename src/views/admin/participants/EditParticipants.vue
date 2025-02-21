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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">

    </div>
</template>


<style scoped></style>