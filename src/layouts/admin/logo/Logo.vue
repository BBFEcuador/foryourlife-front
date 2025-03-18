<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoimg from '@/assets/images/logos/focusYourLife.png';
</script>
<template>
    <div class="logo">
        <RouterLink to="/admin">
            <img :src="Logoimg" alt="home" height="100" />
        </RouterLink>
    </div>
</template>