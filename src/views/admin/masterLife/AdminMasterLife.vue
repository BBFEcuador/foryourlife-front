<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useMasterLifeMutations from '@/composables/admin/masterLife/useMasterLifeMutations';
import useMasterLifes from '@/composables/admin/masterLife/useMasterLifes';
import type { MasterLife } from '@/models/MasterLife';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { email, numeric, required } from '@vuelidate/validators';
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';

const { isMasterLifeError, isMasterLifeLoading, masterLifeData, refetchMasterLife, page, perPage, search } = useMasterLifes();
const { saveMasterLifeMutations, changeStatusMutations } = useMasterLifeMutations();

const debouncedSearch = ref('');

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});

const headers = [
  { title: 'Nombre', value: 'user.name', sortable: true },
  { title: 'E-mail', value: 'user.email', sortable: true },
  { title: 'Teléfono', value: 'user.phone', sortable: true },
  { title: 'Activo', value: 'active', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false, width: 50 }
];
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const showForm = ref();
const masterLife = ref<MasterLife>({
  user: {},
  active: true
} as MasterLife);
const staffRules = {
  user: {
    name1: {
      required: { ...required, $message: 'Debe ingresar su primer nombre' }
    },
    name2: { required: { ...required, $message: 'Debe ingresar su segundo nombre' } },
    lastname1: { required: { ...required, $message: 'Debe ingresar su primer apellido' } },
    lastname2: { required: { ...required, $message: 'Debe ingresar su segundo apellido' } },
    phone: { required: { ...required, $message: 'Debe ingresar su número de teléfono' }, numeric },
    email: { required: { ...required, $message: 'Debe ingresar su correo electrónico' }, email }
  }
};
const validator = useVuelidate(staffRules, masterLife);
const onVisionaryEdit = (item: MasterLife) => {
  masterLife.value = JSON.parse(JSON.stringify(item));
  showForm.value = true;
};
const onChangeStatus = async (item: MasterLife) => {
  const result = await Swal.fire({
    title: item.active ? '¿Desactivar Visionario?' : '¿Activar Visionario?',
    text: item.active
      ? `¿Está seguro que desea desactivar a ${item.user.name1} ${item.user.lastname1}?`
      : `¿Está seguro que desea activar a ${item.user.name1} ${item.user.lastname1}?`,
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
};

const onSave = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    saveMasterLifeMutations.mutate(masterLife.value);
  }
};

watch(changeStatusMutations.isSuccess, () => {
  if (changeStatusMutations.isSuccess.value) {
    refetchMasterLife();
    showSuccessToast('Visionario desactivado correctamente');
  }
});

watch(changeStatusMutations.isError, () => {
  if (changeStatusMutations.isError.value) {
    const error = changeStatusMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});
watch(saveMasterLifeMutations.isError, () => {
  if (saveMasterLifeMutations.isError.value) {
    const error = saveMasterLifeMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveMasterLifeMutations.isSuccess, () => {
  if (saveMasterLifeMutations.isSuccess.value) {
    validator.value.$reset();
    showForm.value = false;
    masterLife.value = {
      user: {}
    } as MasterLife;
    refetchMasterLife();
  }
});

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = masterLifeData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};
</script>

<template>
  <BaseBreadcrumb :title="'Master life'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <VRow>
    <v-col cols="12">
      <UiParentCard title="Lista de Master life">
        <v-data-table-server
          :headers="headers"
          :search="debouncedSearch"
          :items="masterLifeData.content"
          :loading="isMasterLifeLoading"
          :items-length="masterLifeData.totalElements"
          :items-per-page="10"
          @update:options="loadItems"
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
                v-model="debouncedSearch"
                placeholder="Buscar Usuarios..."
                variant="outlined"
                density="comfortable"
                hide-details
                class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
                bg-color="white"
              >
                <template #prepend-inner>
                  <div class="tw:relative">
                    <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                    <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                  </div>
                </template>
                <template #append v-if="debouncedSearch">
                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    @click="debouncedSearch = ''"
                    class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                  >
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
          <template #item.user.name="{ item }">
            <div class="tw:flex tw:items-center tw:gap-3 tw:overflow-hidden">
              <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                <Icon icon="mdi:account" class="tw:text-gray-600" />
              </div>
              <span class="tw:font-medium tw:truncate tw:w-[30ch]">{{ item.user.name }}</span>
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
                <Icon :icon="item.active ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-2" />
              </template>
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn
                icon
                color="info"
                variant="text"
                size="32"
                class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                v-tooltip="'Editar Staff'"
                @click="onVisionaryEdit(item)"
              >
                <Icon icon="tabler:pencil" height="18" />
              </v-btn>
              <v-btn
                :color="item.active ? 'error' : 'success'"
                icon
                variant="text"
                size="32"
                v-tooltip="item.active ? 'Desactivar' : 'Activar'"
                :class="item.active ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                @click="onChangeStatus(item)"
              >
                <Icon :icon="item.active ? 'mdi-power' : 'mdi-power-off'" height="18" />
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
        </v-data-table-server>
      </UiParentCard>
      <VDialog max-width="500" v-model="showForm">
        <UiParentCard title="Guardar Master Life">
          <VRow>
            <v-col cols="12" md="6">
              <InputSection label="Nombre 1">
                <VTextField
                  placeholder="Nombre 1"
                  v-model="masterLife.user.name1"
                  :error-messages="validator.user.name1.$errors.map((x) => x.$message.toString())"
                />
              </InputSection>
              <InputSection label="Apellido 1">
                <VTextField
                  placeholder="Apellido 1"
                  v-model="masterLife.user.lastname1"
                  :error-messages="validator.user.lastname1.$errors.map((x) => x.$message.toString())"
                />
              </InputSection>
            </v-col>
            <v-col cols="12" md="6">
              <InputSection label="Nombre 2">
                <VTextField
                  placeholder="Nombre 2"
                  v-model="masterLife.user.name2"
                  :error-messages="validator.user.name2.$errors.map((x) => x.$message.toString())"
                />
              </InputSection>
              <InputSection label="Apellido 2">
                <VTextField
                  placeholder="Apellido 2"
                  v-model="masterLife.user.lastname2"
                  :error-messages="validator.user.lastname2.$errors.map((x) => x.$message.toString())"
                />
              </InputSection>
            </v-col>
          </VRow>
          <InputSection label="Correo">
            <VTextField
              placeholder="Correo"
              v-model="masterLife.user.email"
              :error-messages="validator.user.email.$errors.map((x) => x.$message.toString())"
            />
          </InputSection>
          <InputSection label="Teléfono">
            <VTextField
              placeholder="Teléfono"
              v-model="masterLife.user.phone"
              :error-messages="validator.user.phone.$errors.map((x) => x.$message.toString())"
            />
          </InputSection>
          <div class="tw:w-full tw:flex tw:justify-end">
            <VBtn @click="onSave" color="primary" :loading="saveMasterLifeMutations.isPending.value">Guardar</VBtn>
          </div>
        </UiParentCard>
      </VDialog>
    </v-col>
  </VRow>
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
