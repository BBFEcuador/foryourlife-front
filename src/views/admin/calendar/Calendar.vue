<script setup lang="ts">
import { ref } from 'vue';
import { useDate } from 'vuetify'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import FullCalender from './FullCalender.vue';

const date = ref(new Date());
const seldate = ref(new Date('2018-03-02'))
const adapter = useDate()

function allowedDates(val: unknown) {
    return parseInt(adapter.toISO(val).split('-')[2], 10) % 2 === 0
}


const breadcrumbs = ref([
    {
        title: 'Administrativo',
        disabled: false,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="'Calendario'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>

        <v-col cols="12">
            <UiParentCard>
                <FullCalender :program="programs" />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
