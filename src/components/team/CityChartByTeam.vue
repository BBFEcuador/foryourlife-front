<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { CityParticipantDashboard } from '@/models/DashboardFocus';
import { computed, ref, onMounted } from 'vue';

interface Props {
  data: CityParticipantDashboard[];
}

const props = defineProps<Props>();
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

// Usamos únicamente gender (male / female) en este componente
const cityLabels = ['Quito', 'Provincia'];
const cityKeys = ['quito', 'province'];
const cityColors = ['#4F6F64', '#7A5C45'];

const tabs = ['Viernes', 'Sábado', 'Domingo'];
const activeTab = ref(0);

function seriesFromEntry_gender(entry: any) {
  return cityKeys.map((k) => Number((entry as any)[k] ?? 0));
}


function findEntryByMatchers(matchers: string[]) {
  const arr = props.data ?? [];
  const found = arr.find((d: any) => {
    const day = String((d as any).day ?? '').toLowerCase();
    return matchers.some((m) => day.includes(m));
  });
  return found ?? null;
}

const currentSeries = computed(() => {
  const tab = tabs[activeTab.value];
  const key = tab.toLowerCase();
  let matchers: string[] = [];
  if (key.includes('vie')) matchers = ['vie', 'fri'];
  else if (key.includes('sáb') || key.includes('sab')) matchers = ['sáb', 'sat'];
  else if (key.includes('dom')) matchers = ['dom', 'sun'];

  const entry = findEntryByMatchers(matchers);
  if (!entry) return cityKeys.map(() => 0);
  return seriesFromEntry_gender(entry);
});


const chartOptions = computed(() => ({
  chart: { type: 'polarArea', height: 200, animations: { enabled: true, easing: 'easeinout', speed: 400 } },
  labels: cityLabels,
  colors: cityColors,
  legend: { position: 'bottom', horizontalAlign: 'center' },
  dataLabels: { enabled: false, formatter: (val: number) => Math.round(val).toString() },
  tooltip: { y: { formatter: (val: number) => Math.round(val).toString() } },
  responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
}));
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-city" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Distribución por Ciudad</h4>
          <p class="tw:text-sm tw:text-gray-500">Distribución de participantes por ciudad</p>
        </div>
      </div>

      <v-tabs v-model="activeTab" color="primary" class="mb-4">
        <v-tab v-for="(t, i) in tabs" :key="t" :value="i">{{ t }}</v-tab>
      </v-tabs>

      <v-sheet elevation="0">
        <apexchart type="polarArea" height="200" :options="chartOptions" :series="currentSeries"></apexchart>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
