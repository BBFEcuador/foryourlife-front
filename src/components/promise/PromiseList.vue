<script setup lang="ts">
import usePromises from '@/composables/admin/promise/usePromises';
import usePromisesMutations from '@/composables/admin/promise/usePromisesMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { DaysEnum } from '@/models/Attendance';
import type { PromiseRequest, Promises } from '@/models/Promises';
import type { AxiosError } from 'axios';
import { computed, reactive, watch } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  trainingId: string;
}>();

const TABLE_HEADERS = [
  { title: 'Participante', value: 'user.name' },
  { title: 'Viernes', value: 'fridayPromise' },
  { title: 'Sábado', value: 'saturdayPromise' },
  { title: 'Domingo', value: 'sundayPromise' },
  { title: 'Personas registradas', value: 'achievedCount' },
  { title: 'Compras realizadas', value: 'paidCount' },
  { title: 'Fecha de Fin', value: 'endDate' }
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

const masterLifePromises = computed(() =>
  promises.value?.filter(
    (p) => p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')
  ) || []
)

const participantPromises = computed(() =>
  promises.value?.filter(
    (p) =>
      p.user?.entityMap?.some((e) => e.entity === 'PARTICIPANT') &&
      !p.user?.entityMap?.some((e) => e.entity === 'MASTER_LIFE')
  ) || []
)

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
    <h3 class="text-h6 mb-3 text-primary">Usuarios MASTER_LIFE</h3>
    <v-data-table
      :items="masterLifePromises"
      :loading="isPromisesLoading"
      :headers="TABLE_HEADERS"
      hide-default-footer
      density="comfortable"
    >
      <template #item="{ internalItem, item }">
        <v-data-table-row :item="internalItem">
          <template>
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
              @update:model-value="handlePromiseChange(item.id, 'third')"
            />
          </template>
        </v-data-table-row>
      </template>

      <template #no-data>
        <div class="text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">
            <Icon icon="mdi-alert-outline" />
          </v-icon>
          <p class="text-body-2 mt-2">No hay usuarios MASTER_LIFE registrados</p>
        </div>
      </template>
    </v-data-table>

    <v-divider class="my-6" />

    <!-- 🔹 Tabla PARTICIPANT -->
    <h3 class="text-h6 mb-3 text-success">Usuarios PARTICIPANT</h3>
    <v-data-table
      :items="participantPromises"
      :loading="isPromisesLoading"
      :headers="TABLE_HEADERS"
      hide-default-footer
      density="comfortable"
    >
      <template #item="{ internalItem, item }">
        <v-data-table-row :item="internalItem">
          <template>
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
              @update:model-value="handlePromiseChange(item.id, 'first')"
            />
          </template>

          <template>
            <v-text-field
              v-model="promiseModels[item.id].second"
              density="compact"
              variant="outlined"
              hide-spin-buttons
              :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
              @update:model-value="handlePromiseChange(item.id, 'second')"
            />
          </template>

          <template>
            <v-text-field
              v-model="promiseModels[item.id].third"
              density="compact"
              variant="outlined"
              hide-spin-buttons
              :rules="[(v) => Number(v) >= 0 || `El valor debe ser mayor o igual a 0`]"
              @update:model-value="handlePromiseChange(item.id, 'third')"
            />
          </template>
        </v-data-table-row>
      </template>

      <template #no-data>
        <div class="text-center pa-4">
          <v-icon size="48" color="grey-lighten-1">
            <Icon icon="mdi-alert-outline" />
          </v-icon>
          <p class="text-body-2 mt-2">No hay participantes registrados</p>
        </div>
      </template>
    </v-data-table>
  </div>
</template>


<style></style>
