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
const { isRolesLoading, isRolesError, roles } = useAdminRoles();
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

watch(changeRoleMutation.isError, () => {
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
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-text>
          <v-data-table :headers="headers" :search="search" :items="users" :loading="isFetching" hover
            class="tw:rounded-xl elevation-0 !tw:border-gray-100">
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
                <VBtn :to="{ name: 'users-admin-add' }" color="primary" variant="elevated">
                  <Icon icon="mdi:plus" height="18" class="mr-2" />
                  Crear Usuario
                </VBtn>
              </v-toolbar>
            </template>
            <template v-slot:item.name="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap group">
                <Icon icon="mdi:account" class="tw:text-primary tw:transition-transform group-hover:tw:scale-110" />
                <div
                  class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-10 tw:transition-opacity">
                </div>
                <div>
                  <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                    item.name }}</span>
                </div>
              </div>
            </template>
            <template v-slot:item.email="{ item }">
              <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap group">
                <div
                  class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-10 tw:transition-opacity">
                </div>
                <div>
                  <v-chip>
                    <Icon icon="mdi:email"
                      class="mr-2 tw:text-primary tw:transition-transform group-hover:tw:scale-110" />
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">
                      {{ item.email }}
                    </span>
                  </v-chip>
                </div>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2">

                <v-btn icon color="info" variant="text" size="32"
                  class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100" v-tooltip="'Editar usuario'"
                  @click="openEditDialog(item)">
                  <Icon icon="tabler:pencil" height="18" />
                </v-btn>

                <v-btn :color="item.active ? 'error' : 'success'" icon variant="text" size="32"
                  v-tooltip="item.active ? 'Desactivar' : 'Activar'"
                  :class="item.active ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                  @click="onToggleUserStatus(item)">
                  <Icon :icon="item.active
                    ? 'mdi-power'
                    : 'mdi-power-off'" height="18" />
                </v-btn>
              </div>
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
            <template #loading>
              <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
            </template>

            <template #no-data>
              <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="mdi:account" height="48" class="tw:mb-4" />
                <p class="tw:text-lg">No se encontraron usuarios</p>
                <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <VDialog v-model="showForm" max-width="500" v-if="selectedUser">
    <VCard>
      <VCardTitle>
        <h3>Modificar Administrador: {{ selectedUser.name }}</h3>
      </VCardTitle>

      <VCardText>

        <VSelect v-model="selectedUser.role.id" label="Rol" :items="roles" :loading="isRolesLoading" item-title="name"
          item-value="id" variant="outlined" />
        <div class="tw:flex tw:gap-3">
          <VSpacer />
          <VBtn color="secondary" @click="showForm = false">Cancelar</VBtn>
          <VBtn color="primary" @click="updateUser" :loading="changeRoleMutation.isPending.value">Guardar</VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
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
