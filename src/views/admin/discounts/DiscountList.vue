<script setup lang="ts">
import CreateDiscount from '@/components/discounts/CreateDiscount.vue';
import EditDiscount from '@/components/discounts/EditDiscount.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useDiscounts from '@/composables/admin/discounts/useDiscounts';
import useDiscountMutations from '@/composables/admin/discounts/useDiscountsMutations';
import type { Discount } from '@/models/Discount';
import { Icon } from '@iconify/vue/dist/iconify.js';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const breadcrumbs = ref([
  {
    title: 'Descuentos',
    disabled: false,
    href: '#'
  }
]);

const { discountsData, page, perPage, search, setSearch, isDiscountsError, isDiscountsLoading, refetchDiscounts } = useDiscounts();
const { saveDiscountMutations, updateDiscountMutations, changeStatusMutations } = useDiscountMutations();
const headers = [
  { title: 'Nombre', value: 'name', sortable: true },
  { title: 'Tipo', value: 'discountType', sortable: true },
  { title: 'Valor', value: 'discountValue', sortable: true },
  { title: 'Autoriza Supervisión', value: 'needSupervision', sortable: false },
  { title: 'Estado', value: 'isActive', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }

  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = discountsData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

const onChangeStatus = async (item: Discount) => {
  const isCurrentlyActive = item.isActive;
  const action = isCurrentlyActive ? 'desactivar' : 'activar';
  const confirmText = isCurrentlyActive ? 'Desactivar' : 'Activar';
  const confirmColor = isCurrentlyActive ? '#d33' : '#3085d6';

  Swal.fire({
    title: `¿Estás seguro de ${action} este Descuento?`,
    text: `Estás a punto de ${action} el Descuento ${item.name}. ¿Deseas continuar?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar'
  }).then(async (params) => {
    if (params.isConfirmed) {
      try {
        await changeStatusMutations.mutateAsync({
          id: item.id,
          status: !isCurrentlyActive
        });
        refetchDiscounts();
        Swal.fire('¡Éxito!', `El descuento ha sido ${!isCurrentlyActive ? 'activado' : 'desactivado'} correctamente.`, 'success');
      } catch (error) {
        console.error('Error al cambiar el estado del descuento:', error);
        Swal.fire('Error', 'No se pudo actualizar el estado del descuento', 'error');
      }
    }
  });
};
watch(search, () => {
  page.value = 0;
});

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const selectedDiscount = ref<Discount | null>(null);

const onCreateDiscount = () => {
  selectedDiscount.value = null;
  showCreateDialog.value = true;
};

const onEditDiscount = (id: string) => {
  selectedDiscount.value = discountsData.value.content.find((d: Discount) => d.id === id) || null;
  showEditDialog.value = true;
};

const handleSaveDiscount = async (discountData: Partial<Discount>) => {
  await saveDiscountMutations.mutateAsync(discountData as Discount);
  await refetchDiscounts();
  showCreateDialog.value = false;
  toast.success('Descuento guardado exitosamente');
};

const handleUpdateDiscount = async (discountData: Partial<Discount>) => {
  await updateDiscountMutations.mutateAsync(discountData as Discount);
  await refetchDiscounts();
  showEditDialog.value = false;
  toast.success('Descuento actualizado exitosamente');
};
</script>

<template>
  <BaseBreadcrumb :title="'Descuentos'" :breadcrumbs="breadcrumbs" />
  <div v-if="checkPermission(PermissionEnum.SEE_DISCOUNTS)">
    <v-row>
      <v-col cols="12">
        <UiParentCard title="Lista de Descuentos">
          <v-data-table-server
            :headers="headers"
            :search="search"
            :items="discountsData.content"
            :loading="isDiscountsLoading"
            :items-length="discountsData.totalElements"
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
                  :model-value="search"
                  @update:model-value="setSearch"
                  placeholder="Buscar descuentos..."
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
                  <template #append v-if="search">
                    <VBtn
                      icon
                      variant="text"
                      size="small"
                      @click="setSearch('')"
                      class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                    >
                      <Icon icon="mdi:close" height="18" />
                    </VBtn>
                  </template>
                </VTextField>
                <v-spacer></v-spacer>
                <VBtn v-if="checkPermission(PermissionEnum.CREATE_DISCOUNTS)" variant="elevated" color="primary" @click="onCreateDiscount">
                  <Icon class="mr-2" icon="mdi:plus" />
                  Agregar Descuento
                </VBtn>
              </v-toolbar>
            </template>
            <template #item.discountType="{ item }">
              <VChip
                :color="item.discountType === 'P' ? 'primary' : 'info'"
                size="small"
                variant="flat"
                class="!tw:font-medium tw:text-xs !tw:min-w-[100px] tw:justify-center"
                :class="{
                  'tw:bg-blue-50 !tw:text-blue-700': item.discountType === 'P',
                  'tw:bg-cyan-50 !tw:text-cyan-700': item.discountType === 'E'
                }"
              >
                <Icon :icon="item.discountType === 'P' ? 'mdi:percent' : 'mdi:cash-multiple'" class="mr-1" height="16" />
                {{ item.discountType === 'P' ? 'Porcentaje' : 'Efectivo' }}
              </VChip>
            </template>

            <template #item.discountValue="{ item }">
              <div class="tw:flex tw:items-center tw:gap-1">
                <span class="tw:font-medium">
                  {{ item.discountValue }}
                </span>
                <span class="tw:text-gray-500 tw:text-sm">
                  {{ item.discountType === 'P' ? '%' : 'USD' }}
                </span>
              </div>
            </template>

            <template #item.needSupervision="{ item }">
              <VChip
                :color="item.needSupervision ? 'warning' : 'success'"
                size="small"
                variant="tonal"
                class="!tw:font-medium tw:text-xs !tw:min-w-[100px] tw:justify-center"
                :class="{
                  'tw:bg-amber-50 !tw:text-amber-700': item.needSupervision,
                  'tw:bg-green-50 !tw:text-green-700': !item.needSupervision
                }"
              >
                <Icon :icon="item.needSupervision ? 'mdi:shield-account' : 'mdi:shield-check'" class="mr-1" height="16" />
                {{ item.needSupervision ? 'Requiere aprobación' : 'No requiere aprobación' }}
              </VChip>
            </template>

            <template #item.isActive="{ item }">
              <VChip
                :color="item.isActive ? 'success' : 'error'"
                size="small"
                variant="flat"
                class="!tw:font-medium tw:text-xs !tw:min-w-[80px] tw:justify-center"
                :class="item.isActive ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'"
              >
                <Icon :icon="item.isActive ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-1" height="16" />
                {{ item.isActive ? 'Activo' : 'Inactivo' }}
              </VChip>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-2">
                <v-btn
                  v-if="checkPermission(PermissionEnum.UPDATE_DISCOUNTS)"
                  icon
                  color="info"
                  variant="text"
                  size="32"
                  class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                  v-tooltip="'Editar Descuento'"
                  @click="onEditDiscount(item.id)"
                >
                  <Icon icon="tabler:pencil" height="18" />
                </v-btn>
                <v-btn
                  v-if="checkPermission(PermissionEnum.DELETE_DISCOUNTS)"
                  color="error"
                  icon
                  variant="text"
                  size="32"
                  v-tooltip="item.isActive ? 'Desactivar' : 'Activar'"
                  :class="item.isActive ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                  @click="onChangeStatus(item)"
                >
                  <Icon :icon="item.isActive ? 'mdi-power' : 'mdi-power-off'" height="18" />
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </UiParentCard>
      </v-col>
    </v-row>
    <CreateDiscount
      v-if="checkPermission(PermissionEnum.CREATE_DISCOUNTS)"
      v-model:modelValue="showCreateDialog"
      :discount="selectedDiscount"
      @save="handleSaveDiscount"
      @cancel="showCreateDialog = false"
    />
    <EditDiscount
      v-if="selectedDiscount && checkPermission(PermissionEnum.UPDATE_DISCOUNTS)"
      v-model:modelValue="showEditDialog"
      :discount="selectedDiscount"
      @save="handleUpdateDiscount"
      @cancel="showEditDialog = false"
    />
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-data-table :deep(td) {
  font-size: 0.875rem;
  color: #334155;
  padding: 16px;
}

.v-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: background-color 0.2s ease;
}
</style>
