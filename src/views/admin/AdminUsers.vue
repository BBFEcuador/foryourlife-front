<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { VDataTable, VProgressCircular } from 'vuetify/lib/components/index.mjs';

import { router } from '@/router';


const headers = [
    { title: 'Creación', value: 'company.created_at', class: 'my-header-style' },
    { title: 'Nombre', value: 'company.owner.name', class: 'my-header-style' },
    { title: 'Teléfono', value: 'company.owner.phone' },
    { title: 'RUCs Creados', value: 'rucs' },
    { title: 'Doc Disponibles', value: 'vouchers' },
    { title: 'Descargados SRI', value: 'downloadedVouchers' },
    { title: 'Plan', value: 'plan' },
    { title: 'Acciones', value: 'actions' },
];

const showPlanView = (id:string) => {
    router.push({ name: 'change-plan', params: { id: id }})
};


const tab = ref('Factura');
</script>
<template>
    <v-card elevation="1" class="revenue-products">
        <v-card-item class="pb-4">
            <div class="gap-3 d-flex align-center justify-space-between">
                <v-card-title>
                    <h1 class="text-h5">Usuarios</h1>
                </v-card-title>
            </div>
            <div class="mt-4">
                <v-data-table class="border rounded-md datatabels" :headers="headers">
                    <template v-slot:item.company.created_at="{ item }">
                        <div class="tw-flex tw-gap-2 tw-items-center">
                            <p>ola</p>
                        </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <div class="gap-3 d-flex">
                            <VBtn variant="text" size="x-small" icon @click="showPlanView(item.company.id)">
                                <Icon icon="material-symbols:edit-square-outline" height="20"
                                    class="cursor-pointer text-success" size="small" />
                            </VBtn>
                        </div>
                    </template>
                </v-data-table>
            </div>
        </v-card-item>

    </v-card>
</template>
