<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref, reactive, onMounted, watch } from 'vue';
import type { TrainingInfo, WeeklyPaymentStats,DailyPaymentStats  } from '@/models/DashboardOperativeAssistant';
import { CallStatusLabels, DayOfWeek, CallTypeLabels, DayOfWeekLabels } from '@/models/DashboardOperativeAssistant';

interface props {
  trainingInfo: TrainingInfo | null;
}
const props = defineProps<props>();

const participantRealPercentage = computed(() => {
  if (props.trainingInfo) {
    const total = props.trainingInfo.totalParticipants || 0;
    const real = props.trainingInfo.totalParticipantAssistants || 0;
    return total === 0 ? 0 : Math.round((real * 100) / total);
  }
  return 0;
});

const EnrolmentsRealPercentage = computed(() => {
  if (props.trainingInfo) {
    const total = props.trainingInfo.totalEnrolments || 0;
    const real = props.trainingInfo.totalEnrolmentsAssistants || 0;
    return total === 0 ? 0 : Math.round((real * 100) / total);
  }
  return 0;
});

const masterlifesRealPercentage = computed(() => {
  if (props.trainingInfo) {
    const total = props.trainingInfo.totalMasterLifes || 0;
    const real = props.trainingInfo.totalMasterLifesAssistants || 0;
    return total === 0 ? 0 : Math.round((real * 100) / total);
  }
  return 0;
});

const chartOptions = ref({
  chart: {
    type: 'radialBar',
    offsetY: -20,
    sparkline: { enabled: true }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: '#e7e7ef',
        strokeWidth: '97%',
        margin: 5
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '14px',
          offsetY: 30,
          fontWeight: 400
        },
        value: { offsetY: -2, fontSize: '22px' }
      }
    }
  },
  grid: {
    padding: { top: -10 }
  },
  fill: {
    type: '',
    colors: '#2ca87f'
  },
  labels: ['Real']
});

//Grafico e llamadas con grafico de barras apiladas
const seriesCalls = ref<any[]>([]);
const chartCallsOptions = ref({
  chart: {
    type: 'bar',
    stacked: true,
    height: 350,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true, // Barras horizontales
      dataLabels: {
        total: {
          enabled: true, // Muestra la suma total al final de la barra
          offsetX: 0,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        },
        style: {
          // Color de las etiquetas individuales (si habilitadas)
          fontSize: '14px',
          fontWeight: 400
        }
      }
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: [] as string[],
    labels: {
      show: true,
      style: {
        colors: '#4B5563',
        fontSize: '14px',
        fontWeight: 400
      }
    }
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '14px',
        fontWeight: 400
      }
    }
  },
  fill: {
    opacity: 1,
    colors: ['#663c84', '#2ca87f', '#FEB019'] // Colores para los 3 estados
  },
  legend: {
    position: 'top' as const,
    horizontalAlign: 'left' as const,
    offsetX: 40,
    fontSize: '14px',
    fontWeight: 400
  },
  tooltip: {
    y: {
      formatter: (val: number) => val.toString()
    }
  }
});

const updateChartData = () => {
  const callsInfoList: any[] | undefined = props.trainingInfo?.callsInfoList;

  if (!callsInfoList || callsInfoList.length === 0) {
    seriesCalls.value = [];
    chartCallsOptions.value.xaxis.categories = [];
    return;
  }
  // const statusNames: string[] = Array.from(new Set(callsInfoList.flatMap((item: any) => item.statuses.map((s: any) => s.status))));
  const statusNames: string[] = Object.values(CallStatusLabels);
  // const categories: string[] = callsInfoList.map((item: any) => item.callType);
  const categories: string[] = callsInfoList.map((item: any) =>
    item.callType in CallTypeLabels ? CallTypeLabels[item.callType as keyof typeof CallTypeLabels] : item.callType
  );

  const dataByStatus: Record<string, number[]> = {};

  statusNames.forEach((statusName) => {
    dataByStatus[statusName] = [];
  });

  callsInfoList.forEach((callTypeInfo: any) => {
    statusNames.forEach((statusName) => {
      const statusData = callTypeInfo.statuses.find((s: any) => s.status === statusName);
      const totalCalls = statusData ? statusData.totalCalls : 0;
      dataByStatus[statusName].push(totalCalls);
    });
  });
  const newSeries: any[] = statusNames.map((statusName) => ({
    name: statusName,
    data: dataByStatus[statusName]
  }));

  seriesCalls.value = newSeries;
  chartCallsOptions.value.xaxis.categories = categories;
};

watch(
  () => props.trainingInfo,
  () => {
    updateChartData();
  },
  { immediate: true, deep: true }
);

