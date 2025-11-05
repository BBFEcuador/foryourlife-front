<script setup lang="ts">
import CreateCashBox from '@/components/cashDrawer/CreateCashBox.vue';
import CreateCashDrawer from '@/components/cashDrawer/CreateCashDrawer.vue';
import CreateStore from '@/components/cashDrawer/CreateStore.vue';
import useContificoPosMutation from '@/composables/admin/contifico/useContificoPos';
import useCashBoxes from '@/composables/admin/pos/useCashBoxes';
import useCashBoxMutation from '@/composables/admin/pos/useCashBoxMutation';
import useCashDrawerMutation from '@/composables/admin/pos/useCashDrawerMutation';
import useStoreMutations from '@/composables/admin/pos/useStoreMutations';
import useStores from '@/composables/admin/pos/useStores';
import type { CashBox, CashBoxRequest, StoreRequest } from '@/models/CashDrawer';
import { router } from '@/router';
import { adminStore } from '@/stores/adminStore';
import { hasPermission, PermissionEnum } from '@/utils/locales/PermissionEnum.ts';
import { Icon } from '@iconify/vue';
import type { AxiosError } from 'axios';
import { computed, ref } from 'vue';
import { toast } from 'vue3-toastify';

const { cashBoxes, isCashBoxesLoading, refetchCashBoxes } = useCashBoxes();
const { storesData, isStoresDataLoading, refetchStoresData } = useStores();
const { saveCashBoxMutation } = useCashBoxMutation();
const { openCashDrawerMutation } = useCashDrawerMutation();
const { useContificoSyncPosMutations, isSyncPosLoading } = useContificoPosMutation();
const { saveStoreMutation } = useStoreMutations();
const { closeCashDrawerMutation } = useCashDrawerMutation();

const store = adminStore();
const showCreateCashBox = ref(false);
const showCreateStore = ref(false);
const auxCashBox = ref<CashBox>({} as CashBox);
const showCreateCashDrawer = ref(false);

const userIdref = ref(store.user.user.id);
const disabledProperty = ref(!store.isCampusSelected);

const sortedCashDrawers = computed(() => cashBoxes.value?.slice().sort((a, b) => parseInt(a.number) - parseInt(b.number)) || []);

function formatDate(dateStr: string): string {
  const [date, time] = dateStr.split('T');
  return `${date} ${time.slice(0, 5)}`;
}

const handleSaveCashBox = async (cashBox: Partial<CashBox>) => {
  const payload: CashBoxRequest = {
    ...(cashBox as CashBox),
    user: store.user.user
  };

  await saveCashBoxMutation.mutateAsync(payload, {
    onSuccess: () => {
      toast.success('Caja creada exitosamente');
      showCreateCashBox.value = false;
      refetchCashBoxes();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al crear caja');
    }
  });
};

const handleOpenCashDrawer = async (cashBox: CashBox) => {
  if (store.isCashDrawerOpen) {
    router.push({ name: 'payments-admin-create' });
  } else {
    auxCashBox.value = cashBox;
    showCreateCashDrawer.value = true;
  }
};

