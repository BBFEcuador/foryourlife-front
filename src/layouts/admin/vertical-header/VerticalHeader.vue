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

const selectCampus = ref(store.selectCampusId);

// Determina si el usuario tiene acceso total
const hasFullAccess = computed(() => {
  // Ambos deben tener longitud mayor a 0 para evitar falsos positivos
  return (
    Array.isArray(store.availableCampus) &&
    Array.isArray(campus.value) &&
    store.availableCampus.length > 0 &&
    campus.value.length > 0 &&
    store.availableCampus.length === campus.value.length
  );
});

// Items del select
const vselectItems = computed(() => {
  return hasFullAccess.value ? [{ city: 'Todas las sucursales', id: '' }, ...campus.value] : store.availableCampus;
});

// Sincroniza la selección de campus al iniciar sesión o cuando cambian los campus disponibles
watch(
  [() => store.availableCampus, () => campus.value, hasFullAccess],
  async ([available, allCampuses, fullAccess]) => {
    await nextTick(); // Espera a que los valores estén actualizados
    // Si no hay campus disponibles, limpia la selección
    if (!available?.length || !allCampuses?.length) {
      selectCampus.value = '';
      store.setSelectedCampusId('');
      store.setIsCampusSelected(false);
      return;
    }
    // Si tiene acceso total, selecciona "Todas las sucursales"
    if (fullAccess) {
      selectCampus.value = '';
      store.setSelectedCampusId('');
      store.setIsCampusSelected(false);
    } else {
      // Si tiene acceso parcial, selecciona el primer campus disponible
      const defaultCampus = available[0];
      if (defaultCampus && defaultCampus.id !== selectCampus.value) {
        selectCampus.value = defaultCampus.id;
        store.setSelectedCampusId(defaultCampus.id);
        store.setIsCampusSelected(true);
      }
    }
  },
  { immediate: true }
);

// Cambia el campus seleccionado y navega
const storeCampusOnAdmin = (id: string) => {
  selectCampus.value = id;
  store.setIsCampusSelected(!!id);
  store.setSelectedCampusId(id);
  router.push({ name: 'home-admin' });
};
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
    <v-select
      class="mt-5"
      :model-value="selectCampus"
      placeholder="Elija el campus"
      :items="vselectItems"
      item-title="city"
      item-value="id"
      @update:model-value="storeCampusOnAdmin"
    ></v-select>
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
