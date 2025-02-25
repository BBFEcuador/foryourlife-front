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
import { showErrorToast } from '@/service/sweetAlert';
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
const search = ref();
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'E-mail', value: 'email' },
  { title: 'Teléfono', value: 'phone' },
  { title: 'Acciones', value: 'actions', width: 50 }
];

const trainer = ref<Trainers>({} as Trainers);

const onTrainerSubmit = (trainer: Trainers) => {
  if (!trainer.id) {
    trainer.id = uuidv4();
  }
  saveTrainerMutations.mutate(trainer);
};

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

</script>
<template>
  <BaseBreadcrumb :title="'Entrenadores'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de entrenadores">
        <v-data-table :headers="headers" :search="search" :items="trainers" :loading="isFetching">
          <template v-slot:top>
            <v-toolbar
              class="bg-surface tw-px-3"
              flat
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }"
              :delay="200"
              :duration="250"
            >
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card">
                <Icon icon="mdi-magnify" height="18"></Icon>
              </VTextField>
              <v-spacer></v-spacer>
              <VBtn variant="tonal" color="success" @click="showForm = true">Agregar</VBtn>
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">

              <VBtn icon variant="tonal" color="success" @click="onTrainerSelected(item)">
                <Icon icon="tabler:pencil-check" />
              </VBtn>
              <v-btn small :color="item.active ? 'error' : 'success'" icon size="small"
              @click="onToggleUserStatus(item)">
              <Icon :icon="item.active
                  ? 'mdi-power'
                  : 'mdi-power-off'" height="18" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
    <VDialog v-model="showForm" max-width="500">
      <VCard>
        <VCardTitle>
          <h3>Crear entrenador</h3>
        </VCardTitle>
        <VCardItem>
          <TrainerForm :trainer="trainer" :is-loading="saveTrainerMutations.isPending.value" @onsubmit="onTrainerSubmit" />
        </VCardItem>
      </VCard>
    </VDialog>
  </v-row>
</template>

<style scoped></style>
