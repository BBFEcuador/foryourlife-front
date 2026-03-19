<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { router } from '@/router';
import { adminStore } from '@/stores/adminStore';
import { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';
import { checkPermission } from '@/service/ability';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import type { Store } from '@/models/CashDrawer';
import StoresList from '@/components/cashDrawer/StoresList.vue';
import StoreInfo from '@/components/cashDrawer/StoreInfo.vue';
import StoreCashBoxes from '@/components/cashDrawer/StoreCashBoxes.vue';
import useCashDrawerOpenedByUser from '@/composables/admin/pos/useCashDrawerOpenedByUser';

const selectedStore = ref<Store | null>(null);
const store = adminStore();
const userIdref = ref(store.user.user.id);
const { cashDrawer, refetchCashDrawerOpenedByUser, isCashDrawerOpenedByUserLoading } = useCashDrawerOpenedByUser(userIdref.value);
const breadcrumbs = ref([
  {
    title: 'Cajas disponibles',
    disabled: false,
    href: '/admin'
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="'Cajas disponibles'" :breadcrumbs="breadcrumbs" class="tw:mb-6">
    <template #action>
      <v-btn
        v-if="checkPermission(PermissionEnum.SEE_PAYMENTS)"
        variant="flat"
        color="success"
        @click="router.push({ name: 'payments-admin' })"
      >
        <Icon icon="mdi:eye" class="mr-2"></Icon>
        <span class="">Ver pagos</span>
      </v-btn>
    </template>
  </BaseBreadcrumb>
  <div class="tw:mt-5" v-if="checkPermission(PermissionEnum.SEE_EMISSION_POINTS)">
    <v-row>
      <v-col cols="12" md="3" sm="12">
        <StoresList :selected-store="selectedStore" @update:selectedStore="selectedStore = $event" />
      </v-col>
      <v-col cols="12" md="9" sm="12">
        <div v-if="selectedStore">
          <StoreInfo :selected-store="selectedStore" />
          <StoreCashBoxes
            :key="selectedStore?.id"
            :selected-store="selectedStore"
            :cashDrawer="cashDrawer"
            @reloadStoreCashByUser="refetchCashDrawerOpenedByUser"
            :isLoadingCashDrawerOpenedByUser="isCashDrawerOpenedByUserLoading"
          />
        </div>
        <div v-else class="d-flex flex-column align-center justify-center py-12 text-grey">
          <Icon icon="mdi:store" height="48" class="mb-4" />
          <p class="text-subtitle-1">Seleccione un establecimiento para ver las cajas disponibles</p>
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" class="mt-5" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>
