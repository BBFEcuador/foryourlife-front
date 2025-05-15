<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useTrainerMutations from '@/composables/admin/trainer/useTrainerMutations';
import useTrainer from '@/composables/admin/trainer/useTrainers';
import type { Trainers } from '@/models/Trainers';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import TrainerForm from './TrainerForm.vue';
import { v4 as uuidv4 } from 'uuid';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';

const { isError, isFetching, trainers, page, perPage, search,refetch } = useTrainer();
const { saveTrainerMutations, disableTrainerMutation } = useTrainerMutations();
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

watch(saveTrainerMutations.isError, () => {
  if (saveTrainerMutations.isError.value) {
    const error = saveTrainerMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveTrainerMutations.isSuccess, () => {
  if (saveTrainerMutations.isSuccess.value) {
    showCreateForm.value = false;
    showEditForm.value = false;
    refetch()
  }
});

const onToggleUserStatus = (user: Trainers) => {
  const isCurrentlyActive = user.active;
  const action = isCurrentlyActive ? 'desactivar' : 'activar';
  const confirmText = isCurrentlyActive ? 'Desactivar' : 'Activar';
  const confirmColor = isCurrentlyActive ? '#d33' : '#3085d6';

  Swal.fire({
    title: `¿Estás seguro de ${action} este Entrenador?`,
    text: `Estás a punto de ${action} el Entrenador ${user.name}. ¿Deseas continuar?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar'
  }).then((params) => {
    if (params.isConfirmed) {
      disableTrainerMutation.mutate({
        id: user.id,
        isActive: !isCurrentlyActive
      });
    }
  });
};

watch(disableTrainerMutation.isSuccess, () => {
  if (disableTrainerMutation.isSuccess.value) {
    refetch()
    toast.success("Acción Exitosa", {
      autoClose: 3000,
      closeButton: true
    })
  }
});

watch(disableTrainerMutation.isError, () => {
  if (disableTrainerMutation.isError.value) {
    const error = disableTrainerMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

const showCreateForm = ref(false);
const showEditForm = ref(false);
const headers = [
  { title: 'Nombre', value: 'name', sortable: true },
  { title: 'E-mail', value: 'email', sortable: true },
  { title: 'Teléfono', value: 'phone', sortable: true },
  { title: 'Activo', value: 'active', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false, width: 50 }
];

const trainer = ref<Trainers>({} as Trainers);

const openCreateTrainerModal = () => {
  trainer.value = {} as Trainers;
  showCreateForm.value = true;
};

const openEditTrainerModal = (item: Trainers) => {
  trainer.value = { ...item };
  showEditForm.value = true;
};

const onTrainerSubmit = (trainer: Trainers) => {
  if (!trainer.id) {
    trainer.id = uuidv4();
  }
  saveTrainerMutations.mutate(trainer);
};

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = trainers.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};
</script>
<template>
  <BaseBreadcrumb :title="'Entrenadores'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    <template #prepend>
      <Icon icon="mdi:dumbbell" class="tw:text-gray-600" />
    </template>
  </BaseBreadcrumb>

  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de entrenadores" class="!tw:shadow-lg !tw:rounded-xl !tw:border !tw:border-gray-100">
        <template #prepend>
          <Icon icon="mdi:format-list-bulleted" />
        </template>

        <v-data-table-server
          :headers="headers"
          :search="search"
          :items="trainers.content"
          :loading="isFetching"
          class="tw:rounded-xl elevation-0"
          :loading-text="'Cargando entrenadores...'"
          :no-data-text="'No se encontraron entrenadores'"
          :items-length="trainers.totalElements"
          :items-per-page="10"
          @update:options="loadItems"
          hover
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
              <div class="tw:flex-1 tw:max-w-md tw:relative">
                <VTextField
                  v-model="search"
                  placeholder="Buscar por nombre, email o teléfono..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="tw:rounded-lg"
                  bg-color="white"
                >
                  <template #prepend-inner>
                    <Icon icon="mdi:magnify" height="18" />
                  </template>
                  <template #append v-if="search">
                    <VBtn icon variant="text" size="small" @click="search = ''">
                      <Icon icon="mdi:close" height="18" />
                    </VBtn>
                  </template>
                </VTextField>
              </div>
              <v-spacer></v-spacer>
              <VBtn variant="elevated" color="primary" @click="openCreateTrainerModal" class="!tw:font-normal tw:rounded-lg">
                <Icon class="mr-2" icon="mdi:plus" />
                Agregar Entrenador
              </VBtn>
            </v-toolbar>
          </template>

          <template #item.name="{ item }">
            <div class="tw:flex tw:items-center tw:gap-3">
              <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                <Icon icon="mdi:dumbbell" class="tw:text-gray-600" />
              </div>
              <span class="tw:font-medium">{{ item.name }}</span>
            </div>
          </template>

          <template #item.email="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
              <Icon icon="mdi:email" class="tw:text-gray-400" />
              <span>{{ item.email }}</span>
            </div>
          </template>

          <template #item.phone="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
              <Icon icon="mdi:phone" class="tw:text-gray-400" />
              <span>{{ item.phone }}</span>
            </div>
          </template>

          <template #item.active="{ item }">
            <VChip
              :color="item.active ? 'success' : 'error'"
              size="small"
              variant="flat"
              class="!tw:font-normal tw:text-xs !tw:min-w-[80px]"
              :class="item.active ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'"
            >
              <template #prepend>
                <Icon :icon="item.active ? 'mdi:check-circle' : 'mdi:close-circle'" class="tw:mr-1" />
              </template>
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <div class="tw:flex tw:gap-2">
              <VBtn
                icon
                color="info"
                variant="text"
                size="32"
                class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                v-tooltip="'Editar entrenador'"
                @click="openEditTrainerModal(item)"
              >
                <Icon icon="tabler:pencil" class="tw:text-blue-600" />
              </VBtn>
              <v-btn
                :color="item.active ? 'error' : 'success'"
                icon
                variant="text"
                size="32"
                :loading="disableTrainerMutation.isPending.value"
                @click="onToggleUserStatus(item)"
                :class="item.active ? 'tw:bg-red-50 hover:!tw:bg-red-100' : 'tw:bg-green-50 hover:!tw:bg-green-100'"
                class="tw:rounded-lg !tw:shadow-sm"
                v-tooltip="item.active ? 'Desactivar entrenador' : 'Activar entrenador'"
              >
                <Icon :icon="item.active ? 'mdi-power' : 'mdi-power-off'" :class="item.active ? 'tw:text-red-600' : 'tw:text-green-600'" />
              </v-btn>
            </div>
          </template>

          <template #loading>
            <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
          </template>

          <template #no-data>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
              <Icon icon="mdi:dumbbell" height="48" class="tw:mb-4" />
              <p class="tw:text-lg">No se encontraron entrenadores</p>
              <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          </template>
        </v-data-table-server>
      </UiParentCard>
    </v-col>

    <VDialog v-model="showCreateForm" max-width="500" transition="dialog-bottom-transition" persistent>
      <UiParentCard :title="`Crear entrenador`" class="!tw:rounded-xl !tw:shadow-xl !tw:border !tw:border-gray-100">
        <template #prepend>
          <Icon icon="mdi:dumbbell-plus" class="tw:text-gray-600" />
        </template>
        <TrainerForm
          :trainer="trainer"
          :is-loading="saveTrainerMutations.isPending.value"
          @onsubmit="onTrainerSubmit"
          @cancel="showCreateForm = false"
        />
      </UiParentCard>
    </VDialog>

    <VDialog v-model="showEditForm" max-width="500" transition="dialog-bottom-transition" persistent>
      <UiParentCard :title="`Editar entrenador: ${trainer.name}`" class="!tw:rounded-xl !tw:shadow-xl !tw:border !tw:border-gray-100">
        <template #prepend>
          <Icon icon="mdi:dumbbell-edit" class="tw:text-gray-600" />
        </template>
        <TrainerForm
          :trainer="trainer"
          :is-loading="saveTrainerMutations.isPending.value"
          @onsubmit="onTrainerSubmit"
          @cancel="showEditForm = false"
        />
      </UiParentCard>
    </VDialog>
  </v-row>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}
</style>
