<script setup lang="ts">
import useAdminTeam from '@/composables/admin/team/useAdminTeam';
import type { Participant } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { ref } from 'vue';
import { routeLocationKey, useRoute } from 'vue-router';

const route = useRoute();

const {isTeamError,isTeamLoading,team} = useAdminTeam(route.params.id.toString());

</script>
<template>
    <v-card>
        <v-card-title>
admin teams
{{ team }}
        </v-card-title>
    </v-card>
</template>


<style scoped></style>