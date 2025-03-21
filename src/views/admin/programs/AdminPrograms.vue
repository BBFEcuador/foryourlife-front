<script setup lang="ts">
import { ref } from 'vue';
import { useDate } from 'vuetify'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import FullCalender from './FullCalender.vue';
import CallendarSuply from './callendarSuply.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

const activeView = ref('calendar'); // 'calendar' or 'table'
const date = ref(new Date());
const seldate = ref(new Date('2018-03-02'))
const adapter = useDate()

function allowedDates(val: unknown) {
    return parseInt(adapter.toISO(val).split('-')[2], 10) % 2 === 0
}
const {data} = useCalendar();

const breadcrumbs = ref([
    {
        title: 'Administrativo',
        disabled: false,
        href: '#'
    }
]);
</script>

<template>
    <BaseBreadcrumb :title="'Programas'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Todos los programas">
                <div class="d-flex justify-end mb-4">
                    <v-btn-group>
                        <v-btn
                            :color="activeView === 'calendar' ? 'primary' : ''"
                            @click="activeView = 'calendar'"
                        >
                        <Icon icon="mdi-calendar"></Icon>
                            Calendario
                        </v-btn>
                        <v-btn
                            :color="activeView === 'table' ? 'primary' : ''"
                            @click="activeView = 'table'"
                        >
                        <Icon icon="mdi-table"></Icon>
                            Tabla
                        </v-btn>
                    </v-btn-group>
                </div>
                
                <v-fade-transition>
                    <FullCalender v-if="activeView === 'calendar'" />
                    <CallendarSuply v-else />
                </v-fade-transition>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
