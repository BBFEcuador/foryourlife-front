<script setup>
import PromiseList from '@/components/promise/PromiseList.vue';
import { adminStore } from '@/stores/adminStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const admin = adminStore();
</script>
<template>
  <div>
    <h1>Admin Promises</h1>
    <PromiseList />
  </div>
</template>

<style scoped></style>
