<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoimg from '@/assets/images/logos/focusYourLife.png';
</script>
<template>
    <div class="logo">
        <RouterLink to="#">
            <img :src="Logoimg" alt="home" height="100" width="200"/>
        </RouterLink>
    </div>
</template>