<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { LingererStats } from '@/models/DashboardFocus';
import { computed, ref, onMounted } from 'vue';

interface Props {
  data: LingererStats;
}
const props = defineProps<Props>();
const emit = defineEmits(['loaded']);
const ready = ref(false);
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

const currentSeries = computed(() => {
  const total = props.data?.total ?? 0;
  if (!total) return [0, 0];

  return [(((props.data?.attended ?? 0) * 100) / total).toFixed(2), (((props.data?.notAttended ?? 0) * 100) / total).toFixed(2)];
});

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    height: '100%',
    width: '100%',
    parentHeightOffset: 0,
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 400
    }
  },
  labels: ['Asistió', 'No Asistió'],
  colors: ['#1D4ED8', '#475569'],
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,

      hollow: {
        margin: 5,
        size: '35%',
        background: 'transparent'
      },

      dataLabels: {
        name: { show: false },
        value: { show: false },
        total: { show: false }
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -7,
        fontSize: '14px',
        formatter: function (seriesName: string, opts: any) {
          return opts.w.globals.series[opts.seriesIndex] + ' % ';
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        markers: {
          width: 10,
          height: 10,
          radius: 12
        }
      }
    }
  },

  tooltip: {
    enabled: true,
    theme: 'dark',
    followCursor: true,
    y: {
      formatter: (val: number) => `${(Number(val) || 0).toFixed(2)} %`
    },
    style: {
      fontSize: '13px',
      fontFamily: 'inherit'
    }
  },

  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center'
  },

  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 220
        }
      }
    }
  ]
}));

const jornals = ref([
  {
    title: 'Última Jornada',
    attended: computed(() => props.data?.finalJornal?.attended ?? 0),
    total: computed(() => props.data?.finalJornal?.total ?? 0)
  },
  {
    title: 'Penúltima Jornada',
    attended: computed(() => props.data?.penultimateJornal?.attended ?? 0),
    total: computed(() => props.data?.penultimateJornal?.total ?? 0)
  },
  {
    title: 'Antepenúltima Jornada',
    attended: computed(() => props.data?.penultimateMatchJornal?.attended ?? 0),
    total: computed(() => props.data?.penultimateMatchJornal?.total ?? 0)
  },
  {
    title: 'Recuperados',
    attended: computed(() => props.data?.recovered?.attended ?? 0),
    total: computed(() => props.data?.recovered?.total ?? 0)
  }
]);

const percentageJornal = (attended: number, total: number) => {
  if (!total) return (0).toFixed(2);
  return ((attended * 100) / total).toFixed(2);
};
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg" v-if="ready">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-red-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-walk" height="20" class="tw:text-red-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Resúmen de Rezagados</h4>
          <p class="tw:text-sm tw:text-gray-500">Listado de rezagados</p>
        </div>
      </div>
    </v-card-text>
    <v-card-item class="pt-1">
      <v-row>
        <v-col cols="12" md="5" sm="12" class="chart-container">
          <apexchart v-if="props.data" type="radialBar" width="100%" height="100%" :options="chartOptions" :series="currentSeries" />
        </v-col>
        <v-col cols="12" md="7" sm="12">
          <v-row>
            <v-col v-for="item in jornals" :key="item.title" cols="12" class="">
              <span class="tw:font-semibold">{{ item.title }}</span>
              <div class="d-flex justify-space-between gap-4 text-medium-emphasis mb-1 text-grey-darken-2">
                <span>{{ item.attended }} / {{ item.total }}</span>
                <span class="tw:font-semibold text-b">{{ percentageJornal(item.attended, item.total) }}%</span>
              </div>
              <div class="d-flex justify-space-between gap-4 text-medium-emphasis text-grey-darken-2">
                <v-progress-linear
                  :model-value="percentageJornal(item.attended, item.total)"
                  color="#1D4ED8"
                  class="tw-bg-amber-400"
                  bg-color="#475569"
                  bg-opacity="0.2"
                  height="7"
                  rounded
                ></v-progress-linear>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
<style scoped>
.text-b {
  color: #1d4ed8 !important;
}
</style>
