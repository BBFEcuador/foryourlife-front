<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useTrainer from '@/router/useTrainers';
import { ref } from 'vue';
const {isError, isFetching, trainers} = useTrainer();
const breadcrumbs = ref([
    {
        title: 'Entrenamiento',
        disabled: false,
        href: '#'
    }
]);

</script>
<template>
    <BaseBreadcrumb :title="'Entrenadores'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <div>
        training
        {{ trainers  }}
    </div>
</template>


<style scoped></style>