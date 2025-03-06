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

const { isError, isFetching, trainers } = useTrainer();
const { saveTrainerMutations, disableTrainerMutation } = useTrainerMutations();
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const showForm = ref(false);

watch(saveTrainerMutations.isError, () => {
  if (saveTrainerMutations.isError.value) {
    const error = saveTrainerMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveTrainerMutations.isSuccess, () => {
  if (saveTrainerMutations.isSuccess.value) {
    let x = new Set(trainers.value);
    trainers.value = Array.from(x);
    showForm.value = false;
  }
});

const onTrainerSelected = (item: Trainers) => {
  trainer.value = { ...item };
  showForm.value = true;
};

const onToggleUserStatus = (user: Trainers) => {
  const isCurrentlyActive = user.active;
  const action = isCurrentlyActive ? "desactivar" : "activar";
  const confirmText = isCurrentlyActive ? "Desactivar" : "Activar";
  const confirmColor = isCurrentlyActive ? "#d33" : "#3085d6";

  Swal.fire({
    title: `¿Estás seguro de ${action} este Entrenador?`,
    text: `Estás a punto de ${action} el Entrenador ${user.name}. ¿Deseas continuar?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#6c757d",
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar",
  }).then((params) => {
    if (params.isConfirmed) {
      disableTrainerMutation.mutate({
        id: user.id,
        isActive: !isCurrentlyActive,
      });
    }
  });
};

watch(disableTrainerMutation.isSuccess, () => {
  if (disableTrainerMutation.isSuccess.value) {
    trainers.value.find(x => x.id == disableTrainerMutation.variables.value?.id)!.active = disableTrainerMutation.variables.value!.isActive!
    toast.success("Acción Exitosa", {
      autoClose: 3000,
      closeButton: true
    })
  }
}
)

watch(disableTrainerMutation.isError, () => {
  if (disableTrainerMutation.isError.value) {
    const error = disableTrainerMutation.error.value as AxiosError<ErrorApiResponse>
    showErrorToast(error)
  }
}
)

const showCreateForm = ref(false);
const showEditForm = ref(false);
const search = ref();
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

watch(saveTrainerMutations.isSuccess, () => {
  if (saveTrainerMutations.isSuccess.value) {
    if (trainers.value.find((x) => x.id == trainer.value.id)) {
      trainers.value = trainers.value.filter((x) => x.id != trainer.value.id)
      showSuccessToast('Actualización Exitosa');
    } else {
      showSuccessToast('Entrenador creado exitosamente');
    }
    trainers.value.push(trainer.value)
    let x = new Set(trainers.value);
    trainers.value = Array.from(x);
    showCreateForm.value = false;
    showEditForm.value = false;
    trainer.value = {} as Trainers

  }
});
</script>
<template>
  <BaseBreadcrumb :title="'Entrenadores'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de entrenadores">
        <v-data-table :headers="headers" :search="search" :items="trainers" :loading="isFetching">
          <template v-slot:top>
            <v-toolbar class="bg-surface tw-px-3" flat v-motion :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }" :delay="200" :duration="250">
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card">
                <Icon icon="mdi-magnify" height="18"></Icon>
              </VTextField>
              <v-spacer></v-spacer>
              <VBtn variant="elevated" color="primary" @click="openCreateTrainerModal">
                <Icon class="mr-2" icon="mdi:plus" />
                Agregar
              </VBtn>
            </v-toolbar>
          </template>
          <template #item.active="{ item }">
            <VChip v-if="item.active" color="success">
              Activo
            </VChip>
            <VChip v-else color="error">
              Inactivo
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <VBtn icon color="secondary" @click="openEditTrainerModal(item)">
                <Icon icon="tabler:pencil-check" />
              </VBtn>
              <v-btn flat :color="item.active ? 'error' : 'success'" icon @click="onToggleUserStatus(item)">
                <Icon :icon="item.active
                  ? 'mdi-power'
                  : 'mdi-power-off'" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
    <VDialog v-model="showCreateForm" max-width="500">
      <UiParentCard :title="`Crear entrenador`">
        <TrainerForm :trainer="trainer" :is-loading="saveTrainerMutations.isPending.value"
          @onsubmit="onTrainerSubmit" />
      </UiParentCard>
    </VDialog>

    <VDialog v-model="showEditForm" max-width="500">
      <UiParentCard :title="`Editar entrenador: ${trainer.name}`">
        <TrainerForm :trainer="trainer" :is-loading="saveTrainerMutations.isPending.value"
          @onsubmit="onTrainerSubmit" />
      </UiParentCard>

    </VDialog>
  </v-row>
</template>

<style scoped></style>
