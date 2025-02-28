<script setup lang="ts">
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import type { Criteria, Filter } from '@/models/Criteria';
import type { TrainingData } from '@/models/Training';
import { ref, watch } from 'vue';
import { VDataTable } from 'vuetify/components';
import { Icon } from '@iconify/vue/dist/iconify.js';

const { data, isError, isLoading, criteriaMutations, refetchTeams } = useAdminTeams();

interface Props {
    trainings: TrainingData[]
}
const props = defineProps<Props>();
const emit = defineEmits(['send-training']);

const headers = ref([
    { title: "Nombre", value: 'name' },
    { title: "Nivel", value: 'courseLevel' },
    { title: "País", value: 'campus.country' },
    { title: "Ciudad", value: 'campus.city' },
    { title: "Dirección", value: 'campus.address' }
])
const searchQuery3 = ref('');
const getColor = (country: string) => {
    if (country === 'Quito') return '#f34336 ';
    else return 'green';
};

const selectedTraining = ref<TrainingData | null>(null);

watch(selectedTraining,() => {
    
    emit('send-training', selectedTraining.value);
})

</script>
<template>
    <v-text-field v-model="searchQuery3" label="Buscar" outlined dense clearable>
        <template #prepend-inner>
            <Icon icon="mdi-magnify" />
        </template>
    </v-text-field>
    <VDataTable :items="props.trainings" :search="searchQuery3" v-model="selectedTraining" :headers="headers" return-object  show-select select-strategy="single">
      
        <template v-slot:item.campus.city="{ item }">
            <v-chip :color="getColor(item.campus.city)">
                <span>{{ item.campus.city }}</span>
            </v-chip>
        </template>
    </VDatatable>
</template>


<style scoped></style>