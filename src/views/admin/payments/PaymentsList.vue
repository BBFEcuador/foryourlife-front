<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePayments from '@/composables/admin/payments/usePayments';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { paymentsData, isPaymentsLoading, page, perPage, search, refetchPayments } = usePayments();
const breadcrumbs = ref([
    {
        title: 'Cobros',
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
                perPage.value = paymentsData.value.totalElements;
            } else {
                perPage.value = data.itemsPerPage;
            }
        }
    }
};
const router = useRouter();
const onCreatePayment = () => {
    router.push({ name: 'payments-admin-create' });
};

</script>

<template>
    <BaseBreadcrumb :title="'Cobros'" :breadcrumbs="breadcrumbs" />
    <UiParentCard title="Lista de Cobros">
        <v-data-table-server :headers="headers" :search="search" :items="paymentsData.content"
            :loading="isPaymentsLoading" :items-length="paymentsData.totalElements" :items-per-page="10"
            @update:options="loadItems">
            <template v-slot:top>
                <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                    :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                    <VTextField v-model="search" placeholder="Buscar cobros..." variant="outlined" density="comfortable"
                        hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm" bg-color="white">
                        <template #prepend-inner>
                            <div class="tw:relative">
                                <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
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
                    <VBtn variant="elevated" color="primary" @click="onCreatePayment">
                        <Icon class="mr-2" icon="mdi:plus" />
                        Crear Cobro
                    </VBtn>
                </v-toolbar>
            </template>
        </v-data-table-server>
    </UiParentCard>
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