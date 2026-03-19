<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const warningColor = theme.current.value.colors.warning;
const successColor = theme.current.value.colors.success;
const errorColor = theme.current.value.colors.error;

// const { data: participants } = useParticipants();
// const { data: calendar } = useCalendar();
// const { data: teams } = useAdminTeams();
// const { trainers } = useTrainer();

const stats = ref({
  participants: {
    total: 300,
    growth: 0,
    history: [0, 4, 5, 6, 7, 10, 20, 0, 0, 0, 0, 30]
  },
  courses: {
    total: 10,
    growth: 0,
    history: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  teams: {
    total: 0,
    growth: 0,
    history: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  trainers: {
    total: 100,
    growth: 0,
    history: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
});


const chartOptions1 = computed(() => ({
  chart: {
    type: 'bar',
    height: 50,
    fontFamily: 'inherit',
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '60%'
    }
  },
  states: {
    normal: {
      filter: {
        type: 'none'
      }
    },
    hover: {
      filter: {
        type: 'none'
      }
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: 'none'
      }
    }
  },
  colors: ['#696cff'],
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  xaxis: {
    type: 'numeric',
    lines: {
      show: false
    },
    axisBorder: {
      show: false
    },
    labels: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    enabled: true
  }
}));

const chartOptions2 = computed(() => ({
  ...chartOptions1.value,
  colors: [warningColor]
}));

const chartOptions3 = computed(() => ({
  ...chartOptions1.value,
  colors: [successColor]
}));

const chartOptions4 = computed(() => ({
  ...chartOptions1.value,
  colors: [errorColor]
}));

const barChart1 = computed(() => ({
  series: [
    {
      name: 'Participantes',
      data: stats.value.participants.history
    }
  ]
}));

const barChart2 = computed(() => ({
  series: [
    {
      name: 'Programas',
      data: stats.value.courses.history
    }
  ]
}));

const barChart3 = computed(() => ({
  series: [
    {
      name: 'Equipos',
      data: stats.value.teams.history
    }
  ]
}));

const barChart4 = computed(() => ({
  series: [
    {
      name: 'Entrenadores',
      data: stats.value.trainers.history
    }
  ]
}));
</script>

<template>
  <v-row class="mb-0">
    <!-- Participants -->
    <v-col cols="12" md="6" lg="3">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="primary" rounded="md">
                  <Icon icon="mdi:account-group" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Participantes</h6>
            </v-list-item>
          </v-list>
          <v-sheet class="pa-6 pb-3 mt-1" color="containerBg" rounded="lg">
            <v-row class="widget-grid">
              <v-col cols="7">
                <apexchart type="bar" height="50" :options="chartOptions1" :series="barChart1.series"> </apexchart>
              </v-col>
              <v-col cols="5">
                <h5 class="text-h5">{{ stats.participants.total }}</h5>
                <p :class="['text-body-1 mb-0', stats.participants.growth >= 0 ? 'text-success' : 'text-error']">
                  <Icon :icon="stats.participants.growth >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" />
                  {{ Math.abs(stats.participants.growth) }}%
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Courses -->
    <v-col cols="12" md="6" lg="3">
      <v-card variant="outlined" elevation="0" class="bg-surface overflow-hidden" rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="warning" rounded="md">
                  <Icon icon="mdi:book-education" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Programas</h6>
            </v-list-item>
          </v-list>
          <v-sheet class="pa-6 pb-3 mt-1" color="containerBg" rounded="lg">
            <v-row class="widget-grid">
              <v-col cols="7">
                <apexchart type="bar" height="50" :options="chartOptions2" :series="barChart2.series"> </apexchart>
              </v-col>
              <v-col cols="5">
                <h5 class="text-h5">{{ stats.courses.total }}</h5>
                <p :class="['text-body-1 mb-0', stats.courses.growth >= 0 ? 'text-warning' : 'text-error']">
                  <Icon :icon="stats.courses.growth >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" />
                  {{ Math.abs(stats.courses.growth) }}%
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Teams -->
    <v-col cols="12" md="6" lg="3">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="success" rounded="md">
                  <Icon icon="mdi:account-group-outline" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Equipos</h6>
            </v-list-item>
          </v-list>
          <v-sheet class="pa-6 pb-3 mt-1" color="containerBg" rounded="lg">
            <v-row class="widget-grid">
              <v-col cols="7">
                <apexchart type="bar" height="50" :options="chartOptions3" :series="barChart3.series"> </apexchart>
              </v-col>
              <v-col cols="5">
                <h5 class="text-h5">{{ stats.teams.total }}</h5>
                <p :class="['text-body-1 mb-0', stats.teams.growth >= 0 ? 'text-success' : 'text-error']">
                  <Icon :icon="stats.teams.growth >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" />
                  {{ Math.abs(stats.teams.growth) }}%
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Trainers -->
    <v-col cols="12" md="6" lg="3">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="error" rounded="md">
                  <Icon icon="mdi:account-tie" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Entrenadores</h6>
            </v-list-item>
          </v-list>
          <v-sheet class="pa-6 pb-3 mt-1" color="containerBg" rounded="lg">
            <v-row class="widget-grid">
              <v-col cols="7">
                <apexchart type="bar" height="50" :options="chartOptions4" :series="barChart4.series"> </apexchart>
              </v-col>
              <v-col cols="5">
                <h5 class="text-h5">{{ stats.trainers.total }}</h5>
                <p :class="['text-body-1 mb-0', stats.trainers.growth >= 0 ? 'text-success' : 'text-error']">
                  <Icon :icon="stats.trainers.growth >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" />
                  {{ Math.abs(stats.trainers.growth) }}%
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.widget-grid {
  > div {
    @media (max-width: 1540px) and (min-width: 1280px) {
      flex: 0 0 100%;
      max-width: 100%;
      text-align: center;
    }
  }
}
</style>
