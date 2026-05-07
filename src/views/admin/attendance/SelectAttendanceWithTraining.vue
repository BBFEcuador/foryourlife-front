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
import PromiseList from '@/components/promise/PromiseList.vue';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import { fa } from 'vuetify/locale';

const ATTENDANCE_OPTIONS_FRIDAY = [
  { title: 'Asistió', value: AttendanceStatus.ASISTIO },
  { title: 'No asistió', value: AttendanceStatus.NO_ASISTIO }
] as const;

const ATTENDANCE_OPTIONS = [
  { title: 'Asistió', value: AttendanceStatus.ASISTIO },
  { title: 'Desertó', value: AttendanceStatus.DESERTO }
] as const;

// const ATTENDANCE_OPTIONS = [
//   { title: 'Asistió', value: AttendanceStatus.ASISTIO },
//   { title: 'No asistió', value: AttendanceStatus.NO_ASISTIO },
//   { title: 'Desertó', value: AttendanceStatus.DESERTO }
// ] as const;

const TABLE_HEADERS = [
  { title: 'Participante', value: 'participant.user.name', width: '40%', sortable: false },
  { title: 'Viernes', value: 'fridayAttendance' },
  { title: 'Sábado', value: 'saturdayAttendance' },
  { title: 'Domingo', value: 'sundayAttendance' }
];

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
const switchPromises = ref(false);
const searchAttendance = ref('');
const searchAttendanceParticipant = ref('');

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
    text: 'Las asistencias vacías se colocarán como ASISTIO a los participantes, esto seguro de continuar',
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

const switchViews = () => {
  switchPromises.value = !switchPromises.value;
};

onMounted(async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});

// const masterLifeAttendance = computed(() => attendances.value?.filter((p) => p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')) || []);

// const participantAttendance = computed(
//   () =>
//     attendances.value?.filter(
//       (p) => p.user?.entityMap?.some((e) => e.entity === 'PARTICIPANT') && !p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')
//     ) || []
// );

const masterLifeAttendanceList = ref<Attendance[]>([]);
const participantAttendanceList = ref<Attendance[]>([]);

