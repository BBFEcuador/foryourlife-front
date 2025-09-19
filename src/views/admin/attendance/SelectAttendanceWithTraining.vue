<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useAttendanceByTraining from '@/composables/admin/attendances/useAttendancesByTraining';
import useAttendancesMutations from '@/composables/admin/attendances/useAttendancesMutations';
import useTrainings from '@/composables/admin/training/useTrainings';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { AttendanceStatus, DaysEnum, type Attendance, type UpdateDayAttendanceRequest } from '@/models/Attendance';
import type { TrainingData } from '@/models/Training';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { ref, onMounted, nextTick, computed, watch, reactive } from 'vue';
import { toast } from 'vue3-toastify';
import SwAlert from 'sweetalert2';

const ATTENDANCE_OPTIONS = [
  { title: 'Asistió', value: AttendanceStatus.ASISTIO },
  { title: 'No asistió', value: AttendanceStatus.NO_ASISTIO },
  { title: 'Desertó', value: AttendanceStatus.DESERTO }
] as const;

const TABLE_HEADERS = [
  { title: 'Participante', value: 'participant.name', width: '25%' },
  { title: 'Viernes', value: 'fridayAttendance', width: '25%' },
  { title: 'Sábado', value: 'saturdayAttendance', width: '25%' },
  { title: 'Domingo', value: 'sundayAttendance', width: '25%' }
] as const;

const breadcrumbs = ref([
  {
    title: 'Asistencias',
    disabled: false,
    href: '#'
  }
]);

// eslint-disable-next-line no-undef
const scrollContainer = ref<HTMLElement | null>(null);
const selectedTraining = ref<TrainingData | null>(null);

const { trainings, isTrainingError, isTrainingsLoading, debouncedSearch, loadMoreTrainings, hasMoreTrainings, isLoadingMore, retry } =
  useTrainings();
const { attendances, isAttendancesLoading, refetchAttendances } = useAttendanceByTraining(computed(() => selectedTraining.value?.id));
const { useUpdateDayAttendanceMutation, useCloseAttendanceMutation } = useAttendancesMutations();

const attendanceModels = reactive<
  Record<
    string,
    {
      friday?: AttendanceStatus;
      saturday?: AttendanceStatus;
      sunday?: AttendanceStatus;
    }
  >
>({});

watch(
  attendances,
  (newAttendances) => {
    if (newAttendances) {
      newAttendances.forEach((attendance: Attendance) => {
        if (!attendanceModels[attendance.id]) {
          attendanceModels[attendance.id] = {};
        }
        attendanceModels[attendance.id].friday = attendance.fridayAttendance;
        attendanceModels[attendance.id].saturday = attendance.saturdayAttendance;
        attendanceModels[attendance.id].sunday = attendance.sundayAttendance;
      });
    }
  },
  { deep: true, immediate: true }
);

const disableCloseAttendance = computed(() => attendances.value.filter((x) => x.isActive === true).length > 0);

const handleScroll = async () => {
  if (!scrollContainer.value || isLoadingMore.value || !hasMoreTrainings.value) {
    return;
  }

  const element = scrollContainer.value;
  const threshold = 100;

  if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
    await loadMoreTrainings();
  }
};

const updateDayAttendance = (status: AttendanceStatus, attendanceId: string, day: DaysEnum) => {
  if (!status || !attendanceId) return;

  const req: UpdateDayAttendanceRequest = {
    id: attendanceId,
    attendanceStatus: status,
    day: day
  };

  useUpdateDayAttendanceMutation.mutate(req, {
    onSuccess: async () => {
      refetchAttendances();
      toast.success('Asistencia actualizada correctamente');
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorApiResponse>;
      toast.error(err.response?.data?.message || 'Error al actualizar la asistencia');

      if (attendanceModels[attendanceId]) {
        const attendance = attendances.value?.find((a) => a.id === attendanceId);
        if (attendance) {
          switch (day) {
            case DaysEnum.FRIDAY:
              attendanceModels[attendanceId].friday = attendance.fridayAttendance;
              break;
            case DaysEnum.SATURDAY:
              attendanceModels[attendanceId].saturday = attendance.saturdayAttendance;
              break;
            case DaysEnum.SUNDAY:
              attendanceModels[attendanceId].sunday = attendance.sundayAttendance;
              break;
          }
        }
      }
    }
  });
};

