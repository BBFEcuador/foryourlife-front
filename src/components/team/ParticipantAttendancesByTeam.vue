<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { FocusAttendanceDashboard } from '@/models/DashboardFocus';
import { computed, ref, onMounted } from 'vue';

interface Props {
  data: FocusAttendanceDashboard;
}
const props = defineProps<Props>();
const attendances = computed(() => props.data?.attendances ?? []);
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

const search = ref('');
const headers = [
  { title: 'Nombre', value: 'userName', sortable: true },
  { title: 'Viernes', value: 'fridayAttendance', sortable: true },
  { title: 'Sábado', value: 'saturdayAttendance', sortable: true },
  { title: 'Domingo', value: 'sundayAttendance', sortable: true }
];
</script>

<template>
  <v-card variant="flat" elevation="0" rounded="2" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-check" height="20" class="tw:text-indigo-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">
            Resúmen de Asistencias por Participantes
          </h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de asistencias por participantes</p>
        </div>
      </div>

      <v-data-table :items="attendances" :headers="headers" :search="search" class="" dense>
        <template v-slot:top>
          <v-alert color="pt-2 pb-2">
            <div class="tw:flex tw:items-center tw:gap-6">
              <div class="tw:flex-1">
                <p class="tw:font-semibold tw:text-xs">Total Asistencias</p>
                <p class="tw:text-sm tw:font-semibold text-end tw:text-indigo-900">{{ props.data?.totalFocus ?? '' }}</p>
              </div>
              <v-spacer></v-spacer>
              <div class="tw:flex-1">
                <p class="tw:font-semibold tw:text-xs">Total Rezagados</p>
                <p class="tw:text-sm tw:font-semibold text-end tw:text-indigo-900">{{ props.data?.totalLingerer ?? '' }}</p>
              </div>
            </div>
          </v-alert>
          <v-divider class="my-2"></v-divider>
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
              placeholder="Buscar Participante..."
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
        <template #item.userName="{ item }">
          <div class="tw:flex tw:items-center tw:gap-3 tw:py-1">
            <div
              class="tw:w-8 tw:h-8 tw:rounded-full tw:bg-gradient-to-br tw:from-indigo-100 tw:to-purple-100 tw:flex tw:items-center tw:justify-center"
            >
              <Icon icon="mdi:account" class="tw:text-indigo-600" height="18" />
            </div>
            <span class="tw:font-medium tw:text-gray-800">{{ item.userName ?? '' }}</span>
          </div>
        </template>
        <template #item.fridayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.fridayAttendance === 'ASISTIO',
                'tw:text-red-700': item.fridayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.fridayAttendance
              }"
              :icon="
                item.fridayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.fridayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-dash-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
        <template #item.saturdayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.saturdayAttendance === 'ASISTIO',
                'tw:text-red-700': item.saturdayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.saturdayAttendance
              }"
              :icon="
                item.saturdayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.saturdayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-dash-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
        <template #item.sundayAttendance="{ item }">
          <div class="tw:flex tw:items-center tw:justify-center">
            <Icon
              :class="{
                'tw:text-indigo-600': item.sundayAttendance === 'ASISTIO',
                'tw:text-red-700': item.sundayAttendance === 'NO_ASISTIO',
                'tw:text-gray-400': !item.sundayAttendance
              }"
              :icon="
                item.sundayAttendance === 'ASISTIO'
                  ? 'mdi-check-circle-outline'
                  : item.sundayAttendance === 'NO_ASISTIO'
                    ? 'mdi-close-circle-outline'
                    : 'mdi-dash-circle-outline'
              "
              height="20"
            />
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.tw\:bg-indigo-50 {
  background-color: var(--tw-color-indigo-50) !important /* oklch(0.962 0.018 272.314) */;
}
</style>
