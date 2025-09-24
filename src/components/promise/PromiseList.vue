<script setup lang="ts">
import usePromises from '@/composables/admin/promise/usePromises';
import type { TrainingData } from '@/models/Training';
import { toRef } from 'vue';


defineProps < { trainingId: string[] } > ();

const trainingIdRef = toRef(props, 'trainingId');

const { promisesData, isPromisesLoading, isPromisesError } = usePromises(trainingIdRef);

</script>

<template>

</template>


<style></style>