const closeAttendance = () => {
  SwAlert.fire({
    title: 'Cerrar Asistencia de todo el entrenamiento',
    icon: 'warning',
    text: 'Las asistencias vacías se colocarán como inasistencia a los participantes, esto los ELIMINARA de su equipo',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      useCloseAttendanceMutation.mutate(selectedTraining.value?.id!!, {
        onSuccess: async () => {
          refetchAttendances();
          toast.success('Asistencia actualizada correctamente a todos los participantes');
        },
        onError: (error) => {
          const err = error as AxiosError<ErrorApiResponse>;
          toast.error(err.response?.data?.message || 'Error al actualizar la asistencia de los participantes');
        }
      });
    }
  });
};

const handleFridayChange = (value: AttendanceStatus, attendanceId: string) => {
  if (value !== AttendanceStatus.ASISTIO) {
    SwAlert.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      text: 'Vas a colocar inasistencia / deserción, esto ELIMINARA a la persona de su equipo',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        updateDayAttendance(value, attendanceId, DaysEnum.FRIDAY);
      }
    });
  } else {
    updateDayAttendance(value, attendanceId, DaysEnum.FRIDAY);
  }
};

const handleSaturdayChange = (value: AttendanceStatus, attendanceId: string) => {
  if (value !== AttendanceStatus.ASISTIO) {
    SwAlert.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      text: 'Vas a colocar inasistencia / deserción, esto ELIMINARA a la persona de su equipo',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        updateDayAttendance(value, attendanceId, DaysEnum.SATURDAY);
      }
    });
  } else {
    updateDayAttendance(value, attendanceId, DaysEnum.SATURDAY);
  }
};

const handleSundayChange = (value: AttendanceStatus, attendanceId: string) => {
  if (value !== AttendanceStatus.ASISTIO) {
    SwAlert.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      text: 'Vas a colocar inasistencia / deserción, esto ELIMINARA a la persona de su equipo',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        updateDayAttendance(value, attendanceId, DaysEnum.SUNDAY);
      }
    });
  } else {
    updateDayAttendance(value, attendanceId, DaysEnum.SUNDAY);
  }
};

const getRowClass = (item: Attendance) => ({
  'disabled-row': !item.isActive
});

