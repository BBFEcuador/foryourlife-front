<script setup lang="ts">
import { ref } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';

import { useAuthStore } from '@/stores/auth';
import { userStore } from '@/stores/useStore';
const store = userStore();
const tab = ref(null);
const authStore = useAuthStore();

const profiledata1 = ref([
  {
    title: 'Edit profile',
    icon: 'custom-edit'
  }
]);

const profiledata2 = ref([
  {
    title: 'Support',
    icon: 'custom-support'
  }
]);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar size="40" class="mr-2">
        <img src="@/assets/images/users/avatar-1.png" width="40" alt="profile" />
      </v-avatar>
      <div>
        <h6 class="text-subtitle-1 mb-0">{{store.user.name}}</h6>
        <p class="text-caption text-lightText mb-0">{{store.user.email}}</p>
      </div>
      <div class="ml-auto">
        <v-btn variant="text" aria-label="logout" color="error" rounded="sm" icon size="large" @click="authStore.logout()">
          <SvgSprite name="custom-logout-1" />
        </v-btn>
      </div>
    </div>
    <v-tabs v-model="tab" color="primary" grow>
      <v-tab value="111">
        <div class="v-icon--start">
          <SvgSprite name="custom-user-outline" style="width: 18px; height: 18px" />
        </div>
        Cuenta
      </v-tab>
      <v-tab value="222">
        <div class="v-icon--start">
          <SvgSprite name="custom-setting-outline-1" style="width: 18px; height: 18px" />
        </div>
        Ajustes
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 240px">
      <v-window v-model="tab">
        <v-window-item value="111">
          <v-list class="px-2" aria-label="profile list" aria-busy="true">
            <v-list-item
              v-for="(item, index) in profiledata1"
              :key="index"
              color="primary"
              base-color="secondary"
              rounded="md"
              :value="item.title"
              class="mb-1"
            >
              <template v-slot:prepend>
                <div class="mr-4">
                  <SvgSprite :name="item.icon || ''" style="width: 18px; height: 18px" />
                </div>
              </template>

              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="authStore.logout()" color="primary" base-color="secondary" rounded="md">
              <template v-slot:prepend>
                <div class="mr-4">
                  <SvgSprite name="custom-logout-1" style="width: 18px; height: 18px" />
                </div>
              </template>

              <v-list-item-title class="text-h6"> Logout</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-window-item>
        <v-window-item value="222">
          <v-list class="px-2" aria-label="profile list" aria-busy="true">
            <v-list-item
              v-for="(item, index) in profiledata2"
              :key="index"
              color="primary"
              base-color="secondary"
              rounded="md"
              :value="item.title"
              class="mb-1"
            >
              <template v-slot:prepend>
                <div class="mr-4">
                  <SvgSprite :name="item.icon || ''" style="width: 18px; height: 18px" />
                </div>
              </template>

              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </perfect-scrollbar>
  </div>
</template>
