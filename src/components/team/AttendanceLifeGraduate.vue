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
      { label: 'Personas deserción', val: props.data.deserterParticipantsCount, md: 6 },
      { label: '% Deserción', val: fmtPct(props.data.deserterParticipantsPercentage), isPct: true, md: 6, bold: true }
    ]
  }
]);
</script>

<template>
  <VRow>
    <VCol cols="12" md="5">
      <v-card variant="flat" elevation="1" rounded="lg" class="mb-4">
        <v-card-text class="pa-3">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-account-arrow-right" height="20" class="tw:text-cyan-600" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Asistencia a Focus</h4>
              <p class="tw:text-sm tw:text-gray-500">Personas que declaran asistir y su porcentaje</p>
            </div>
          </div>
          <div class="pa-1 d-flex align-center justify-center text-center">
            <v-progress-circular :model-value="props?.data?.focusDeclarationPercentage" :size="170" :width="12" color="primary">
              <div class="text-center">
                <span class="text-16 font-weight-black d-block">
                  {{ props?.data?.focusDeclarationPercentage?.toFixed(2) }}<span class="text-h5">%</span>
                </span>
                <span class="text-primary font-weight-medium">Declarado</span>
              </div>
            </v-progress-circular>
            <v-divider vertical class="mx-6" />
            <div>
              <span class="tw:font-bold text-16">
                {{ props?.data?.focusDeclarationsCount }}
              </span>
              <div class="text-medium-emphasis">Personas que declaran ir a Focus</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card variant="flat" elevation="1" rounded="lg">
        <v-card-text class="pa-3">
          <div class="tw:flex tw:items-center tw:gap-3 mb-3">
            <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-cyan-50 tw:flex tw:items-center tw:justify-center">
              <Icon icon="mdi-account-switch" height="20" class="tw:text-cyan-600" />
            </div>
            <div>
              <h4 class="tw:text-sm tw:font-semibold tw:text-gray-700 tw:uppercase tw:tracking-wide">Llegadas desde Staff</h4>
              <p class="tw:text-sm tw:text-gray-500">Personas y % de efectividad de declaración</p>
            </div>
          </div>
          <div class="pa-1 d-flex align-center justify-center text-center">
            <v-progress-circular :model-value="props?.data?.staffMembersPercentage" :size="170" :width="12" color="primary">
              <div class="text-center">
                <span class="text-16 font-weight-black d-block">
                  {{ props?.data?.staffMembersPercentage?.toFixed(2) }}<span class="text-h5">%</span>
                </span>
                <span class="text-primary font-weight-medium">Efectividad</span>
              </div>
            </v-progress-circular>
            <v-divider vertical class="mx-6" />
            <div>
              <span class="tw:font-bold text-16">
                {{ props?.data?.staffMembersCount }}
              </span>
              <div class="text-medium-emphasis">Personas que llegan de staff</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </VCol>
    <VCol cols="12" md="7">
      <v-card variant="flat" elevation="1" rounded="lg" v-for="(section, index) in sections" :key="index" class="mb-4">
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
                <v-chip color="white" label class="text-primary font-weight-bold text-16">
                  {{ item.val }}
                </v-chip>
              </div>
              <span v-else class="tw:text-center tw:font-bold text-16">
                {{ item.val }}
              </span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.text-16 {
  font-size: 16px !important;
}
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
