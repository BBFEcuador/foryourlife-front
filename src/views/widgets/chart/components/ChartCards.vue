<script setup lang="ts">
import { ref, computed, watchEffect as vueWatchEffect } from 'vue';
import { useTheme } from 'vuetify';
import { adminStore } from '@/stores/adminStore';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import useAdminTeams from '@/composables/admin/team/useAdminTeams';
import useTrainer from '@/composables/admin/trainer/useTrainers';

const theme = useTheme();
const warningColor = theme.current.value.colors.warning;
const successColor = theme.current.value.colors.success;
const errorColor = theme.current.value.colors.error;

const { data: participants } = useParticipants();
const { data: calendar } = useCalendar();
const { data: teams } = useAdminTeams();
const { trainers } = useTrainer();

const stats = ref({
  participants: {
    total: 0,
    growth: 0,
    history: [] as number[]
  },
  courses: {
    total: 0,
    growth: 0,
    history: [] as number[]
  },
  teams: {
    total: 0,
    growth: 0,
    history: [] as number[]
  },
  trainers: {
    total: 0,
    growth: 0,
    history: [] as number[]
  }
});

vueWatchEffect(() => {
  if (participants.value) {
    const participantsCount = participants.value.length;
    stats.value.participants.total = participantsCount;
    
    const previousCount = stats.value.participants.history[0] || 0;
    if (previousCount > 0) {
      stats.value.participants.growth = ((participantsCount - previousCount) / previousCount) * 100;
    }
    
    stats.value.participants.history = [
      participantsCount,
      ...stats.value.participants.history.slice(0, 11)
    ].slice(0, 12);
  }

  if (calendar.value) {
    const coursesCount = calendar.value.length;
    stats.value.courses.total = coursesCount;
    
    const previousCount = stats.value.courses.history[0] || 0;
    if (previousCount > 0) {
      stats.value.courses.growth = ((coursesCount - previousCount) / previousCount) * 100;
    }
    
    stats.value.courses.history = [
      coursesCount,
      ...stats.value.courses.history.slice(0, 11)
    ].slice(0, 12);
    stats.value.courses.history = [
      coursesCount,
      ...stats.value.courses.history.slice(0, 11)
    ].slice(0, 12);
  }

  if (teams.value) {
    const teamsCount = teams.value.length;
    stats.value.teams.total = teamsCount;
    
    const previousCount = stats.value.teams.history[0] || 0;
    if (previousCount > 0) {
      stats.value.teams.growth = ((teamsCount - previousCount) / previousCount) * 100;
    }
    
    stats.value.teams.history = [
      teamsCount,
      ...stats.value.teams.history.slice(0, 11)
    ].slice(0, 12);
  }

  if (trainers.value) {
    const trainersCount = trainers.value.length;
    stats.value.trainers.total = trainersCount;
    
    const previousCount = stats.value.trainers.history[0] || 0;
    if (previousCount > 0) {
      stats.value.trainers.growth = ((trainersCount - previousCount) / previousCount) * 100;
    }
    
    stats.value.trainers.history = [
      trainersCount,
      ...stats.value.trainers.history.slice(0, 11)
    ].slice(0, 12);
  }
});

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 50,
      fontFamily: `inherit`,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    colors: ['rgba(var(--v-theme-primary), var(--v-medium-opacity))'],
    stroke: {
      curve: 'smooth',
      width: 0
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };
});

const chartOptions2 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 50,
      fontFamily: `inherit`,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    colors: [warningColor],
    stroke: {
      curve: 'smooth',
      width: 0
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };
});

const chartOptions3 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 50,
      fontFamily: `inherit`,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    colors: [successColor],
    stroke: {
      curve: 'smooth',
      width: 0
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };
});

const chartOptions4 = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 50,
      fontFamily: `inherit`,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    colors: [errorColor],
    stroke: {
      curve: 'smooth',
      width: 0
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };
});

const barChart1 = computed(() => ({
  series: [
    {
      name: 'Participantes',
      data: stats.value.participants.history.length > 0 
        ? stats.value.participants.history 
        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
}));

const barChart2 = computed(() => ({
  series: [
    {
      name: 'Programas',
      data: stats.value.courses.history.length > 0 
        ? stats.value.courses.history 
        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
}));

const barChart3 = computed(() => ({
  series: [
    {
      name: 'Equipos',
      data: stats.value.teams.history.length > 0 
        ? stats.value.teams.history 
        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
}));

const barChart4 = computed(() => ({
  series: [
    {
      name: 'Entrenadores',
      data: stats.value.trainers.history.length > 0 
        ? stats.value.trainers.history 
        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
