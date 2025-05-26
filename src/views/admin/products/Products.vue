<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useProducts from '@/composables/admin/products/useProducts';
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

const { productsData, isProductsLoading, page, perPage, search, refetchProducts } = useProducts();

const breadcrumbs = ref([
    {
        title: 'Productos',
        disabled: false,
        href: '#'
    }
]);

const headers = [
    { title: 'Nombre', value: 'name', sortable: true },
    { title: 'Código', value: 'code', sortable: true },
    { title: 'Precio', value: 'basePrice', sortable: true },
    { title: 'Moneda', value: 'currency', sortable: false },
    { title: 'Programas', value: 'programs', sortable: false },
    { title: 'Estado', value: 'active', sortable: true },
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
                            <VBtn variant="elevated" color="primary" @click="() => { }">
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
                        <div>
                            <span v-for="program in item.programs" :key="program.id">({{ program.name }} , {{ program.courseLevel }})</span>
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

                    <template #item.actions="{ item }">
                        <div class="d-flex ga-2">
                            <v-btn icon color="info" variant="text" size="32"
                                class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                                v-tooltip="'Editar Producto'" :to="`/admin/products/edit/${item.id}`">
                                <Icon icon="tabler:pencil" height="18" />
                            </v-btn>
                            <v-btn color="error" icon variant="text" size="32"
                                v-tooltip="item.active ? 'Desactivar' : 'Activar'"
                                :class="item.active ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                                @click="() => { }">
                                <Icon :icon="item.active ? 'mdi-power' : 'mdi-power-off'" height="18" />
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