const openCashDrawer = async (cashDrawerData: { openingBalance: number; details: string }) => {
  const cashDrawer = {
    cashBoxId: auxCashBox.value.id,
    openingBalance: cashDrawerData.openingBalance,
    detail: cashDrawerData.details
  };
  openCashDrawerMutation.mutate(cashDrawer, {
    onSuccess: (response) => {
      store.setCashDrawer(response);
      store.setCashDrawerOpen(true);
      toast.success('Caja abierta exitosamente');

      router.push({ name: 'payments-admin-create' });
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};

const syncPos = async () => {
  await useContificoSyncPosMutations(undefined, {
    onSuccess: () => {
      toast.success('Sincronización exitosa');
      refetchStoresData();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al sincronizar');
    }
  });
};

const saveStore = (store: StoreRequest) => {
  saveStoreMutation.mutate(store, {
    onSuccess: () => {
      toast.success('Establecimiento guardado exitosamente');
      showCreateStore.value = false;
      refetchStoresData();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al guardar el establecimiento');
    }
  });
};

const handleCloseCashDrawer = async () => {
  const cashDrawer = {
    cashDrawerId: store.cashDrawer.cashBox.id,
    userId: userIdref.value
  };
  await closeCashDrawerMutation.mutateAsync(cashDrawer, {
    onSuccess: (data) => {
      if (data) {
        const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Cierre_Caja_${new Date().toLocaleDateString('es-EC').replace('/', '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      toast.success('Caja cerrada exitosamente');
      store.setCashDrawer({});
      store.setCashDrawerOpen(false);
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};
</script>

<template>
  <v-card variant="text" class="d-flex align-center mb-2">
    <h3 class="text-h3 font-weight-bold">Cajas disponibles</h3>
    <v-spacer></v-spacer>
    <div class="d-flex tw:flex-wrap tw:gap-2 tw:justify-end">
      <v-btn variant="flat" color="success" @click="router.push({ name: 'payments-admin' })">
        <Icon icon="mdi:eye" class="mr-2"></Icon>
        <span class="">Ver pagos</span>
      </v-btn>
      <v-btn color="primary" @click="showCreateCashBox = true" :disabled="disabledProperty">
        <Icon icon="mdi:plus" class="mr-2" />
        Nueva caja
      </v-btn>
    </div>
    <CreateCashBox
      :model-value="showCreateCashBox"
      :is-loading="isCashBoxesLoading"
      @cancel="showCreateCashBox = false"
      @save="handleSaveCashBox"
      :stores="storesData"
    />
  </v-card>

  <div v-if="disabledProperty" class="d-flex flex-column align-center justify-center py-12 text-grey">
    <Icon icon="cil:warning" height="48" class="mb-4" />
    <p class="text-subtitle-1">Elija un campus para ver las Cajas Disponibles</p>
  </div>

  <v-card v-else variant="text">
    <div v-if="isCashBoxesLoading" class="d-flex justify-center align-center pa-5">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-row v-else-if="sortedCashDrawers.length" dense>
      <v-col v-for="cashBox in sortedCashDrawers" :key="cashBox.id" cols="12" md="4">
        <v-card variant="outlined" class="h-100 d-flex flex-column justify-space-between">
          <v-card-item>
            <div class="d-flex justify-space-between align-start text-h4 mb-2">
              <span class="text-wrap">Caja No. {{ cashBox.number }}</span>
            </div>

            <v-chip :color="cashBox.isActive ? 'success' : 'red'" class="me-1">
              {{ cashBox.isActive ? 'Activa' : 'Inactiva' }}
            </v-chip>

            <div>Creada por: {{ cashBox.createdBy }}</div>
            <div>Fecha de creación: {{ formatDate(cashBox.createdDate) }}</div>
          </v-card-item>

          <v-card-actions class="pa-3 d-flex flex-wrap gap-2">
            <div v-if="store.isCashDrawerOpen && store.cashDrawer.cashBox.id === cashBox.id">
              <v-btn class="flex-grow" variant="tonal" color="success" @click="handleOpenCashDrawer(cashBox)">
                <Icon icon="hugeicons:save-money-dollar" class="mr-1" />
                Crear cobros
              </v-btn>
              <v-btn variant="tonal" class="flex-grow ml-2" color="error" @click="handleCloseCashDrawer">
                <Icon icon="mdi:lock" class="mr-1" />
                Cerrar Caja
              </v-btn>
            </div>
            <v-btn v-if="!store.isCashDrawerOpen" class="flex-grow" variant="tonal" color="primary" @click="handleOpenCashDrawer(cashBox)">
              <Icon icon="mdi:key" class="mr-1" />
              Abrir Caja
            </v-btn>
            <v-btn
              class="flex-grow"
              variant="tonal"
              color="info"
              @click="
                router.push({
                  name: 'cash-drawer-balances',
                  params: { id: cashBox.id }
                })
              "
            >
              <Icon icon="mdi:eye" class="mr-1" />
              Ver balances de caja
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="d-flex flex-column align-center justify-center py-12 text-grey">
      <Icon icon="mdi:cash-register" height="48" class="mb-4" />
      <p class="text-subtitle-1">No se encontraron cajas</p>
      <p class="text-body-2">Intenta crear una nueva</p>
    </div>
  </v-card>

  <v-card variant="text" class="d-flex align-center mt-4 mb-4">
    <h3 class="text-h3 font-weight-bold">Establecimientos</h3>
    <v-spacer />
    <div class="d-flex tw:flex-wrap tw:gap-2 tw:justify-end">
      <v-btn :loading="isSyncPosLoading" color="info" @click="syncPos" :disabled="disabledProperty">
        <Icon icon="mdi:reload" class="mr-1" />
        <span class="d-none d-sm-flex"> Sincronizar establecimientos de Contifico </span>
      </v-btn>
      <v-btn v-if="hasPermission(PermissionEnum.CREATE_EMISSION_POINTS)" color="primary" @click="showCreateStore = true" :disabled="disabledProperty">
        <Icon icon="mdi:add" class="mr-1" />
        <span class="d-none d-sm-flex">Agregar establecimiento</span>
      </v-btn>
    </div>
    <CreateStore :model-value="showCreateStore" @cancel="showCreateStore = false" @save="saveStore" />
  </v-card>

  <div v-if="disabledProperty" class="d-flex flex-column align-center justify-center py-12 text-grey">
    <Icon icon="cil:warning" height="48" class="mb-4" />
    <p class="text-subtitle-1">Elija un campus para ver los establecimientos</p>
  </div>

  <v-card variant="text" v-else>
    <div v-if="isStoresDataLoading || isSyncPosLoading" class="d-flex justify-center align-center pa-5">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-row v-else-if="storesData.length" dense>
      <v-col v-for="store in storesData" :key="store.id" cols="12" md="4">
        <v-card variant="outlined" class="h-100 d-flex flex-column justify-space-between">
          <v-card-item>
            <div class="d-flex justify-space-between align-start text-h4 mb-2">
              <span class="text-wrap">Establecimiento No. {{ store.number }}</span>
            </div>
            <div>{{ store.address }}</div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="d-flex flex-column align-center justify-center py-12 text-grey">
      <Icon icon="mdi:cash-register" height="48" class="mb-4" />
      <p class="text-subtitle-1">No se encontraron puntos de venta</p>
      <p class="text-body-2">Intenta sincronizar los datos</p>
    </div>

    <CreateCashDrawer
      :model-value="showCreateCashDrawer"
      :is-loading="openCashDrawerMutation.isPending.value"
      @cancel="showCreateCashDrawer = false"
      @save="openCashDrawer"
    />
  </v-card>
</template>
