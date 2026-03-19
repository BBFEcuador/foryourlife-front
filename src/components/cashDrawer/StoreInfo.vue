<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Store } from '@/models/CashDrawer';

const props = defineProps<{
  selectedStore: Store | null;
}>();

const emit = defineEmits<{
  (e: 'reloadStores'): void;
}>();
</script>

<template>
  <div v-if="props.selectedStore">
    <div cols="12" md="auto" class="d-flex align-center mt-3 mb-3">
      <Icon icon="mdi-store-outline" class="mr-2" width="20" />
      <div class="tw:font-bold font-12">Establecimiento No. {{ props.selectedStore.number }}</div>
    </div>
    <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
      <v-divider></v-divider>
      <v-card-item class="">
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex">
              <div class="tw:content-center mr-2">
                <Icon icon="mdi-location" width="20" class="text-primary"></Icon>
              </div>
              <div>
                <span class="tw:text-sm tw:text-gray-500">Dirección</span>
                <p class="text-h6 font-weight-regular">
                  {{ props.selectedStore.address }}
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="d-flex">
              <div class="tw:content-center mr-2">
                <Icon icon="mdi-phone" width="20" class="text-primary"></Icon>
              </div>
              <div>
                <span class="tw:text-sm tw:text-gray-500">Teléfono</span>
                <p class="text-h6 font-weight-regular">
                  {{ props.selectedStore.campus.phone }}
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="text-end tw:content-center">
            <v-chip class="font-weight-bold" :color="props.selectedStore.isActive ? '#006e00' : 'error'" style="font-size: 0.75rem">
              <Icon icon="mdi-circle" width="10" class="mr-2" />
              {{ props.selectedStore.isActive ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </v-col>
        </v-row>
        <v-chip
          v-if="props.selectedStore.campus.city && props.selectedStore.campus.country"
          class="font-weight-bold mt-2 ml-6"
          color="primary"
          style="font-size: 0.75rem"
          size="small"
        >
          {{ props.selectedStore.campus.city }} - {{ props.selectedStore.campus.country }}
        </v-chip>
      </v-card-item>
    </v-card>
  </div>
</template>

<style scoped>
.tw\:border-5 {
  border-style: var(--tw-border-style) !important;
  border-bottom-width: 5px !important;
}

.font-12 {
  font-size: 12pt !important;
}

.font-9 {
  font-size: 9pt !important;
}
</style>
