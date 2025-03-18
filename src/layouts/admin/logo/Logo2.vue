<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoimg from '@/assets/images/logos/focusYourLife2.png';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="Logoimg" alt="home" height="300" />
        </RouterLink>
    </div>
</template>