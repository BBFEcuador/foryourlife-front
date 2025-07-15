<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useProducts from '@/composables/admin/products/useProducts';
import useProductMutations from '@/composables/admin/products/useProductMutations';
import useContificoProductsMutation from '@/composables/admin/contifico/useContificoProducts';
import editProduct from '@/components/products/editProduct.vue';
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import type { Product } from '@/models/Products';
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';
import { showErrorToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { adminStore } from '@/stores/adminStore';
import CreateProduct from '@/components/products/createProduct.vue';

const { productsData, isProductsLoading, page, perPage, productSearch, refetchProducts } = useProducts();
const { changeStatusMutations, updateProductMutations, saveProductMutations } = useProductMutations();
const { useContificoSyncProductsMutation, isSyncProductLoading } = useContificoProductsMutation();

const store = adminStore();
const disabledProperty = !store.isCampusSelected;

const breadcrumbs = ref([
  {
    title: 'Productos',
    disabled: false,
    href: '#'
  }
]);

const getProgramColor = (level: string): string => {
  type LevelKeys = 'FOCUS' | 'YOUR' | 'LIFE';
  const colors: Record<LevelKeys, string> = {
    FOCUS: 'blue',
    YOUR: 'green',
    LIFE: 'purple'
  };
  return colors[level.toUpperCase() as LevelKeys] || 'grey';
};

const headers = [
  { title: 'Nombre', value: 'name', sortable: true },
  { title: 'Campus', value: 'campus.city', sortable: true },
  { title: 'Precio', value: 'basePrice', sortable: true },
  { title: 'Moneda', value: 'currency', sortable: false },
  { title: 'Programas', value: 'programs', sortable: false },
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
        perPage.value = productsData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

watch(productSearch, () => {
  page.value = 0;
});

const showEditDialog = ref(false);
const showCreateDialog = ref(false);
const selectedProduct = ref<Product | null>(null);

const onEditProduct = (id: string) => {
  selectedProduct.value = productsData.value.content.find((p: Product) => p.id === id) || null;
  showEditDialog.value = true;
};

const onChangeStatus = async (item: Product) => {
  const isCurrentlyActive = item.isActive;
  const action = isCurrentlyActive ? 'desactivar' : 'activar';
  const confirmText = isCurrentlyActive ? 'Desactivar' : 'Activar';
  const confirmColor = isCurrentlyActive ? '#d33' : '#3085d6';

  Swal.fire({
    title: `¿Estás seguro de ${action} este Producto?`,
    text: `Estás a punto de ${action} el Producto ${item.name}. ¿Deseas continuar?`,
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
          isActive: !isCurrentlyActive
        });
        Swal.fire('¡Éxito!', `El producto ha sido ${!isCurrentlyActive ? 'activado' : 'desactivado'} correctamente.`, 'success');
      } catch (error) {
        console.error('Error al cambiar el estado del producto:', error);
        Swal.fire('Error', 'No se pudo actualizar el estado del producto', 'error');
      }
    }
  });
};

watch(changeStatusMutations.isSuccess, () => {
  if (changeStatusMutations.isSuccess.value) {
    refetchProducts();
    toast.success('Acción Exitosa', {
      autoClose: 3000,
      closeButton: true
    });
  }
});

