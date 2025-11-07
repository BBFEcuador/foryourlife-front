<script setup lang="ts">
import { computed } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { adminStore } from '@/stores/adminStore';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const store = adminStore();
const router = useRouter();

const onLogout = () => {
  store.logout();
  router.push({ name: 'Admin Login' });
};

// Computed para obtener nombre y email de forma segura
const userName = computed(() => store.user?.user?.name || 'Usuario');
const userEmail = computed(() => store.user?.email || '');
</script>

<template>
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar size="40" class="mr-2">
        <img src="@/assets/images/users/avatar-6.png" width="40" alt="profile" />
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
    <perfect-scrollbar v-if="checkPermission(PermissionEnum.SEE_CONFIGURATIONS)">
      <v-list class="py-0 mt-3 theme-list" lines="one">
        <v-list-item class="px-2 py-0 rounded-md custom-text-primary" color="primary" :to="{ name: 'settings' }">
          <div class="gap-4 d-flex justify-center align-center">
            <Icon icon="material-symbols:settings" />
            <p class="text-subtitle-1 heading custom-title">Ajustes</p>
          </div>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
