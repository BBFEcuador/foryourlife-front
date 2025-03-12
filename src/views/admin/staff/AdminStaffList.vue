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
              <VBtn variant="elevated" color="primary" @click="showForm = true">
                <Icon class="mr-2" icon="mdi:plus" />
                Agregar
              </VBtn>
            </v-toolbar>
          </template>
          <template #item.active="{ item }">
            <VChip v-if="item.active" color="success"> Activo </VChip>
            <VChip v-else color="error"> Inactivo </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <VBtn icon color="secondary" @click="onVisionaryEdit(item)">
                <Icon icon="tabler:pencil-check" />
              </VBtn>
              <v-btn flat :color="item.active ? 'error' : 'success'" icon @click="onChangeStatus(item)">
                <Icon :icon="item.active ? 'mdi-power' : 'mdi-power-off'" />
              </v-btn>
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
        <InputSection label="E-mail">
          <VTextField
            placeholder="correo del staff"
            v-model="staff.user.email"
            :error-messages="validator.user.email.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <InputSection label="Tel">
          <VTextField
            placeholder="Telefono del staff"
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
