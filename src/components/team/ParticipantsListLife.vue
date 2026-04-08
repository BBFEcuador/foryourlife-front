<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Users } from '@/models/DashboardLife';
import { computed, ref, reactive } from 'vue';

interface Props {
  data: Users[];
}
const props = defineProps<Props>();
const search = ref<string>('');
const participantHeaders = [
  { title: 'Rol', value: 'userEntity', sortable: true },
  { title: 'Nombre', value: 'userName', sortable: true },
  { title: 'Declaración', value: 'thirdPromise', sortable: true },
  { title: 'Fichas', value: 'achievedCount', sortable: true },
  { title: 'Pagos', value: 'paidCount', sortable: true }
];

</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi:account-group" height="20" class="tw:text-indigo-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Lista de Participantes</h4>
          <p class="tw:text-sm tw:text-gray-500">Lista de todos los participantes</p>
        </div>
      </div>

      <v-data-table
        :headers="participantHeaders"
        :items="data"
        :search="search"
        class=""
      >
        <template v-slot:top>
          <v-toolbar
            class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
            flat
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="200"
            :duration="250"
          >
            <VTextField
              v-model="search"
              placeholder="Buscar Participantes..."
              variant="outlined"
              density="compact"
              class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
              clearable
              hide-details
            >
              <template #prepend-inner>
                <div class="tw:relative">
                  <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                  <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                </div>
              </template>
            </VTextField>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.userName="{ item }">
          <div class="tw:flex tw:items-center tw:gap-3 tw:py-1">
            <v-avatar variant="tonal" size="32" color="secondary">
              <span class="text-caption font-weight-bold"><Icon icon="mdi:account" class="secondary" height="18" /></span>
            </v-avatar>
            <span class="tw:font-medium tw:text-gray-800">{{ item.userName || '-' }}</span>
          </div>
        </template>
        <template v-slot:item.userEntity="{ item }">
          <v-chip size="small" :color="item.userEntity === 'Master Life' ? '#408943' : '#d97706'" variant="tonal">
            <span class="tw:font-semibold">{{ item.userEntity || '-' }}</span>
          </v-chip>
        </template>
        <template v-slot:item.thirdPromise="{ item }">
          <div class="tw:text-center tw:w-full tw:text-lg">
            <span class="tw:text-gray-700">{{ item.thirdPromise ?? '-' }}</span>
          </div>
        </template>
        <template v-slot:item.achievedCount="{ item }">
          <div class="tw:text-center tw:w-full tw:text-lg">
            <span class="tw:text-gray-700">{{ item.achievedCount ?? '-' }}</span>
          </div>
        </template>
        <template v-slot:item.paidCount="{ item }">
          <div class="tw:text-center tw:w-full tw:text-lg">
            <span class="tw:text-gray-700">{{ item.paidCount ?? '-' }}</span>
          </div>
        </template>
        <template #no-data>
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12">
            <Icon icon="mdi:account-off-outline" height="48" class="tw:text-gray-300 tw:mb-4" />
            <div v-if="search">
              <p class="tw:text-lg">No se encontraron participantes</p>
              <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
            </div>
            <div v-else>
              <p class="tw:text-sm tw:text-gray-500">No hay participantes registrados</p>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.text-16 {
  font-size: 16px !important;
  font-family: inherit !important;
}

.tw\:bg-indigo-50 {
  background-color: var(--tw-color-indigo-50) !important /* oklch(0.962 0.018 272.314) */;
}
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
  color: #334155;
  padding: 16px;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: background-color 0.2s ease;
}
</style>
