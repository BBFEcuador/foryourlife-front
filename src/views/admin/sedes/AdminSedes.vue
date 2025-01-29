<script setup lang="ts">
import useCampus from '@/composables/admin/useCampus';
import { ref } from 'vue';

const {campus,isError,isFetching} = useCampus();
const search = ref();

const headers = [
    { title: 'id', value: 'country', class: 'my-header-style' },
    { title: 'Nombre', value: 'city', class: 'my-header-style' },
    { title: 'Ciudad', value: 'address' },
    { title: 'Telefono', value: 'phone' },
    { title: 'Acciones', value: 'actions' },
];

</script>
<template>
    <v-card elevation="1">
        <v-card-title> Campus </v-card-title>
        <v-card-item>
            <v-progress-circular v-if="isFetching" indeterminate color="primary" />
            <v-alert v-else-if="isError" type="error" text="Error fetching data" />
            <v-alert v-else type="success" text="Data fetched successfully" />
            {{ campus }}
        </v-card-item>
        <v-data-table :headers="headers" :items="campus">
            <template v-slot:no-data>
                <tr>
                    <td colspan="3">No data available</td>
                </tr>
            </template>
        </v-data-table>
    </v-card>
    <div>
        sede3s
    </div>
</template>


<style scoped>

</style>