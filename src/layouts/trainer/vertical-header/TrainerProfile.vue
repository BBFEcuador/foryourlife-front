<script setup lang="ts">
import { trainerStore } from '@/stores/trainerStore.ts';
import { useRouter } from 'vue-router';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { computed } from 'vue';

const store = trainerStore();
const router = useRouter();

const onLogout = () => {
  store.logout();
  router.push({ name: 'trainer-login' });
};

const userName = computed(() => store.trainer?.name || 'Usuario');
const userEmail = computed(() => store.trainer?.email || '');
</script>

<template>
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar size="40" class="mr-2">
        <img src="@/assets/images/users/avatar-6.png" width="64" alt="profile" />
      </v-avatar>
      <div>
        <h6 class="text-subtitle-1 mb-0">{{ userName }}</h6>
        <p class="text-caption text-lightText mb-0">{{ userEmail }}</p>
      </div>
      <div class="ml-auto">
        <v-btn variant="text" aria-label="logout" color="error" rounded="sm" icon size="large" @click="onLogout">
          <SvgSprite name="custom-logout-1" />
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
  </div>
</template>

<style scoped></style>
