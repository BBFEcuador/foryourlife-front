<script setup lang="ts">
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant, Team } from '@/models/Participants';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
    team: Team;
}

const props = defineProps<props>();

const vmodel = defineModel({
  default:[] as StaffWriteModel[],
})

const { availableStaffMutations } = useStaffMutations();
const staff = ref<StaffWriteModel[]>([]);

onBeforeMount(() => {
    availableStaffMutations.mutate({
        endDate: props.team.training.endDate,
        startDate: props.team.training.startDate
    });
});

watch(availableStaffMutations.isError, () => {
    if (availableStaffMutations.isError.value) {
        const error = availableStaffMutations.error.value as AxiosError<ErrorApiResponse>;
        showErrorToast(error);
    }
});

watch(availableStaffMutations.isSuccess, () => {
    if (availableStaffMutations.isSuccess.value) {
        const response = availableStaffMutations.data.value;
        if (response) {
            staff.value = response;
        }
    }
});

const headers = ref([
    { title: 'Nombre', value: 'user.name', class: 'my-header-style', sortable: true },
    { title: 'Cédula', value: 'user.email', class: 'my-header-style', sortable: true },
    { title: 'Telefono', value: 'role', sortable: true },
]);

const searchQuery = ref('');
</script>

<template>
    <v-card variant="flat">
        <v-progress-circular v-if="availableStaffMutations.isPending.value" indeterminate
            color="primary"></v-progress-circular>
        <v-alert v-else-if="availableStaffMutations.isError.value" type="error" class="mb-4"> Error al cargar los
            participantes </v-alert>
        <div v-else>
            <v-text-field v-model="searchQuery" label="Buscar por Nombre" outlined dense clearable>
                <template #prepend-inner>
                    <Icon icon="mdi-magnify" />
                </template>
            </v-text-field>
            <VDataTable :items="staff" hide-default-footer :headers="headers" show-select v-model="vmodel" return-object
                :search="searchQuery">
            </VDataTable>
        </div>
    </v-card>
</template>

<style scoped></style>
