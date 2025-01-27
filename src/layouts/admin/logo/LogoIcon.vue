<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoiconimg from '@/assets/images/logos/full-logo.png';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="Logoiconimg" alt="home" width="200" />
        </RouterLink>
    </div>
</template>