onMounted(async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <div>
    <BaseBreadcrumb title="Asistencias" :breadcrumbs="breadcrumbs" />

    <div class="d-flex tw:flex-col tw:md:flex-row">
      <v-col cols="12" md="4">
        <v-card elevation="0" class="h-100">
          <v-card-title>
            <div class="tw:text-wrap">Seleccione un entrenamiento para continuar</div>
          </v-card-title>

          <v-card-item>
            <v-text-field
              v-model="debouncedSearch"
              class="pt-2"
              placeholder="Quito-101, Guayaquil-87, Cuenca-002 ..."
              label="Buscar entrenamiento"
              :loading="isTrainingsLoading"
              clearable
              variant="outlined"
              density="compact"
              hide-details="auto"
            >
              <template #prepend-inner>
                <Icon icon="mdi:magnify" />
              </template>
            </v-text-field>
          </v-card-item>

          <v-card-item>
            <div ref="scrollContainer" class="training-list-container" style="max-height: 275px; overflow-y: auto">
              <div v-if="isTrainingsLoading && trainings.length === 0" class="pa-4">
                <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-two-line" class="mb-2" />
              </div>

              <div v-else-if="trainings.length > 0">
                <v-list density="compact">
                  <v-list-item
                    v-for="training in trainings"
                    :key="training.id"
                    class="mb-1"
                    :class="{ 'v-list-item--active': selectedTraining?.id === training.id }"
                    @click="selectedTraining = training"
                  >
                    <v-list-item-title> {{ training.name }} {{ training.courseLevel }} </v-list-item-title>
                  </v-list-item>
                </v-list>

                <div v-if="isLoadingMore" class="text-center pa-4">
                  <v-progress-circular indeterminate size="24" />
                  <p class="text-caption mt-2">Cargando más entrenamientos...</p>
                </div>

                <div v-else-if="!hasMoreTrainings && trainings.length > 0" class="text-center pa-4">
                  <p class="text-caption text-medium-emphasis">No hay más entrenamientos</p>
                </div>
              </div>

              <div v-else-if="!isTrainingsLoading" class="text-center pa-4">
                <v-icon size="48" color="grey-lighten-1">mdi-magnify</v-icon>
                <p class="text-body-2 mt-2">No se encontraron entrenamientos</p>
              </div>

              <div v-if="isTrainingError" class="text-center pa-4">
                <v-icon size="48" color="error">mdi-alert-circle</v-icon>
                <p class="text-body-2 mt-2 text-error">Error al cargar entrenamientos</p>
                <v-btn size="small" color="error" variant="outlined" class="mt-2" @click="retry"> Reintentar </v-btn>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-alert
          v-if="!selectedTraining"
          class="d-flex justify-center"
          variant="tonal"
          type="warning"
          title="Seleccione un entrenamiento para ver las asistencias"
        >
          <template #prepend>
            <Icon icon="mdi-alert-outline" height="40" />
          </template>
        </v-alert>

        <v-card v-else class="d-flex flex-column tw:items-center h-100" elevation="0">
          <v-card-title class="d-flex align-center tw:w-full">
            <v-spacer></v-spacer>
            <Icon icon="mdi-account-group" class="mr-2" />
            <div>{{ selectedTraining.name }} {{ selectedTraining.courseLevel }}</div>
            <v-spacer></v-spacer>
            <v-btn v-if="disableCloseAttendance" variant="flat" color="warning" @click="closeAttendance">
              <Icon icon="mdi-close" />
              <span class="d-none d-sm-inline ml-2">Cerrar Asistencia</span>
            </v-btn>
          </v-card-title>

          <v-card-item>
            <v-data-table
              :items="attendances"
              :loading="isAttendancesLoading"
              :headers="TABLE_HEADERS"
              hide-default-footer
              density="comfortable"
              class="attendance-table"
            >
              <template #item="{ internalItem, item }">
                <v-data-table-row :item="internalItem" :class="getRowClass(item)">
                  <template #item.participant.name="{ item }">
                    <div class="d-flex align-center">
                      <v-tooltip v-if="!item.isActive" location="top">
                        <template #activator="{ props: activatorProps }">
                          <v-icon class="mr-2" color="warning" size="small" v-bind="activatorProps">
                            <Icon icon="mdi-information-outline" />
                          </v-icon>
                        </template>
                        <span>El participante no asistió un día y fue eliminado del equipo</span>
                      </v-tooltip>

                      <span :class="{ 'text-medium-emphasis': !item.isActive }">
                        {{ item.participant.name }}
                      </span>
                    </div>
                  </template>

                  <template #item.fridayAttendance="{ item }">
                    <v-select
                      v-model="attendanceModels[item.id].friday"
                      :items="ATTENDANCE_OPTIONS"
                      :disabled="!item.isActive"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="handleFridayChange($event, item.id)"
                    />
                  </template>

                  <template #item.saturdayAttendance="{ item }">
                    <v-select
                      v-model="attendanceModels[item.id].saturday"
                      :items="ATTENDANCE_OPTIONS"
                      :disabled="!item.isActive"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="handleSaturdayChange($event, item.id)"
                    />
                  </template>

                  <template #item.sundayAttendance="{ item }">
                    <v-select
                      v-model="attendanceModels[item.id].sunday"
                      :items="ATTENDANCE_OPTIONS"
                      :disabled="!item.isActive"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="handleSundayChange($event, item.id)"
                    />
                  </template>
                </v-data-table-row>
              </template>

              <template #no-data>
                <div class="text-center pa-4">
                  <v-icon size="48" color="grey-lighten-1">mdi-warning</v-icon>
                  <p class="text-body-2 mt-2">No hay participantes registrados</p>
                </div>
              </template>
            </v-data-table>
          </v-card-item>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<style scoped>
.training-list-container {
  scroll-behavior: smooth;
}

.training-list-container::-webkit-scrollbar {
  width: 6px;
}

.training-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.training-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.training-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.disabled-row {
  opacity: 0.6;
  background-color: rgba(0, 0, 0, 0.02);
}

.disabled-row .v-select {
  opacity: 0.7;
}

.attendance-table .v-data-table__td {
  padding: 8px 12px !important;
}

.attendance-table .v-select {
  min-width: 140px;
}

.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
