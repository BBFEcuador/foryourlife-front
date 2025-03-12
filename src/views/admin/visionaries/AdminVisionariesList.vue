<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useVisionaries from '@/composables/admin/visionaries/useVisionaries';
import useVisionarymutations from '@/composables/admin/visionaries/useVisionarymutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Visionary } from '@/models/Visionary';
import Swal from 'sweetalert2';
import useVuelidate from '@vuelidate/core';
import { email, numeric, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch, watchEffect } from 'vue';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';

const { isVisionariesError,isVisionariesloading,refetchVisionaries,visionariesData} = useVisionaries();
const { saveVisionaryMutations, changeStatusMutations } = useVisionarymutations();
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
  role: { required },
  user: {
    name: { required },
    phone: { required, numeric },
    email: { required, email }
  }
};
const headers = [
  { title: 'Nombre', value: 'user.name', width: '25%', sortable: true },
  { title: 'E-mail', value: 'user.email', width: '25%', sortable: true },
  { title: 'Teléfono', value: 'user.phone', width: '15%', sortable: true },
  { title: 'Rol', value: 'role', width: '20%', sortable: true },
  { title: 'Activo', value: 'active', width: '10%', sortable: true },
  { title: 'Acciones', value: 'actions', width: '10%', sortable: false}
];

const staff = ref<Visionary>({
  user: {}
} as Visionary);
const validator = useVuelidate(staffRules, staff);

const onSave = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    saveVisionaryMutations.mutate(staff.value);
  }
};

