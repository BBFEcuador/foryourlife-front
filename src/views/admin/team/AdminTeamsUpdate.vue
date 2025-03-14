<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TeamBanner from '@/components/team/TeamBanner.vue';
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { isTeamError, isTeamLoading, team } = useAdminTeam(route.params.id.toString());

const breadcrumbs = ref([
    {
        title: 'Equipos',
        disabled: false,
        href: '/admin'
    }
]);
</script>
<template>
    <BaseBreadcrumb :title="'Editar equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    </BaseBreadcrumb>
    <vRow>
        <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isTeamLoading">
            <v-progress-circular indeterminate color="primary" class="tw:rounded-t-xl" size="80" width="8" />
        </v-col>
        <v-col cols="12" v-else-if="isTeamError">
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="material-symbols:search-off-rounded" height="68" class="tw:mb-4" />
                <p class="tw:text-4xl">Error al cargar el equipo</p>
                <p class="tw:text-lg tw:mt-1">Intenta cargar de nuevo</p>
            </div>
        </v-col>
        <v-col cols="12" v-else>
            <TeamBanner :team="team" class="mb-2"/>
        </v-col>    
    </vRow>
</template>


<style scoped></style>