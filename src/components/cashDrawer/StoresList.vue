<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Store } from '@/models/CashDrawer';
import type { AxiosError } from 'axios';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';
import { toast } from 'vue3-toastify';
import { adminStore } from '@/stores/adminStore';
import useStores from '@/composables/admin/pos/useStores';
import useContificoPosMutation from '@/composables/admin/contifico/useContificoPos';

const props = defineProps<{
  selectedStore: Store | null;
}>();

const emit = defineEmits<{
  (e: 'update:selectedStore', value: Store | null): void;
}>();
const store = adminStore();
const campusSelected = ref(store.isCampusSelected);
const { stores, isStoresLoading, debouncedSearch, loadMoreStores, hasMoreStores, isStoreError, isLoadingMore, retry } = useStores();
const { useContificoSyncPosMutations, isSyncPosLoading } = useContificoPosMutation();
const scrollContainer = ref<HTMLElement | null>(null);

const handleScroll = async () => {
  if (!scrollContainer.value || isLoadingMore.value || !hasMoreStores.value) {
    return;
  }

  const element = scrollContainer.value;
  const threshold = 100;

  if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
    await loadMoreStores();
  }
};

const syncPos = async () => {
  console.log('Campus seleccionado:', campusSelected.value);
  if(!campusSelected.value){
    toast.error('Por favor, seleccione una sucursal para sincronizar los establecimientos');
    return;
  }

  await useContificoSyncPosMutations(undefined, {
    onSuccess: () => {
      toast.success('Sincronización exitosa');
      retry();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al sincronizar');
    }
  });
};

onMounted(async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});

const onSelectedStore = (store: Store) => {
  emit('update:selectedStore', store);
};
</script>

<template>
  <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
    <v-card-title class="d-flex align-center">
      <Icon icon="mdi-store" class="mr-2" />
      <div class="tw:font-bold font-12 tw:flex-1">Establecimientos</div>
      <v-spacer></v-spacer>
      <VBtn
        v-if="checkPermission(PermissionEnum.UPDATE_EMISSION_POINTS)"
        :loading="isSyncPosLoading"
        color="info"
        variant="tonal"
        @click="syncPos"
        icon
      >
        <Icon icon="mdi:reload" />
        <v-tooltip activator="parent" location="bottom" open-delay="400">Sincronizar establecimientos de Contifico</v-tooltip>
      </VBtn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-item class="mt-0 pt-2 pb-2">
      <v-text-field
        v-model="debouncedSearch"
        class="pt-3"
        placeholder="Establecimiento ..."
        label="Buscar establecimiento"
        :loading="isStoresLoading"
        clearable
        variant="outlined"
        density="compact"
        hide-details="auto"
      >
        <template #prepend-inner>
          <Icon icon="mdi:magnify" />
        </template>
      </v-text-field>
    </v-card-item>

    <v-card-item class="mt-0 pb-2 pa-0">
      <div ref="scrollContainer" class="training-list-container" style="max-height: 275px; overflow-y: auto">
        <div v-if="isStoresLoading" class="pa-4">
          <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-two-line" class="mb-2" />
        </div>
        <div v-else-if="stores.length > 0">
          <v-list density="compact">
            <v-list-item
              v-for="store in stores"
              :key="store.id"
              class="pb-2 pt-2 tw:border-5"
              :class="{ 'v-list-item--active': selectedStore?.id === store.id }"
              @click="onSelectedStore(store)"
              :disabled="!store.isActive"
            >
              <v-list-item-title>
                <span class="tw:font-semibold">Establecimiento {{ store.number }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="tw:text-sm">{{ store.address }}</span>
              </v-list-item-subtitle>

              <div class="mt-2">
                <v-chip class="font-weight-bold mr-2" :color="store.isActive ? '#006e00' : 'error'" style="font-size: 0.75rem" size="small">
                  <Icon icon="mdi-circle" width="10" class="mr-2"></Icon> {{ store.isActive ? 'Activo' : 'Inactivo' }}
                </v-chip>
                <v-chip
                  v-if="store.campus.city && store.campus.country"
                  class="font-weight-bold"
                  color="primary"
                  style="font-size: 0.75rem"
                  size="small"
                >
                  {{ store.campus.city }} - {{ store.campus.country }}
                </v-chip>
              </div>
            </v-list-item>
          </v-list>
          <div v-if="isLoadingMore" class="text-center pa-4">
            <v-progress-circular indeterminate size="24" />
            <p class="text-caption mt-2">Cargando más establecimientos...</p>
          </div>
          <div v-else-if="!hasMoreStores && stores.length > 0" class="text-center">
            <v-divider></v-divider>
            <p class="text-caption text-medium-emphasis pa-4">No hay más establecimientos</p>
          </div>
        </div>
        <div v-else-if="!isStoresLoading" class="text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">
            <Icon icon="mdi-magnify" />
          </v-icon>
          <p class="text-body-2 mt-2">No se encontraron establecimientos</p>
        </div>
        <div v-else-if="isStoreError" class="text-center pa-4">
          <v-icon size="48" color="error">
            <Icon icon="mdi-alert-circle" />
          </v-icon>
          <p class="text-body-2 mt-2 text-error">Error al cargar entrenamientos</p>
          <v-btn size="small" color="error" variant="outlined" class="mt-2" @click="retry"> Reintentar </v-btn>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.tw\:border-5 {
  border-style: var(--tw-border-style) !important;
  border-bottom-width: 5px !important;
}

.font-12 {
  font-size: 12pt !important;
}
</style>
