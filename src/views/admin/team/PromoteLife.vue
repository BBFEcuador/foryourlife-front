<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';

const breadcrumbs = ref([
    {
        title: 'Equipos',
        disabled: false,
        href: '/admin'
    }
]);
</script>
<template>
    <BaseBreadcrumb :title="'Promover equipo'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    </BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            
        </v-col>
    </v-row>
</template>
<style scoped></style>