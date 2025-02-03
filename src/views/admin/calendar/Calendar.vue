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

// Components

// 👉 Store

// 👉 Event



// 👉 useCalendar

// SECTION Sidebar
// 👉 Check all

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
                <FullCalender />
            </UiParentCard>
        </v-col>
        <v-col cols="12" lg="4" sm="12">
            <UiParentCard title="Calendar with Allowed Dates">
                <v-date-picker color="primary" v-model="seldate" :allowed-dates="allowedDates" min="2016-06-15"
                    max="2018-03-20" />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
