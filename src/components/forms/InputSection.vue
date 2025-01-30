<script setup lang="ts">
interface props {
  label: string;
}

const props = defineProps<props>();
</script>

<template>
  <div class="d-flex ga-2 flex-column">
    <label for="font-weight-bold">{{ props.label }}</label>
    <slot />
  </div>
</template>

<style scoped></style>
