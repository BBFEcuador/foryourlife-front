<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useAdminRoles from '@/composables/admin/rol/useAdminRoles';
import useAdminUserMutations from '@/composables/admin/user/useAdminUserMutations';
import useAdminUsers from '@/composables/admin/user/useAdminUsers';
import type { Admin, UserActive } from '@/models/Admin';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { VBtn } from 'vuetify/components';

const { isError, isFetching, users } = useAdminUsers();
const { disableAdminMutation, changeRoleMutation } = useAdminUserMutations();
const { isRolesLoading,isRolesError,roles} = useAdminRoles();
const search = ref();
const showForm = ref(false);
const headers = [
  { title: 'Nombre', value: 'name', class: 'my-header-style' },
  { title: 'Correo', value: 'email' },
  { title: 'Rol', value: 'role.name' },
  { title: 'Estado', value: 'active' },
  { title: 'Acciones', value: 'actions', width: 50 }
];
const breadcrumbs = ref([
  {
    title: 'Others',
    disabled: false,
    href: '#'
  }
]);

const onToggleUserStatus = (user: Admin) => {
  const isCurrentlyActive = user.active;
  const action = isCurrentlyActive ? "desactivar" : "activar";
  const confirmText = isCurrentlyActive ? "Desactivar" : "Activar";
  const confirmColor = isCurrentlyActive ? "#d33" : "#3085d6";

  Swal.fire({
    title: `¿Estás seguro de ${action} este Usuario?`,
    text: `Estás a punto de ${action} el Usuario ${user.name}. ¿Deseas continuar?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#6c757d",
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar",
  }).then((params) => {
    if (params.isConfirmed) {
      disableAdminMutation.mutate({
        id: user.id,
        isActive: !isCurrentlyActive,
      });
    }
  });
};

watch(disableAdminMutation.isSuccess, () => {
  if (disableAdminMutation.isSuccess.value) {
    users.value.find(x => x.id == disableAdminMutation.variables.value?.id)!.active = disableAdminMutation.variables.value!.isActive!
    toast.success("Acción exitosa", {
      autoClose: 3000,
      closeButton: true
    })
  }
}
)

watch(disableAdminMutation.isError, () => {
  if (disableAdminMutation.isError.value) {
    const error = disableAdminMutation.error.value as AxiosError<ErrorApiResponse>
    showErrorToast(error)
  }
}
)

const selectedUser = ref<Admin | null>(null);

const openEditDialog = (user: Admin) => {
  selectedUser.value = { ...user };
  showForm.value = true;
};

const updateUser = () => {
  if (selectedUser.value) {
    changeRoleMutation.mutate({
      id: selectedUser.value.id,
      roleId: selectedUser.value.role.id,
    });
  }
};

watch(changeRoleMutation.isSuccess, () => {
  if (changeRoleMutation.isSuccess.value) {
    let response = changeRoleMutation.isSuccess.value;
    if (response) {
      toast.success("Rol actualizado", {
        autoClose: 3000,
        closeButton: true
      })
    }
  }
})

watch(changeRoleMutation.isError, () =>{
  if (changeRoleMutation.isError.value) {
    let error = changeRoleMutation.error.value as AxiosError<ErrorApiResponse>
    showErrorToast(error)
  }
})
</script>
<template>
  <BaseBreadcrumb :title="'Usuarios'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Lista de sedes">
        <v-data-table :headers="headers" :search="search" :items="users" :loading="isFetching">
          <template v-slot:top>
            <v-toolbar class="bg-surface tw-px-3" flat v-motion :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }" :delay="200" :duration="250">
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card"
                :variant="'outlined'" />
              <v-spacer></v-spacer>
              <VBtn :to="{ name: 'users-admin-add' }" color="primary" variant="elevated"> Crear </VBtn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2">

              <v-btn icon color="primary" size="small" @click="openEditDialog(item)">
                <Icon icon="mdi-pencil" height="18" />
              </v-btn>

              <v-btn small :color="item.active ? 'error' : 'success'" icon size="small"
                @click="onToggleUserStatus(item)">
                <Icon :icon="item.active
                  ? 'mdi-power'
                  : 'mdi-power-off'" height="18" />
              </v-btn>
            </div>
          </template>
          <template v-slot:item.active="{ item }">
            <p>{{ item.active ? 'Activado' : 'Desactivado' }}</p>
          </template>
          <template v-slot:no-data>
            <tr>
              <td colspan="3">Sin datos</td>
            </tr>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
  <VDialog v-model="showForm" max-width="500" v-if="selectedUser">
    <VCard>
      <VCardTitle>
        <h3>Modificar Administrador: {{ selectedUser.name }}</h3>
      </VCardTitle>
      
      <VCardText>

        <VSelect 
          v-model="selectedUser.role.id" 
          label="Rol"
          :items="roles"
          :loading="isRolesLoading"
          item-title="name"
          item-value="id"
          variant="outlined"
        />
        <div class="tw:flex tw:gap-3">
          <VSpacer/>
          <VBtn color="secondary" @click="showForm = false">Cancelar</VBtn>
          <VBtn color="primary" @click="updateUser" :loading="changeRoleMutation.isPending.value">Guardar</VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
