<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import useCashDrawerMutation from '@/composables/admin/pos/useCashDrawerMutation';
import useCashBoxMutation from '@/composables/admin/pos/useCashBoxMutation';
import CreateCashBox from '@/components/cashDrawer/CreateCashBox.vue';
import { adminStore } from '@/stores/adminStore';
import type { CashBox, CashBoxRequest, StoreRequest } from '@/models/CashDrawer';
import type { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import useCashBoxes from '@/composables/admin/pos/useCashBoxes';
import { router } from '@/router';
import CreateCashDrawer from '@/components/cashDrawer/CreateCashDrawer.vue';
import useContificoPosMutation from '@/composables/admin/contifico/useContificoPos';
import useStores from '@/composables/admin/pos/useStores';
import CreateStore from '@/components/cashDrawer/CreateStore.vue';
import useStoreMutations from '@/composables/admin/pos/useStoreMutations';

const { cashBoxes, isCashBoxesLoading, refetchCashBoxes } = useCashBoxes();
const { storesData, isStoresDataLoading, refetchStoresData } = useStores();
const { saveCashBoxMutation } = useCashBoxMutation();
const { openCashDrawerMutation } = useCashDrawerMutation();
const { useContificoSyncPosMutations, isSyncPosLoading } = useContificoPosMutation();
const { saveStoreMutation } = useStoreMutations();

const store = adminStore();
const showCreateCashBox = ref(false);
const showCreateStore = ref(false);
const auxCashBox = ref<CashBox>({} as CashBox);
const showCreateCashDrawer = ref(false);

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
  auxCashBox.value = cashBox;
  showCreateCashDrawer.value = true;
};

const openCashDrawer = async (cashDrawerData: { openingBalance: number; details: string }) => {
  const cashDrawer = {
    cashBoxId: auxCashBox.value.id,
    userId: auxCashBox.value.createdBy.id,
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
</script>

<template>
  <div class="d-flex align-center pb-4">
    <h3 class="text-h3 font-weight-bold">Cajas disponibles</h3>
    <v-spacer />
    <v-btn color="success" @click="router.push({ name: 'payments-admin' })" class="mr-2">
      <Icon icon="mdi:eye" class="mr-2" />
      Ver Pagos
    </v-btn>
    <v-btn color="primary" @click="showCreateCashBox = true" :disabled="disabledProperty">
      <Icon icon="mdi:plus" class="mr-2" />
      Nueva caja
    </v-btn>
    <CreateCashBox
      :model-value="showCreateCashBox"
      :is-loading="isCashBoxesLoading"
      @cancel="showCreateCashBox = false"
      @save="handleSaveCashBox"
      :stores="storesData"
    />
  </div>

  <div v-if="disabledProperty" class="d-flex flex-column align-center justify-center py-12 text-grey">
    <Icon icon="cil:warning" height="48" class="mb-4" />
    <p class="text-subtitle-1">Elija un campus para ver las Cajas Disponibles</p>
  </div>
  <div v-else>
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

            <div>Creada por: {{ cashBox.createdBy.name }}</div>
            <div>Fecha de creación: {{ formatDate(cashBox.created_at) }}</div>
          </v-card-item>

          <v-card-actions class="pa-3 d-flex flex-wrap gap-2">
            <v-btn class="flex-grow" variant="tonal" color="primary" @click="handleOpenCashDrawer(cashBox)">
              <Icon icon="mdi:key" class="mr-1" />
              Abrir Caja
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
  </div>

  <div class="d-flex align-center pb-4 mt-4">
    <h3 class="text-h3 font-weight-bold">Establecimientos</h3>
    <v-spacer />
    <v-btn :loading="isSyncPosLoading" color="info" @click="syncPos" class="mr-2" :disabled="disabledProperty">
      <Icon icon="mdi:reload" class="mr-2" />
      Sincronizar establecimientos de Contifico
    </v-btn>
    <v-btn color="primary" @click="showCreateStore = true" class="mr-2" :disabled="disabledProperty">
      <Icon icon="mdi:add" class="mr-2" />
      Agregar establecimiento
    </v-btn>
    <CreateStore :model-value="showCreateStore" @cancel="showCreateStore = false" @save="saveStore" />
  </div>

  <div v-if="disabledProperty" class="d-flex flex-column align-center justify-center py-12 text-grey">
    <Icon icon="cil:warning" height="48" class="mb-4" />
    <p class="text-subtitle-1">Elija un campus para ver los establecimientos</p>
  </div>

  <div v-else>
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
  </div>

  <div>
    <CreateCashDrawer
      :model-value="showCreateCashDrawer"
      :is-loading="openCashDrawerMutation.isPending.value"
      @cancel="showCreateCashDrawer = false"
      @save="openCashDrawer"
    />
  </div>
</template>
