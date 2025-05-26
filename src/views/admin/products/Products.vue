<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import CreateProduct from '@/components/products/createProduct.vue';
import EditProduct from '@/components/products/editProduct.vue';
import useProducts from '@/composables/admin/products/useProducts';
import useProductMutations from '@/composables/admin/products/useProductMutations';
import usePrograms from '@/composables/programs/usePrograms';
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import type { Product } from '@/models/Products';

const { productsData, isProductsLoading, page, perPage, search, refetchProducts } = useProducts();
const { programs } = usePrograms();

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
        'FOCUS': 'blue',
        'YOUR': 'green',
        'LIFE': 'purple',
    };
    return colors[level.toUpperCase() as LevelKeys] || 'grey';
};

const headers = [
    { title: 'Nombre', value: 'name', sortable: true },
    { title: 'Código', value: 'code', sortable: true },
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

watch(search, () => {
    page.value = 0;
});

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const selectedProduct = ref<Product | null>(null);

const onCreateProduct = () => {
    selectedProduct.value = null;
    showCreateDialog.value = true;
};

const onEditProduct = (id: string) => {
    selectedProduct.value = productsData.value.content.find((p: Product) => p.id === id) || null;
    showEditDialog.value = true;
};

const onChangeStatus = async (item: Product) => {
    try {
        // Aquí iría la lógica para cambiar el estado del producto
        // Por ejemplo: await changeProductStatus(item.id, !item.isActive);
        await refetchProducts();
    } catch (error) {
        console.error('Error al cambiar el estado del producto:', error);
    }
};

const saveProductMutations = useProductMutations().saveProductMutations;
const updateProductMutations = useProductMutations().updateProductMutations;

const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
        await saveProductMutations.mutateAsync(productData as Product);
        await refetchProducts();
        showCreateDialog.value = false;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
};

const handleUpdateProduct = async (productData: Partial<Product>) => {
    try {
        await updateProductMutations.mutateAsync(productData as Product);
        await refetchProducts();
        showEditDialog.value = false;
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
};
</script>

<template>
    <BaseBreadcrumb :title="'Productos'" :breadcrumbs="breadcrumbs" />

    <v-row>
        <v-col cols="12">
            <UiParentCard title="Lista de Productos">
                <v-data-table-server :headers="headers" :search="search" :items="productsData.content"
                    :loading="isProductsLoading" :items-length="productsData.totalElements" :items-per-page="10"
                    @update:options="loadItems">
                    <template v-slot:top>
                        <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                            :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200"
                            :duration="250">
                            <VTextField v-model="search" placeholder="Buscar productos..." variant="outlined"
                                density="comfortable" hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
                                bg-color="white">
                                <template #prepend-inner>
                                    <div class="tw:relative">
                                        <Icon icon="mdi:magnify" height="18"
                                            class="tw:text-primary tw:relative tw:z-10" />
                                        <div
                                            class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
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
                            <VBtn variant="elevated" color="primary" @click="onCreateProduct">
                                <Icon class="mr-2" icon="mdi:plus" />
                                Agregar Producto
                            </VBtn>
                        </v-toolbar>
                    </template>

                    <template #item.name="{ item }">
                        <div class="tw:flex tw:items-center tw:gap-3 tw:overflow-hidden">
                            <div
                                class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                                <Icon icon="mdi:package-variant" class="tw:text-gray-600" />
                            </div>
                            <span class="tw:font-medium">{{ item.name }}</span>
                        </div>
                    </template>
                    <template #item.programs="{ item }">
                        <div class="d-flex flex-wrap gap-2">
                            <v-chip v-for="program in item.programs" :key="program.id" size="small" variant="outlined"
                                class="text-caption mr-2" :color="getProgramColor(program.courseLevel)">
                                {{ program.courseLevel }}
                            </v-chip>
                        </div>
                    </template>
                    <template #item.isActive="{ item }">
                        <VChip :color="item.isActive ? 'success' : 'error'" size="small" variant="flat"
                            class="!tw:font-normal tw:text-xs !tw:min-w-[80px]"
                            :class="item.isActive ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'">
                            <template #prepend>
                                <Icon :icon="item.isActive ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-2" />
                            </template>
                            {{ item.isActive ? 'Activo' : 'Inactivo' }}
                        </VChip>
                    </template>

                    <template #item.actions="{ item }">
                        <div class="d-flex ga-2">
                            <v-btn icon color="info" variant="text" size="32"
                                class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                                v-tooltip="'Editar Producto'" @click="onEditProduct(item.id)">
                                <Icon icon="tabler:pencil" height="18" />
                            </v-btn>
                            <v-btn color="error" icon variant="text" size="32"
                                v-tooltip="item.isActive ? 'Desactivar' : 'Activar'"
                                :class="item.isActive ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                                @click="onChangeStatus(item)">
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
    <CreateProduct 
    v-model:modelValue="showCreateDialog" 
    :programs="programs || []" 
    @save="handleSaveProduct" 
/>

<EditProduct 
    v-if="selectedProduct"
    v-model:modelValue="showEditDialog" 
    :product="selectedProduct"
    @save="handleUpdateProduct"
    @cancel="showEditDialog = false"
/>
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
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
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