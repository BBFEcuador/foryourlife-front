<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import useStaffs from '@/composables/admin/staff/useStaffs';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { StaffWriteModel } from '@/models/Staff';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue';
import useVuelidate from '@vuelidate/core';
import { email, numeric, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';

const { isStaffError, isStaffloading, staffData, refetchStaff } = useStaffs();
const { saveStaffMutations ,changeStatusMutations} = useStaffMutations();
const showForm = ref(false);
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const search = ref();
const staffRules = {
  rol: { required },
  user: {
    name: { required },
    phone: { required, numeric },
    email: { required, email }
  }
};
const headers = [
  { title: 'Nombre', value: 'user.name', sortable: true },
  { title: 'E-mail', value: 'user.email', sortable: true },
  { title: 'Teléfono', value: 'user.phone', sortable: true },
  { title: 'Activo', value: 'active', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false, width: 50 }
];

const staff = ref<StaffWriteModel>({
  user: {}
} as StaffWriteModel);
const validator = useVuelidate(staffRules, staff);

const onChangeStatus = async (item:StaffWriteModel) => {
  const result = await Swal.fire({
    title: item.active ? '¿Desactivar Visionario?' : '¿Activar Visionario?',
    text: item.active 
      ? `¿Está seguro que desea desactivar a ${item.user.name}?`
      : `¿Está seguro que desea activar a ${item.user.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    changeStatusMutations.mutate(item);
  }
}

const onVisionaryEdit = async (item: StaffWriteModel) => {
  staff.value = JSON.parse(JSON.stringify(item))
  showForm.value = true
};

const onSave = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    saveStaffMutations.mutate(staff.value);
  }
};

watch(saveStaffMutations.isError, () => {
  if (saveStaffMutations.isError.value) {
    const error = saveStaffMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(changeStatusMutations.isSuccess,() => {
  if (changeStatusMutations.isSuccess.value) {
    refetchStaff();
    showSuccessToast('Visionario desactivado correctamente');
  }
})

watch(changeStatusMutations.isError, () => {
  if (changeStatusMutations.isError.value) {
    const error = changeStatusMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
})

watch(saveStaffMutations.isSuccess, () => {
  if (saveStaffMutations.isSuccess.value) {
    showForm.value = false;
    staff.value = {
      user: {}
    } as StaffWriteModel;
    refetchStaff();
  }
});
</script>

<template>
  <BaseBreadcrumb :title="'Staff'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de Staff">
        <v-data-table :headers="headers" :search="search" :items="staffData" :loading="isStaffloading">
          <template v-slot:top>
            <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                <VTextField v-model="search" placeholder="Buscar Usuarios..." variant="outlined" density="comfortable"
                  hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm" bg-color="white">
                  <template #prepend-inner>
                    <div class="tw:relative">
                      <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                      <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
                      </div>
                    </div>
                  </template>
                  <template #append v-if="search">
                    <VBtn icon variant="text" size="small" @click="search = ''"
                      class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                      <Icon icon="mdi:close" height="18" />
                    </VBtn>
                  </template>
                </VTextField>
              <v-spacer></v-spacer>
              <VBtn variant="elevated" color="primary" @click="showForm = true">
                <Icon class="mr-2" icon="mdi:plus" />
                Agregar
              </VBtn>
            </v-toolbar>
          </template>
          <template #item.active="{ item }">
            <VChip :color="item.active ? 'success' : 'error'" size="small" variant="flat"
                class="!tw:font-normal tw:text-xs !tw:min-w-[80px]"
                :class="item.active ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'">
                <template #prepend>
                  <Icon :icon="item.active ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-2" />
                </template>
                {{ item.active ? 'Activo' : 'Inactivo' }}
              </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn icon color="info" variant="text" size="32"
                  class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100" v-tooltip="'Editar Staff'"
                  @click="onVisionaryEdit(item)">
                  <Icon icon="tabler:pencil" height="18" />
                </v-btn>
                <v-btn :color="item.active ? 'error' : 'success'" icon variant="text" size="32"
                  v-tooltip="item.active ? 'Desactivar' : 'Activar'"
                  :class="item.active ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                  @click="onChangeStatus(item)">
                  <Icon :icon="item.active
                    ? 'mdi-power'
                    : 'mdi-power-off'" height="18" />
                </v-btn>
            </div>
          </template>
          <template #loading>
              <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
            </template>

            <template #no-data>
              <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="hugeicons:customer-support" height="48" class="tw:mb-4" />
                <p class="tw:text-lg">No se encontraron staff</p>
                <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </template>

        </v-data-table>
      </UiParentCard>
    </v-col>
    <VDialog max-width="500" v-model="showForm">
      <UiParentCard title="Guardar staff">
        <InputSection label="Nombre">
          <VTextField
            placeholder="Nombre del staff"
            v-model="staff.user.name"
            :error-messages="validator.user.name.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <InputSection label="Correo">
          <VTextField
            placeholder="Correo del staff"
            v-model="staff.user.email"
            :error-messages="validator.user.email.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <InputSection label="Teléfono">
          <VTextField
            placeholder="Teléfono del staff"
            v-model="staff.user.phone"
            :error-messages="validator.user.phone.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <InputSection label="Rol">
          <VSelect
            placeholder="Rol del staff"
            :items="['CAPITAN', 'STAFF']"
            v-model="staff.rol"
            :error-messages="validator.rol.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <div class="tw:w-full tw:flex tw:justify-end">
          <VBtn @click="onSave" color="primary">Guardar</VBtn>
        </div>
      </UiParentCard>
    </VDialog>
  </v-row>
</template>

<style scoped></style>
