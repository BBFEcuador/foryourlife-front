<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AgeDashboard } from '@/models/DashboardFocus';
import { computed, onMounted, ref } from 'vue';

interface Props {
  data: AgeDashboard[];
  loading: boolean;
}

const props = defineProps<Props>();
const ageLabels = ['Menor 18', '18 - 27', '28 - 40', '41 - 65', '65+'];
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  console.log('Emitiendo loaded desde AgeChartByTeam');
  emit('loaded');
});

const chartSeries = computed(() => {
  const ageArr = props.data ?? [];
  const ageKeys = ['age_less_18', 'age_18_27', 'age_28_40', 'age_41_65', 'age_above_65'];

  const series = ageKeys.map((k, idx) => {
    const values = ageArr.map((d: any) => {
      return Number((d as any)[k] ?? 0);
    });
    return { name: ageLabels[idx], data: values };
  });
  return series;
});

const xCategories = computed(() => {
  return (props.data ?? []).map((d: any) => d.day);
});

const totalsPerDay = computed(() => {
  const ageArr = props.data ?? [];
  const ageKeys = ['age_less_18', 'age_18_27', 'age_28_40', 'age_41_65', 'age_above_65'];
  return ageArr.map((d: any) => ageKeys.reduce((sum, k) => sum + Number((d as any)[k] ?? 0), 0));
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 400 }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    colors: ['#E08DAC', '#6a7fdb', '#57e2e5', '#FF7F50', '#153131']
,
    legend: { position: 'bottom', horizontalAlign: 'center' },
    xaxis: { categories: xCategories.value },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return Math.round(val).toString();
        }
      },
      title: { text: 'Nro. Personas' },
      min: 0
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return Math.round(val).toString();
        }
      }
    },
    dataLabels: { enabled: false },
    annotations: {
      points: (totalsPerDay.value || []).map((t: number, i: number) => ({
        x: xCategories.value[i] ?? i,
        y: t + 0.5,
        marker: { size: 0 },
        label: {
          text: String(t),
          style: {
            color: '#fff',
            background: '#374151',
            fontSize: '13px',
            fontWeight: '600'
          },
          offsetY: -8
        }
      }))
    },
    fill: { opacity: 1 }
  };
});
</script>

<template>
  <v-card variant="flat" elevation="0" class="" rounded="2" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-account-clock" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Distribución por Edad</h4>
          <p class="tw:text-sm tw:text-gray-500">Distribución de personas por grupos de edad</p>
        </div>
      </div>
      <v-sheet elevation="0">
        <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