// Tabla de pagos
const weeklyPaymentList = computed<WeeklyPaymentStats[]>(() => {
  return props.trainingInfo?.weeklyPaymentStatsList || [];
});

// const trainingItems = computed(() => data.value?.trainingInfo ?? []);
const tab = ref(weeklyPaymentList.value?.[0]?.weekNumber ?? null);

// const days

const headers = computed(() => {
  const week = weeklyPaymentList.value[0]; // toma la primera semana como base
  if (!week) return [];

  // forzamos que sean claves de DayOfWeek
  const days = Object.keys(week.statsPerDay) as (keyof typeof week.statsPerDay)[];

  return [
    { title: 'Métrica', key: 'metric' },
    ...days.map(d => ({
      title: DayOfWeekLabels[d],
      key: d
    }))
  ];
});

const tableRows = computed(() => {
  const week = weeklyPaymentList.value[0];
  if (!week) return [];

  const days = Object.keys(week.statsPerDay) as (keyof typeof week.statsPerDay)[];

  // declaramos los posibles nombres de métricas como keyof DailyPaymentStats
  const metrics: (keyof DailyPaymentStats)[] = [
    "participantsFinal",
    "yourCount",
    "yourLifeCount",
    "totalPayments",
    "partialPayments",
    "passPercent",
    "projectedPercent"
  ];

  return metrics.map(metric => {
    const row: Record<string, any> = { metric };

    days.forEach(day => {
      // TypeScript ahora sabe que day es key de statsPerDay y metric es key de DailyPaymentStats
      row[day] = week.statsPerDay[day][metric] ?? '-';
    });
    console.log('Generated row:', row);
    return row;
  });
});

console.log('LifeSummary - trainingInfo:',tableRows.value);
</script>

