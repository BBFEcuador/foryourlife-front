<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { DeclarationStats } from '@/models/DashboardLife';
import { computed } from 'vue';

interface Props {
  data: DeclarationStats;
}
const props = defineProps<Props>();
const chartSeries = computed(() => {
  const declarationStats = props.data;
  return [
    {
      name: 'Master Life',
      data: [
        declarationStats?.totalMasterLifePromisesCount ?? 0,
        declarationStats?.totalMasterLifeAchievedCount ?? 0,
        declarationStats?.totalMasterLifePaidCount ?? 0
      ]
    },
    {
      name: 'Participantes',
      data: [
        declarationStats?.totalParticipantPromisesCount ?? 0,
        declarationStats?.totalParticipantAchievedCount ?? 0,
        declarationStats?.totalParticipantPaidCount ?? 0
      ]
    }
  ];
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
    colors: ['#408943', '#d97706'],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    xaxis: { categories: ['Declaración', 'Ficha', 'Pagos'] },
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
      points: [
        {
          x: 'Declaración',
          y: (props.data?.totalTeamLifePromisesCount ?? 0) + 0.5,
          marker: { size: 0 },
          label: {
            text: `${props.data.totalTeamLifePromisesCount ?? 0}`,
            style: {
              color: '#fff',
              background: '#374151',
              fontSize: '13px',
              fontWeight: '600'
            },
            offsetY: -8
          }
        },
        {
          x: 'Ficha',
          y: (props.data?.totalTeamAchievedCount ?? 0) + 0.5,
          marker: { size: 0 },
          label: {
            text: `${props.data?.totalTeamAchievedCount ?? 0}`,
            style: {
              color: '#fff',
              background: '#374151',
              fontSize: '13px',
              fontWeight: '600'
            },
            offsetY: -8
          }
        },
        {
          x: 'Pagos',
          y: (props.data?.totalTeamPaidCount ?? 0) + 0.5,
          marker: { size: 0 },
          label: {
            text: `${props.data?.totalTeamPaidCount ?? 0}`,
            style: {
              color: '#fff',
              background: '#374151',
              fontSize: '13px',
              fontWeight: '600'
            },
            offsetY: -8
          }
        }
      ]
    },
    fill: { opacity: 1 }
  };
});
</script>

<template>
  <v-card variant="flat" elevation="1" rounded="lg">
    <v-card-text class="pa-3">
      <div class="tw:flex tw:items-center tw:gap-3 mb-3">
        <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi-sigma" height="20" class="tw:text-cyan-600" />
        </div>
        <div>
          <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Total Generales</h4>
          <p class="tw:text-sm tw:text-gray-500">Totales de Master Life y participantes</p>
        </div>
      </div>
      <v-sheet elevation="0">
        <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.text-16 {
  font-size: 16px !important;
  font-family: inherit !important;
}
</style>
