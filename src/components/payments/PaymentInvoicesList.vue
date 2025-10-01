<script setup lang="ts">
import type { Invoice } from '@/models/Invoice';

const props = defineProps<{
  modelValue: boolean;
  originPos?: boolean;
  invoice?: Invoice;
}>();


</script>

<template>
    <v-dialog v-model="" max-width="600px">

    </v-dialog>
</template>