<template>
  <v-divider class="mb-4" />
  <VRow class="tw-gap-4 mb-2">
    <!-- Columna izquierda -->
    <VCol cols="4" class="tw-flex tw-flex-col tw-gap-4">
      <v-card rounded="lg">
        <v-list lines="one" rounded="lg">
          <v-list-item :title="trainingInfo?.trainerName" subtitle="Entrenador Responsable">
            <template v-slot:prepend>
              <v-avatar variant="text" color="primary">
                <Icon icon="mdi-school" height="25" />
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </VCol>
  </VRow>
  <VRow class="tw-gap-0">
    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:append>
                <v-avatar variant="text" color="primary">
                  <Icon icon="mdi:account-group" height="25" />
                </v-avatar>
              </template>
              <h6 class="w:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Total Participantes</h6>
            </v-list-item>
          </v-list>
          <div class="text-h4 font-weight-bold text-center">
            {{ trainingInfo?.totalParticipants || 0 }}
          </div>
        </v-card-text>
      </v-card>
    </VCol>
    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:append>
                <v-avatar variant="text" color="primary">
                  <Icon icon="mdi:account-plus" height="25" />
                </v-avatar>
              </template>
              <h6 class="w:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Total Inscripciones</h6>
            </v-list-item>
          </v-list>
          <div class="text-h4 font-weight-bold text-center">
            {{ trainingInfo?.totalEnrolments || 0 }}
          </div>
        </v-card-text>
      </v-card>
    </VCol>
    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:append>
                <v-avatar variant="text" color="primary">
                  <Icon icon="mdi:account-tie" height="25" />
                </v-avatar>
              </template>
              <h6 class="w:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Total Master Lifes</h6>
            </v-list-item>
          </v-list>
          <div class="text-h4 font-weight-bold text-center">
            {{ trainingInfo?.totalMasterLifes || 0 }}
          </div>
        </v-card-text>
      </v-card>
    </VCol>
  </VRow>

  <VRow class="tw-gap-0">
    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
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
          <div class="text-h4 font-weight-bold text-center mt-3">
            <div class="d-flex justify-space-between mb-2">
              <p class="text-body-1 mb-0">Inicio</p>
              <p class="text-body-1 mb-0 tw:font-stretch-105%">{{ trainingInfo?.totalParticipants || 0 }}</p>
            </div>
            <v-progress-linear
              aria-label="progressbar"
              rounded
              color="primary"
              :model-value="props.trainingInfo && props.trainingInfo?.totalParticipants > 0 ? 100 : 0"
              height="12"
            ></v-progress-linear>
          </div>
          <div class="text-h4 font-weight-bold text-center mt-3">
            <div class="d-flex justify-space-between mb-2">
              <p class="text-body-1 mb-0">Real</p>
              <p class="text-body-1 mb-0">{{ trainingInfo?.totalParticipantAssistants || 0 }}</p>
            </div>
            <v-progress-linear
              aria-label="progressbar"
              rounded
              color="success"
              :model-value="participantRealPercentage"
              height="12"
            ></v-progress-linear>
          </div>
          <div class="text-center mt-6">
            <p class="text-body-1 mb-0">Declaración</p>
            <p class="text-body-1 mb-0">
              <v-chip color="secondary" style="font-weight: 600">{{ trainingInfo?.totalParticipantsDeclarations }}</v-chip>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </VCol>

    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="primary" rounded="md">
                  <Icon icon="mdi:account-tie" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Master Lifes</h6>
            </v-list-item>
          </v-list>
          <div class="text-h4 font-weight-bold text-center">
            <apexchart type="radialBar" height="200" :options="chartOptions" :series="[masterlifesRealPercentage]"></apexchart>
          </div>
          <VRow class="tw-gap-0 text-center">
            <VCol cols="6" class="p-0">
              <p class="text-body-1 mb-0">Inicio</p>
              <p class="text-body-1 mb-0">
                <v-chip color="primary" style="font-weight: 600">{{ trainingInfo?.totalMasterLifes || 0 }}</v-chip>
              </p>
            </VCol>
            <VCol cols="6" class="p-0">
              <p class="text-body-1 mb-0">Declaración</p>
              <p class="text-body-1 mb-0">
                <v-chip color="secondary" style="font-weight: 600">{{ trainingInfo?.totalMasterLifesDeclarations || 0 }}</v-chip>
              </p>
            </VCol>
          </VRow>
        </v-card-text>
      </v-card>
    </VCol>

    <VCol cols="12" md="4" sm="4" class="p-0">
      <v-card rounded="lg">
        <v-card-text class="pa-5">
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="primary" rounded="md">
                  <Icon icon="mdi:account-multiple-check" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Enrolados</h6>
            </v-list-item>
          </v-list>
          <div class="text-h4 font-weight-bold text-center mt-3">
            <div class="d-flex justify-space-between mb-2">
              <p class="text-body-1 mb-0">Inicio</p>
              <p class="text-body-1 mb-0 tw:font-stretch-105%">{{ trainingInfo?.totalEnrolments || 0 }}</p>
            </div>
            <v-progress-linear
              aria-label="progressbar"
              rounded
              color="primary"
              :model-value="props.trainingInfo && props.trainingInfo.totalEnrolments > 0 ? 100 : 0"
              height="12"
            ></v-progress-linear>
          </div>
          <div class="text-h4 font-weight-bold text-center mt-3">
            <div class="d-flex justify-space-between mb-2">
              <p class="text-body-1 mb-0">Real</p>
              <p class="text-body-1 mb-0">{{ trainingInfo?.totalEnrolmentsAssistants || 0 }}</p>
            </div>
            <v-progress-linear
              aria-label="progressbar"
              rounded
              color="success"
              :model-value="EnrolmentsRealPercentage"
              height="12"
            ></v-progress-linear>
          </div>
          <div class="text-center mt-6">
            <p class="text-body-1 mb-0">Declaración</p>
            <p class="text-body-1 mb-0">
              <v-chip color="secondary" style="font-weight: 600">{{ trainingInfo?.totalEnrolmentsDeclarations }}</v-chip>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <v-card rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="primary" rounded="md">
                  <Icon icon="mdi:phone" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Regístro de Llamadas</h6>
            </v-list-item>
          </v-list>
          <apexchart type="bar" height="350" :options="chartCallsOptions" :series="seriesCalls"></apexchart>
        </v-card-text>
      </v-card>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <v-card rounded="lg">
        <v-card-text>
          <v-list class="pt-0" aria-busy="true" aria-label="chart content">
            <v-list-item class="pa-0">
              <template v-slot:prepend>
                <v-avatar variant="tonal" color="primary" rounded="md">
                  <Icon icon="mdi:currency-usd" />
                </v-avatar>
              </template>
              <h6 class="text-subtitle-1 mb-0">Seguimiento de Pagos</h6>
            </v-list-item>
          </v-list>
          <!-- tabla de pagos -->
          <div class="d-flex flex-row">
            <v-tabs v-model="tab" color="primary" direction="vertical">
              <v-tab
                v-for="(item, index) in weeklyPaymentList"
                :key="item.weekNumber"
                prepend-icon="mdi-account"
                :text="`Semana ${item.weekNumber}`"
                :value="item.weekNumber"
              ></v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item v-for="(item, index) in weeklyPaymentList" :key="item.weekNumber" :value="item.weekNumber">
                <v-card flat>
                  <v-card-text>
                    <VDataTable :headers="headers" :items="tableRows" class="mt-4"></VDataTable>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-card-text>
      </v-card>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped></style>