watch(changeStatusMutations.isError, () => {
  if (changeStatusMutations.isError.value) {
    const error = changeStatusMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

const syncContificoProducts = () => {
  if (!store.isCampusSelected) {
    toast.error('Seleccione un campus para sincronizar');
    return;
  }

  useContificoSyncProductsMutation(store.selectCampusId, {
    onSuccess() {
      toast.success('Productos actualizados correctamente');
      refetchProducts();
    },
    onError(error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};

const saveProduct = (product: Partial<Product>) => {
  const productReq: Product = {
    id: product.id!!,
    name: product.name!!,
    code: product.code!!,
    basePrice: product.basePrice!!,
    currency: product.currency!!,
    isActive: product.isActive!!,
    description: product.description!!,
    rules: product.rules!!,
    programs: product.programs!!,
    campus: product.campus!!
  };
  saveProductMutations.mutate(productReq, {
    onSuccess: async () => {
      showCreateDialog.value = false;
      toast.success('Producto creado exitosamente');
      await refetchProducts();
    },
    onError(error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};

const updateProduct = async (product: Omit<Product, 'id'> & { id?: string }) => {
  await updateProductMutations.mutateAsync(product as Product, {
    onSuccess: () => {
      showEditDialog.value=false
      toast.success('Producto actualizado correctamente');
      refetchProducts()
    },
    onError(error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};
</script>

<template>
  <BaseBreadcrumb :title="'Productos'" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12">
      <UiParentCard title="Lista de Productos">
        <v-data-table-server
          :headers="headers"
          :search="productSearch"
          :items="productsData.content"
          :loading="isProductsLoading || isSyncProductLoading"
          :items-length="productsData.totalElements"
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
                v-model="productSearch"
                placeholder="Buscar productos..."
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
                <template #append v-if="productSearch">
                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    @click="productSearch = ''"
                    class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                  >
                    <Icon icon="mdi:close" height="18" />
                  </VBtn>
                </template>
              </VTextField>
              <v-spacer></v-spacer>
              <VBtn
                class="ml-2"
                variant="elevated"
                color="info"
                @click="syncContificoProducts"
                :disabled="disabledProperty"
                :loading="isSyncProductLoading"
              >
                <Icon class="mr-2" icon="mdi:reload" />
                Actualizar productos de contifico
              </VBtn>
              <VBtn
                class="ml-2"
                variant="elevated"
                color="primary"
                @click="showCreateDialog = true"
                :disabled="disabledProperty"
                :loading="isSyncProductLoading"
              >
                <Icon class="mr-2" icon="mdi:add" />
                Agregar producto
              </VBtn>
            </v-toolbar>
          </template>

          <template #item.name="{ item }">
            <div class="tw:flex tw:items-center tw:gap-3 tw:overflow-hidden">
              <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                <Icon icon="mdi:package-variant" class="tw:text-gray-600" />
              </div>
              <span class="tw:font-medium">{{ item.name }}</span>
            </div>
          </template>
          <template #item.programs="{ item }">
            <div v-if="item.programs.length > 0" class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="program in item.programs"
                :key="program.id"
                size="small"
                variant="outlined"
                class="text-caption mr-2"
                :color="getProgramColor(program.courseLevel)"
              >
                {{ program.courseLevel }}
              </v-chip>
            </div>
            <div v-else class="d-flex flex-wrap text-wrap gap-2 text-red">¡Este producto no tiene programas asignados!</div>
          </template>
          <template #item.isActive="{ item }">
            <VChip
              :color="item.isActive ? 'success' : 'error'"
              size="small"
              variant="flat"
              class="!tw:font-normal tw:text-xs !tw:min-w-[80px]"
              :class="item.isActive ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'"
            >
              <template #prepend>
                <Icon :icon="item.isActive ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-2" />
              </template>
              {{ item.isActive ? 'Activo' : 'Inactivo' }}
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
                v-tooltip="'Editar Producto'"
                @click="onEditProduct(item.id)"
              >
                <Icon icon="tabler:pencil" height="18" />
              </v-btn>
              <v-btn
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

          <template #loading>
            <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
          </template>

          <template #no-data>
            <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
              <Icon icon="mdi:package-variant-remove" height="48" class="tw:mb-4" />
              <p class="tw:text-lg">No se encontraron productos</p>
              <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          </template>
        </v-data-table-server>
      </UiParentCard>
    </v-col>
  </v-row>

  <CreateProduct :model-value="showCreateDialog" @cancel="showCreateDialog = false" @save="" />
  <editProduct :model-value="showEditDialog" :product="selectedProduct" @save="updateProduct" @cancel="showEditDialog = false" />
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
