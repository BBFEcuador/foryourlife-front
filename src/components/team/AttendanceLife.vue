<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AttendanceDashboard } from '@/models/DashboardLife';
import { computed } from 'vue';

interface Props {
  data: AttendanceDashboard;
}
const props = defineProps<Props>();

// Formateador de porcentajes seguro
const fmtPct = (val: number | undefined | null) => {
  const safeValue = val ?? 0;
  return `${Number(safeValue).toFixed(2)} %`;
};
// Formateador de números (índices)
const fmtNum = (val: number | undefined | null) => (val ?? 0).toFixed(2);

// Agrupación de datos para la interfaz
const sections = computed(() => [
  {
    title: 'Inciales',
    icon: 'mdi:play-circle-outline',
    items: [
      { label: 'Participantes iniciales', val: props.data.totalParticipants, md: 6 },
      { label: 'Master Life iniciales', val: props.data.totalMasterParticipants, md: 6 },
      { label: 'Total inician', val: props.data.totalTotalUsers, bold: true, md: 12 }
    ]
  },
  {
    title: 'Finales',
    icon: 'mdi:flag-checkered',
    items: [
      { label: 'Participantes finales', val: props.data.participantAttendancesCount, md: 6 },
      { label: 'Master Life finales', val: props.data.masterAttendancesCount, md: 6 },
      { label: 'Total finalizan', val: props.data.totalAttendancesCount, bold: true, md: 12 }
    ]
  },
  {
    title: 'Deserción',
    icon: 'mdi:account-minus-outline',
    items: [
      { label: 'Personas deserción', val: props.data.deserterParticipantsCount, md: 12 },
      { label: '% Deserción', val: fmtPct(props.data.deserterParticipantsPercentage), isPct: true, md: 12, bold: true }
    ]
  },
  {
    title: 'Métricas de Enrolamiento',
    icon: 'mdi:chart-line',
    items: [
      { label: 'Enrolamiento Personas', val: props.data.participantEnrolledCount, md: 6 },
      { label: 'Enrolamiento Master', val: props.data.masterEnrolledCount, md: 6 },
      { label: 'Total enrolamiento', val: props.data.totalEnrollmentCount, bold: true, md: 12 },
      { label: 'Índice Enrol.', val: fmtNum(props.data.enrollmentIndex), md: 6 },
      { label: 'Índice Real', val: fmtNum(props.data.realEnrollmentIndex), md: 6 }
    ]
  },
  {
    title: 'Efectividad Focus',
    icon: 'mdi:target',
    items: [
      { label: 'Personas que enrolan', val: props.data.totalUsersEnrollersCount, md: 6 },
      { label: '% Personas enrolan', val: fmtPct(props.data.totalUsersEnrollersPercentage), isPct: true, md: 6 },
      { label: 'Llegan al Focus', val: props.data.totalFocusAttendancesCount, md: 12, bold: true },
      { label: 'Efectividad', val: fmtPct(props.data.enrollmentEffectiveness), isPct: true,  md: 12 }
    ]
  }
]);
</script>

<template>
  <v-row>
    <v-col
      v-for="(section, index) in sections"
      :key="index"
      cols="12"
      :md="section.items.length > 3 ? 12 : 4"
      :lg="section.items.length > 3 ? 6 : 4"
    >
      <v-card variant="flat" elevation="1" rounded="lg" class="h-100">
        <v-card-text class="pa-3">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center">
              <Icon :icon="section.icon" class="tw:text-indigo-600" height="20" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">{{ section.title }}</h4>
            </div>
          </div>
          <v-row>
            <v-col
              v-for="item in section.items"
              :key="item.label"
              :class="[item.bold ? 'tw:col-span-3 pa-2 tw:rounded-lg' : '']"
              class="tw:flex tw:flex-col"
              cols="12"
              :md="item.md"
            >
              <span class="text-medium-emphasis tw:text-center">{{ item.label }}</span>

              <div v-if="item.bold" class="d-flex align-center justify-center">
                <v-chip color="white" label class="text-primary font-weight-bold tw:text-2xl">
                  {{ item.val }}
                </v-chip>
              </div>

              <span v-else
                :class="[
                  item.bold ? 'tw:text-xl tw:text-slate-900' : 'tw:text-base tw:text-slate-700',
                ]"
                class="tw:text-center tw:font-bold tw:text-${section.color}-600"
              >
                {{ item.val }}
              </span>
              <!-- <span
                :class="[
                  item.bold ? 'tw:text-xl tw:text-slate-900' : 'tw:text-base tw:text-slate-700',
                  item.isPct ? `tw:font-bold tw:text-${section.color}-600` : 'tw:font-semibold'
                ]"
                class="tw:text-center"
              >
                {{ item.val }}
              </span> -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.dashboard-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.section-container {
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.1);
    border-color: #e2e8f0;
  }
}

// Clases de colores dinámicas para Tailwind (asegurar que existan)
.tw\:text-indigo-600 {
  color: #4f46e5;
}
.tw\:text-emerald-600 {
  color: #059669;
}
.tw\:text-rose-600 {
  color: #e11d48;
}
.tw\:text-amber-600 {
  color: #d97706;
}
.tw\:text-cyan-600 {
  color: #0891b2;
}

.tw\:bg-primary {
  background-color: #ece7f0;
}
</style>