const handleDisableVisionary = async (visionary: Visionary) => {
  const result = await Swal.fire({
    title: visionary.active ? '¿Desactivar Visionario?' : '¿Activar Visionario?',
    text: visionary.active 
      ? `¿Está seguro que desea desactivar a ${visionary.user.name}?`
      : `¿Está seguro que desea activar a ${visionary.user.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    changeStatusMutations.mutate(visionary);
  }
};

watch(changeStatusMutations.isSuccess,() => {
  if (changeStatusMutations.isSuccess.value) {
    refetchVisionaries();
    showSuccessToast('Visionario desactivado correctamente');
  }
})

watch(changeStatusMutations.isError, () => {
  if (changeStatusMutations.isError.value) {
    const error = changeStatusMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
})

watch(saveVisionaryMutations.isError, () => {
  if (saveVisionaryMutations.isError.value) {
    const error = saveVisionaryMutations.error.value as AxiosError<ErrorApiResponse>;
    showForm.value = false;
    showErrorToast(error);
  }
});

watch(saveVisionaryMutations.isSuccess, () => {
  if (saveVisionaryMutations.isSuccess.value) {
    showForm.value = false;
    staff.value = {
      user: {}
    } as Visionary;
    refetchVisionaries();
    showSuccessToast('Visionario guardado correctamente');
  }
});
</script>

<template>
  <BaseBreadcrumb :title="'Visionarios'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    <template #prepend>
      <Icon icon="mdi:account-group-outline"/>
    </template>
  </BaseBreadcrumb>
      <UiParentCard 
        title="Lista de Visionarios" 
        class="!tw:shadow-lg !tw:rounded-xl !tw:border !tw:border-gray-100"
      >
        <template #prepend>
          <Icon icon="mdi:format-list-bulleted" />
        </template>

        <v-data-table 
          :headers="headers" 
          :search="search" 
          :items="visionariesData" 
          :loading="isVisionariesloading"
          class="tw:rounded-xl elevation-0"
          :loading-text="'Cargando visionarios...'"
          :no-data-text="'No se encontraron visionarios'"
          hover
        >
          <template v-slot:top>
            <v-toolbar
              class="px-6 bg-containerBg"
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
                bg-color="white">
                <template #prepend-inner>
                  <Icon icon="mdi:magnify" height="18" />
                </template>
                <template #append v-if="search">
                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    @click="search = ''"
                  >
                    <Icon icon="mdi:close" height="18" />
                  </VBtn>
                </template>
              </VTextField>
            </div>
            <v-spacer></v-spacer>
            <VBtn variant="elevated" color="primary" @click="showForm = true">
              <Icon class="mr-2" icon="mdi:plus" />
              Agregar Visionario
            </VBtn>
          </v-toolbar>
          </template>

          <template #item.user.name="{ item }">
            <div class="tw:flex tw:items-center tw:gap-3 tw:flex-nowrap">
              <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                <Icon icon="mdi:account" class="tw:text-gray-600" />
              </div>
              <span class="tw:font-medium">{{ item.user.name }}</span>
            </div>
          </template>

          <template #item.user.email="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
              <Icon icon="mdi:email"  />
              <span>{{ item.user.email }}</span>
            </div>
          </template>

          <template #item.user.phone="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
              <Icon icon="mdi:phone"  />
              <span>{{ item.user.phone }}</span>
            </div>
          </template>

          <template #item.role="{ item }">
            <div class="tw:flex tw:items-center tw:gap-2">
              <Icon 
                :icon="item.role === 'CAPITAN' ? 'mdi:shield-star' : 'mdi:account-tie'" 
                :class="item.role === 'CAPITAN' ? 'tw:text-amber-500' : 'tw:text-blue-500'"
              />
              <span>{{ item.role === 'CAPITAN' ? 'Capitán' : 'Staff' }}</span>
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
                <Icon 
                  :icon="item.active ? 'mdi:check-circle' : 'mdi:close-circle'" 
                  class="tw:mr-1"
                />
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
                v-tooltip="'Editar visionario'"
              >
                <Icon icon="tabler:pencil" class="tw:text-blue-600" />
              </VBtn>
              <v-btn 
                :color="item.active ? 'error' : 'success'" 
                icon
                variant="text"
                size="32"
                :loading="changeStatusMutations.isPending.value"
                @click="handleDisableVisionary(item)"
                :class="item.active ? 'tw:bg-red-50 hover:!tw:bg-red-100' : 'tw:bg-green-50 hover:!tw:bg-green-100'"
                class="tw:rounded-lg !tw:shadow-sm"
                v-tooltip="item.active ? 'Desactivar visionario' : 'Activar visionario'"
              >
                <Icon 
                  :icon="item.active ? 'mdi-power' : 'mdi-power-off'" 
                  :class="item.active ? 'tw:text-red-600' : 'tw:text-green-600'"
                />
              </v-btn>
            </div>
          </template>

          <template #loading>
            <v-progress-linear
              color="primary"
              indeterminate
              class="tw:rounded-t-xl"
            ></v-progress-linear>
          </template>

          <template #no-data>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
              <Icon icon="mdi:account-search" size="48" class="tw:mb-4" />
              <p class="tw:text-lg">No se encontraron visionarios</p>
              <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          </template>
        </v-data-table>
      </UiParentCard>

    <VDialog 
      max-width="500" 
      v-model="showForm"
      transition="dialog-bottom-transition"
      persistent
    >
      <UiParentCard 
        :title="staff.user.id ? 'Editar Visionario' : 'Nuevo Visionario'"
        class="!tw:rounded-xl !tw:shadow-xl !tw:border !tw:border-gray-100"
      >
        <template #prepend>
          <Icon 
            :icon="staff.user.id ? 'mdi:account-edit' : 'mdi:account-plus'" 
            class="tw:text-gray-600 tw:mr-2" 
          />
        </template>

        <v-form @submit.prevent="onSave" class="tw:flex tw:flex-col tw:gap-6">
          <div class="tw:space-y-6">
            <InputSection label="Nombre" required>
              <VTextField
                placeholder="Ingrese el nombre del visionario"
                v-model="staff.user.name"
                :error-messages="validator.user.name.$errors.map((x) => x.$message.toString())"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="tw:rounded-lg !tw:shadow-sm"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <Icon icon="mdi:account"  />
                </template>
              </VTextField>
            </InputSection>
            
            <InputSection label="E-mail" required>
              <VTextField
                placeholder="Ingrese el correo electrónico"
                v-model="staff.user.email"
                :error-messages="validator.user.email.$errors.map((x) => x.$message.toString())"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="tw:rounded-lg !tw:shadow-sm"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <Icon icon="mdi:email"  />
                </template>
              </VTextField>
            </InputSection>
            
            <InputSection label="Teléfono" required>
              <VTextField
                placeholder="Ingrese el número telefónico"
                v-model="staff.user.phone"
                :error-messages="validator.user.phone.$errors.map((x) => x.$message.toString())"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="tw:rounded-lg !tw:shadow-sm"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <Icon icon="mdi:phone"  />
                </template>
              </VTextField>
            </InputSection>
            
            <InputSection label="Rol" required>
              <VSelect
                placeholder="Seleccione el rol"
                :items="[
                  { title: 'Capitán', value: 'CAPITAN', icon: 'mdi:shield-star' },
                  { title: 'Staff', value: 'STAFF', icon: 'mdi:account-tie' }
                ]"
                item-title="title"
                item-value="value"
                v-model="staff.role"
                :error-messages="validator.role.$errors.map((x) => x.$message.toString())"
                variant="outlined"
                hide-details="auto"
                class="tw:rounded-lg !tw:shadow-sm"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <Icon icon="mdi:shield-account"  />
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <Icon class="mr-2"
                        :icon="item.raw.icon"
                        :class="item.raw.value === 'CAPITAN' ? 'tw:text-amber-500' : 'tw:text-blue-500'"
                      />
                    </template>
                  </v-list-item>
                </template>
              </VSelect>
            </InputSection>
          </div>

          <div class="tw:flex tw:justify-end tw:gap-3 tw:mt-6">
            <VBtn
              variant="text"
              color="error"
              @click="showForm = false"
              :disabled="saveVisionaryMutations.isPending.value"
              class="!tw:font-normal tw:rounded-lg tw:min-w-[120px]"
            >
              <Icon icon="mdi:close" class="tw:mr-2" />
              Cancelar
            </VBtn>
            <VBtn
              color="primary"
              @click="onSave"
              :loading="saveVisionaryMutations.isPending.value"
              class="!tw:font-normal tw:rounded-lg tw:min-w-[120px] !tw:bg-primary"
            >
              <Icon 
                :icon="staff.user.id ? 'mdi:content-save-edit' : 'mdi:content-save-plus'" 
                class="tw:mr-2" 
              />
              {{ staff.user.id ? 'Actualizar' : 'Guardar' }}
            </VBtn>
          </div>
        </v-form>
      </UiParentCard>
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
