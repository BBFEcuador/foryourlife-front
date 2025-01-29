<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref } from 'vue';

const breadcrumbs = ref([
    {
        title: 'Entrenamiento',
        disabled: false,
        href: '#'
    }
]);
</script>
<template>
    <BaseBreadcrumb :title="'Participantes'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <div>
        Participants
    </div>
</template>


<style scoped></style>