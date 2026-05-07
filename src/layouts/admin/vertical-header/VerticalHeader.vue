<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useCustomizerStore } from '../../../stores/customizer';
import useCampus from '@/composables/admin/useCampus';
import { adminStore } from '@/stores/adminStore';
import { router } from '@/router';
import ProfileDD from './ProfileDD.vue';

const customizer = useCustomizerStore();
const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
const store = adminStore();
const { campus } = useCampus();

/* campus seleccionado conectado directamente al store */
const selectCampus = computed({
  get: () => store.selectCampusId,
  set: (value: string) => {
    store.setSelectedCampusId(value);
    store.setIsCampusSelected(!!value);
    router.push({ name: 'home-admin' });
  }
});

const hasFullAccess = computed(() => {
  return store.availableCampus.length && campus.value.length && store.availableCampus.length === campus.value.length;
});

const vselectItems = computed(() => {
  if (hasFullAccess.value) {
    return [{ city: 'Todas las sucursales', id: '' }, ...campus.value];
  }

  return store.availableCampus;
});

watch(
  vselectItems,
  (items) => {
    if (items.length && !selectCampus.value) {
      selectCampus.value = items[0].id;
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-app-bar elevation="0" :priority="priority" height="74" class="px-sm-10 px-5">
    <v-btn
      class="hidden-md-and-down mr-5 ml-0"
      color="secondary"
      icon
      aria-label="sidebar button"
      rounded="sm"
      variant="tonal"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    >
      <SvgSprite name="custom-menu-outline" style="width: 24px; height: 24px" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up text-secondary"
      color="darkText"
      icon
      rounded="sm"
      variant="text"
      size="small"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
    >
      <SvgSprite name="custom-menu-outline" style="width: 24px; height: 24px" />
    </v-btn>
    <v-spacer />
    <v-select class="mt-5" v-model="selectCampus" placeholder="Elija el campus" :items="vselectItems" item-title="city" item-value="id" />
    <v-spacer />

    <v-menu :close-on-content-click="false" offset="8, 0">
      <template v-slot:activator="{ props }">
        <v-btn class="profileBtn mr-0" aria-label="profile" variant="text" rounded="circle" icon v-bind="props">
          <v-avatar class="py-2" size="40" rounded="circle">
            <img src="@/assets/images/users/avatar-6.png" class="rounded-circle" alt="profile" />
          </v-avatar>
        </v-btn>
      </template>
      <v-sheet rounded="md" width="290">
        <ProfileDD />
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>
