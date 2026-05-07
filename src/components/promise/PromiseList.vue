<script setup lang="ts">
import usePromises from '@/composables/admin/promise/usePromises';
import usePromisesMutations from '@/composables/admin/promise/usePromisesMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { DaysEnum } from '@/models/Attendance';
import type { PromiseRequest, Promises } from '@/models/Promises';
import type { AxiosError } from 'axios';
import { computed, reactive, watch, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import { fa } from 'vuetify/locale';

const props = defineProps<{
  trainingId: string;
}>();

const searchPromise = ref('');
const searchPromiseParticipant = ref(''); 

const TABLE_HEADERS = [
  { title: 'Participante', value: 'user.name', sortable: false },
  { title: 'Viernes', value: 'fridayPromise', sortable: false },
  { title: 'Sábado', value: 'saturdayPromise', sortable: false },
  { title: 'Domingo', value: 'sundayPromise', sortable: false },
  { title: 'Personas registradas', value: 'achievedCount', sortable: false },
  { title: 'Compras realizadas', value: 'paidCount', sortable: false },
  { title: 'Fecha de Fin', value: 'endDate', sortable: false }
];

const { promises, isPromisesLoading, refetchPromises } = usePromises(computed(() => props.trainingId));
const { useSavePromiseMutation } = usePromisesMutations();

const promiseModels = reactive<
  Record<
    string,
    {
      first?: number;
      second?: number;
      third?: number;
    }
  >
>({});

watch(
  promises,
  (newPromises) => {
    if (newPromises) {
        newPromises.forEach((promise: Promises) => {
        if (!promiseModels[promise.id]) {
          promiseModels[promise.id] = {};
        }
        promiseModels[promise.id].first = promise.firstPromise;
        promiseModels[promise.id].second = promise.secondPromise;
        promiseModels[promise.id].third = promise.thirdPromise;
      });
    }
  },
  { deep: true, immediate: true }
);

const masterLifePromises = computed(() => promises.value?.filter((p) => p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')) || []);

const participantPromises = computed(
  () =>
    promises.value?.filter(
      (p) => p.user?.entityMap?.some((e) => e.entity === 'PARTICIPANT') && !p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')
    ) || []
);

const handlePromiseChange = (promiseId: string, day: 'first' | 'second' | 'third') => {
  const req: PromiseRequest = {
    id: promiseId,
    promise:
      day === 'first'
        ? promiseModels[promiseId].first || 0
        : day === 'second'
          ? promiseModels[promiseId].second || 0
          : promiseModels[promiseId].third || 0,
    day: day === 'first' ? DaysEnum.FRIDAY : day === 'second' ? DaysEnum.SATURDAY : DaysEnum.SUNDAY
  };

  useSavePromiseMutation.mutate(req, {
    onSuccess: async () => {
      refetchPromises();
      toast.success('Declaración actualizada correctamente');
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorApiResponse>;
      toast.error(err.response?.data?.message || 'Error al actualizar la declaracion');

      if (promiseModels[promiseId]) {
        const promise = promises.value?.find((a) => a.id === promiseId);
        if (promise) {
          switch (day) {
            case 'first':
              promiseModels[promiseId].first = promise.firstPromise;
              break;
            case 'second':
              promiseModels[promiseId].second = promise.secondPromise;
              break;
            case 'third':
              promiseModels[promiseId].third = promise.thirdPromise;
              break;
          }
        }
      }
    }
  });
};
</script>

<template>
  <div class="pa-4">
    <!-- 🔹 Tabla MASTER LIFE -->
    <h3 class="text-h6 mb-3 text-primary">Usuarios MASTER LIFE</h3>
    <v-data-table
      :items="masterLifePromises"
      :loading="isPromisesLoading"
      :headers="TABLE_HEADERS"
      :search="searchPromise"
      hide-default-footer
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
            v-model="searchPromise"
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
          <span>{{ item.user.name }}</span>
        </div>
      </template>

      <template #item.fridayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].first"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'first')"
        />
      </template>

      <template #item.saturdayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].second"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'second')"
        />
      </template>

      <template #item.sundayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].third"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'third')"
        />
      </template>

      <template #no-data>
        <div class="text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">
            <Icon icon="mdi-alert-outline" />
          </v-icon>
          <div v-if="!searchPromise">
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

    <!-- 🔹 Tabla PARTICIPANT -->
    <h3 class="text-h6 mb-3 text-success">Usuarios PARTICIPANTES</h3>
    <v-data-table
      :items="participantPromises"
      :loading="isPromisesLoading"
      :headers="TABLE_HEADERS"
      :search="searchPromiseParticipant"
      hide-default-footer
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
            v-model="searchPromiseParticipant"
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
          <span>{{ item.user.name }}</span>
        </div>
      </template>

      <template #item.fridayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].first"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'first')"
        />
      </template>

      <template #item.saturdayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].second"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'second')"
        />
      </template>

      <template #item.sundayPromise="{ item }">
        <v-text-field
          v-model="promiseModels[item.id].third"
          density="compact"
          variant="outlined"
          hide-spin-buttons
          :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
          :disabled="!checkPermission(PermissionEnum.UPDATE_ATTENDANCES_DECLARATIONS)"
          @update:model-value="handlePromiseChange(item.id, 'third')"
        />
      </template>
      <template #no-data>
        <div class="text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">
            <Icon icon="mdi-alert-outline" />
          </v-icon>
          <div v-if="searchPromiseParticipant">
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
</template>

<style>
.modern-table {
  thead {
    background: linear-gradient(to bottom, #f9fafb, #f3f4f6) !important;
  }
}
</style>
