<script setup lang="ts">
const year = new Date().getFullYear();

</script>
<template>
  <v-footer class="px-0 footer">
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <p class="text-caption mb-0">
          {{year}} Focus Your Life
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>