watch(selectedTraining, async (newTraining) => {
  if (!newTraining) return;
  await nextTick();
  await refetchAttendances();

  masterLifeAttendanceList.value = attendances.value?.filter((p) => p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')) || [];

  participantAttendanceList.value =
    attendances.value?.filter(
      (p) => p.user?.entityMap?.some((e) => e.entity === 'PARTICIPANT') && !p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')
    ) || [];
});

const filteredMasterLifeAttendanceList = computed(() => {
  if (!searchAttendance.value) return masterLifeAttendanceList.value;

  const term = searchAttendance.value.toLowerCase().trim();

  return masterLifeAttendanceList.value.filter((a) => a?.user?.name?.toLowerCase().includes(term));
});

const filteredParticipantAttendanceList = computed(() => {
  if (!searchAttendanceParticipant.value) return participantAttendanceList.value;

  const term = searchAttendanceParticipant.value.toLowerCase().trim();

  return participantAttendanceList.value.filter((a) => a?.user?.name?.toLowerCase().includes(term));
});

const tooltipText = (item: Attendance) => {
  const model = attendanceModels[item.id];
  if (!model) return 'Pendiente';

  if (!item.isActive && model.friday === AttendanceStatus.NO_ASISTIO) return 'No asistió';
  if (
    (!item.isActive && model.friday === AttendanceStatus.DESERTO) ||
    model.saturday === AttendanceStatus.DESERTO ||
    model.sunday === AttendanceStatus.DESERTO
  )
    return 'Desertó';
  if (
    item.isActive &&
    model.friday === AttendanceStatus.ASISTIO &&
    model.saturday === AttendanceStatus.ASISTIO &&
    model.sunday === AttendanceStatus.ASISTIO
  )
    return 'Asistió';

  return 'Pendiente';
};

const chipColor = (item: Attendance) => {
  const model = attendanceModels[item.id];
  if (!model) return 'default';
  if (!item.isActive && model.friday === AttendanceStatus.NO_ASISTIO) return 'warning';
  if (
    (!item.isActive && model.friday === AttendanceStatus.DESERTO) ||
    model.saturday === AttendanceStatus.DESERTO ||
    model.sunday === AttendanceStatus.DESERTO
  )
    return 'error';
  if (
    item.isActive &&
    model.friday === AttendanceStatus.ASISTIO &&
    model.saturday === AttendanceStatus.ASISTIO &&
    model.sunday === AttendanceStatus.ASISTIO
  )
    return 'success';
  return 'default';
};

const badgeColor = (item: Attendance): string | undefined => {
  const model = attendanceModels[item.id];
  if (!model) return undefined;

  if (!item.isActive && model.friday === AttendanceStatus.NO_ASISTIO) return 'warning';
  if (
    (!item.isActive && model.friday === AttendanceStatus.DESERTO) ||
    model.saturday === AttendanceStatus.DESERTO ||
    model.sunday === AttendanceStatus.DESERTO
  )
    return 'error';
  if (
    item.isActive &&
    model.friday === AttendanceStatus.ASISTIO &&
    model.saturday === AttendanceStatus.ASISTIO &&
    model.sunday === AttendanceStatus.ASISTIO
  )
    return 'success';

  return undefined; // <-- aquí ya no es null
};
</script>

<template>
  <div>
    <BaseBreadcrumb title="Asistencias" :breadcrumbs="breadcrumbs" />
    <div v-if="checkPermission(PermissionEnum.SEE_ATTENDANCES_DECLARATIONS)">
      <div class="d-flex tw:flex-col tw:md:flex-row tw:gap-4">
        <div class="tw:w-full tw:lg:w-1/3 tw:p-4">
          <v-card elevation="0" class="h-100">
            <v-card-title>
              <div class="d-flex tw:items-center">
                <Icon icon="mdi-teach" class="mr-2" />
                <div>Entrenamientos</div>
              </div>
              <v-divider></v-divider>
            </v-card-title>
            <v-card-item class="mt-0 pt-2 pb-2">
              <label class="tw-whitespace-normal tw-block">Seleccione un entrenamiento para continuar</label>

              <v-text-field
                v-model="debouncedSearch"
                class="pt-3"
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
                      <v-list-item-title> {{ training.name }} {{ training.courseLevelDisplay }} </v-list-item-title>
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
                  <v-icon size="48" color="grey-lighten-1">
                    <Icon icon="mdi-magnify" />
                  </v-icon>
                  <p class="text-body-2 mt-2">No se encontraron entrenamientos</p>
                </div>

                <div v-if="isTrainingError" class="text-center pa-4">
                  <v-icon size="48" color="error">
                    <Icon icon="mdi-alert-circle" />
                  </v-icon>
                  <p class="text-body-2 mt-2 text-error">Error al cargar entrenamientos</p>
                  <v-btn size="small" color="error" variant="outlined" class="mt-2" @click="retry"> Reintentar </v-btn>
                </div>
              </div>
            </v-card-item>
          </v-card>
        </div>
        <div class="tw:w-full tw:lg:w-2/3 tw:p-4">
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
            <v-card-title class="d-flex align-center tw:w-full tw:flex-wrap">
              <div class="d-flex tw:flex-col">
                <div>{{ switchPromises ? 'Declaraciones' : 'Asistencias' }}</div>
                <div class="d-flex tw:items-center tw:justify-center">
                  <Icon icon="mdi-account-group" class="mr-2" />
                  <div>{{ selectedTraining.name }} {{ selectedTraining.courseLevel }}</div>
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                v-if="disableCloseAttendance && !switchPromises && checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
                variant="flat"
                class="mr-2"
                color="warning"
                @click="closeAttendance"
              >
                <Icon icon="mdi-close" />
                <span class="d-none d-sm-inline ml-2">Cerrar Asistencia</span>
              </v-btn>
              <VBtn
                v-if="selectedTraining.courseLevel !== 'FOCUS' && selectedTraining.courseLevel !== 'YOUR'"
                variant="flat"
                :color="switchPromises ? 'success' : 'info'"
                @click="switchViews"
              >
                <Icon :icon="switchPromises ? 'material-symbols:event-available' : 'streamline-flex:link-chain-solid'" />
                <span class="d-none d-sm-inline ml-2">{{ !switchPromises ? 'Declaraciones' : 'Asistencias' }}</span>
              </VBtn>
              <v-divider></v-divider>
            </v-card-title>

            <v-card-item class="tw:w-full">
              <PromiseList v-if="switchPromises" :trainingId="selectedTraining.id" />
              <div v-else>
                <div v-if="selectedTraining?.courseLevel?.includes('LIFE')">
                  <h3 class="text-h6 mb-3 text-primary">Usuarios MASTER LIFE</h3>
                  <v-data-table
                    :items="filteredMasterLifeAttendanceList"
                    :loading="isAttendancesLoading"
                    :headers="TABLE_HEADERS"
                    density="comfortable"
                    class="modern-table"
                  >
                    <template v-slot:top>
                      <v-toolbar
                        class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
                        flat
                        v-motion
                        :initial="{ opacity: 0, y: -10 }"
                        :enter="{ opacity: 1, y: 0 }"
                        :delay="200"
                        :duration="250"
                      >
                        <VTextField
                          v-model="searchAttendance"
                          placeholder="Buscar usuarios Master Life..."
                          variant="outlined"
                          density="compact"
                          class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                          clearable
                          hide-details
                        >
                          <template #prepend-inner>
                            <div class="tw:relative">
                              <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                              <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                            </div>
                          </template>
                        </VTextField>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template #item.participant.user.name="{ item }">
                      <div class="d-flex align-center">
                        <v-tooltip
                          v-if="
                            !item.isActive &&
                            item.fridayAttendance !== AttendanceStatus.ASISTIO &&
                            item.saturdayAttendance !== AttendanceStatus.ASISTIO &&
                            item.sundayAttendance !== AttendanceStatus.ASISTIO
                          "
                          location="top"
                        >
                          <template #activator="{ props: activatorProps }">
                            <v-icon class="mr-2" color="warning" size="small" v-bind="activatorProps">
                              <Icon icon="mdi-information-outline" />
                            </v-icon>
                          </template>
                          <span>El participante no asistió un día y fue eliminado del equipo</span>
                        </v-tooltip>

                        <span :class="{ 'text-medium-emphasis': !item.isActive }">
                          {{ item.user.name }}
                        </span>
                      </div>
                    </template>

                    <template #item.fridayAttendance="{ item }">
                      <v-select
                        v-model="attendanceModels[item.id].friday"
                        :items="ATTENDANCE_OPTIONS_FRIDAY"
                        :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
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
                        :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
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
                        :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
                        density="compact"
                        variant="outlined"
                        hide-details
                        @update:model-value="handleSundayChange($event, item.id)"
                      />
                    </template>

                    <template #no-data>
                      <div class="text-center pa-4">
                        <v-icon size="48" color="grey-lighten-1">
                          <Icon icon="mdi-alert-outline" />
                        </v-icon>
                        <div v-if="searchAttendance">
                          <p class="text-body-3 mt-2">No se encontraron usuarios</p>
                          <p class="text-body-2 mt-1">Intenta con otros términos de búsqueda</p>
                        </div>
                        <div v-else>
                          <p class="text-body-2 mt-2">No hay usuarios registrados</p>
                        </div>
                      </div>
                    </template>
                  </v-data-table>
                  <v-divider class="my-6" />
                </div>

                <h3 class="text-h6 mb-3 text-success">Usuarios PARTICIPANTES</h3>
                <v-data-table
                  :items="filteredParticipantAttendanceList"
                  :loading="isAttendancesLoading"
                  :headers="TABLE_HEADERS"
                  density="comfortable"
                  class="modern-table"
                >
                  <template v-slot:top>
                    <v-toolbar
                      class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
                      flat
                      v-motion
                      :initial="{ opacity: 0, y: -10 }"
                      :enter="{ opacity: 1, y: 0 }"
                      :delay="200"
                      :duration="250"
                    >
                      <VTextField
                        v-model="searchAttendanceParticipant"
                        placeholder="Buscar usuarios Participantes..."
                        variant="outlined"
                        density="compact"
                        class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                        clearable
                        hide-details
                      >
                        <template #prepend-inner>
                          <div class="tw:relative">
                            <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                            <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                          </div>
                        </template>
                      </VTextField>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                  </template>
                  <template #item.participant.user.name="{ item }">
                    <div class="d-inline-flex align-center gap-2">
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-chip
                            v-bind="props"
                            :color="chipColor(item)"
                            size="x-small"
                            variant="tonal"
                            height="20"
                            width="20"
                            rounded="circle"
                            class="mr-2 d-flex align-center justify-center"
                          >
                            <v-badge v-if="badgeColor(item)" dot :color="badgeColor(item)" inline />
                            <Icon v-else icon="mdi-minus" size="16" />
                          </v-chip>
                        </template>
                        <span>{{ tooltipText(item) }}</span>
                      </v-tooltip>

                      <span :class="{ 'text-medium-emphasis': !item.isActive }">
                        {{ item.user.name }}
                      </span>
                    </div>
                  </template>

                  <template #item.fridayAttendance="{ item }">
                    <v-select
                      v-model="attendanceModels[item.id].friday"
                      :items="ATTENDANCE_OPTIONS_FRIDAY"
                      :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
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
                      :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
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
                      :disabled="!item.isActive || !checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="handleSundayChange($event, item.id)"
                    />
                  </template>

                  <template #no-data>
                    <div class="text-center pa-4">
                      <v-icon size="48" color="grey-lighten-1">
                        <Icon icon="mdi-alert-outline" />
                      </v-icon>
                      <div v-if="searchAttendance">
                        <p class="text-body-3 mt-2">No se encontraron usuarios</p>
                        <p class="text-body-2 mt-1">Intenta con otros términos de búsqueda</p>
                      </div>
                      <div v-else>
                        <p class="text-body-2 mt-2">No hay usuarios registrados</p>
                      </div>
                    </div>
                  </template>
                </v-data-table>
              </div>
            </v-card-item>
          </v-card>
        </div>
      </div>
    </div>
    <div v-else>
      <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
        <template #prepend>
          <Icon color="warning" icon="mdi-alert" height="30" />
        </template>
        No tienes permiso para ver esta sección.
      </v-alert>
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

.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.modern-table {
  thead {
    background: linear-gradient(to bottom, #f9fafb, #f3f4f6) !important;
  }
}
</style>
