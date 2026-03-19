<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Store } from '@/models/CashDrawer';
import { ref, computed } from 'vue';
import useCashBoxes from '@/composables/admin/pos/useCashBoxes';
import type { CashDrawer, CashBoxRequest, CashBox } from '@/models/CashDrawer';
import { PermissionEnum } from '@/utils/locales/PermissionEnum.ts';
import { checkPermission } from '@/service/ability';
import { router } from '@/router';
import { adminStore } from '@/stores/adminStore';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';
import useCashBoxMutation from '@/composables/admin/pos/useCashBoxMutation';
import CreateCashBox from '@/components/cashDrawer/CreateCashBox.vue';
import useCashDrawerMutation from '@/composables/admin/pos/useCashDrawerMutation';
import CreateCashDrawer from '@/components/cashDrawer/CreateCashDrawer.vue';

const props = defineProps<{
  selectedStore: Store | null;
  cashDrawer: CashDrawer | null;
  isLoadingCashDrawerOpenedByUser: boolean;
}>();

const store = adminStore();
const storeId = computed(() => props.selectedStore?.id || '');
const showCreateCashBox = ref(false);
const auxCashBox = ref<CashBox>({} as CashBox);
const showCreateCashDrawer = ref(false);
const { saveCashBoxMutation } = useCashBoxMutation();
const { cashBoxes, isCashBoxesLoading, refetchCashBoxes } = useCashBoxes(storeId);
const { openCashDrawerMutation, closeCashDrawerMutation } = useCashDrawerMutation();

const emit = defineEmits<{
  (e: 'reloadStoreCashByUser'): void;
}>();

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
  if (cashBox.opened) {
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

const handleCloseCashDrawer = async (cashBoxId: string) => {
  const cashDrawer = {
    cashDrawerId: cashBoxId,
    userId: store.user.user.id
  };

  await closeCashDrawerMutation.mutateAsync(cashDrawer, {
    onSuccess: async (data) => {
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
      emit('reloadStoreCashByUser');
      await refetchCashBoxes();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};
</script>

<template>
  <div v-if="props.selectedStore">
    <div class="d-flex align-center mb-3 mt-3">
      <Icon icon="mdi:cash-register" class="mr-2" width="20" />
      <div class="tw:font-bold tw:flex-1 font-12">Cajas</div>
      <v-btn v-if="checkPermission(PermissionEnum.CREATE_EMISSION_POINTS)" color="primary" @click="showCreateCashBox = true">
        <Icon icon="mdi:plus" class="mr-2" />
        Nueva caja
      </v-btn>
    </div>
    <div v-if="isCashBoxesLoading || props.isLoadingCashDrawerOpenedByUser" class="pa-4">
      <v-row>
        <v-col v-for="n in 6" :key="n" cols="12" md="4">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>
    </div>
    <v-row v-else-if="cashBoxes.length > 0">
      <v-col v-for="box in cashBoxes" cols="12" md="4" sm="6" :key="box.id">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-title>
            <div class="d-flex align-center tw:gap-x-2">
              <div>
                <Icon
                  :icon="box.opened ? 'mdi-check-circle-outline' : 'mdi-cancel'"
                  width="20"
                  class="mr-1"
                  :class="box.opened ? 'text-primary' : 'text-warning'"
                />
                <v-tooltip activator="parent" location="bottom" open-delay="400">{{ box.opened ? 'Abierta' : 'Cerrada' }}</v-tooltip>
              </div>
              <div class="tw:flex-1 tw:font-bold font-12">
                Caja No. {{ box.number }}
                <div>
                  <p class="tw:font-normal tw:text-sm tw:text-gray-500">
                    <span class="tw:font-semibold">Emisión:</span> {{ props.selectedStore.number }}-{{ box.number }}
                  </p>
                </div>
              </div>
              <Icon icon="mdi-circle" :class="box.isActive ? 'text-c-green' : 'text-error'" width="10" elevated="1" />
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-item class="pt-1">
            <div>
              <span class="tw:text-sm tw:text-gray-500">Abierta por:</span>
              <p class="text-h6 font-weight-regular">{{ box.openedByUser || 'N/A' }}</p>
            </div>
            <div>
              <span class="tw:text-sm tw:text-gray-500">Fecha de creación:</span>
              <p class="text-h6 font-weight-regular">{{ formatDate(box.createdDate) || 'N/A' }}</p>
            </div>
          </v-card-item>
          <v-divider></v-divider>
          <v-card-actions class="pa-2 d-flex flex-wrap gap-2">
            <div v-if="props.cashDrawer && props.cashDrawer.cashBox.id === box.id" class="text-end tw:flex-1">
              <v-btn v-if="checkPermission(PermissionEnum.CREATE_PAYMENTS)" class="flex-grow tw:flex-1" variant="tonal" color="success" size="small" @click="handleOpenCashDrawer(box)">
                <Icon icon="hugeicons:save-money-dollar" class="mr-1" width="20"/>
                <v-tooltip activator="parent" location="bottom" open-delay="400">Crear cobros</v-tooltip>
              </v-btn>
              <v-btn
                v-if="checkPermission(PermissionEnum.UPDATE_EMISSION_POINTS)"
                variant="tonal"
                class="flex-g row ml-2"
                color="error"
                size="small"
                :loading="closeCashDrawerMutation.isPending.value"
                @click="handleCloseCashDrawer(box.id)"
              >
                <Icon icon="mdi:lock" class="mr-1" width="20" />
                <v-tooltip activator="parent" location="bottom" open-delay="400">Cerrar Caja</v-tooltip>
              </v-btn>
            </div>
            <v-btn
              v-if="!props.cashDrawer && !box.opened && checkPermission(PermissionEnum.CREATE_PAYMENTS)"
              class="flex-grow tw:flex-1"
              variant="tonal"
              color="primary"
              size="small"
              @click="handleOpenCashDrawer(box)"
            >
              <Icon icon="mdi:key" class="mr-1" width="20" />
              <v-tooltip activator="parent" location="bottom" open-delay="400">Abrir Caja</v-tooltip>
            </v-btn>
            <v-btn
              v-if="checkPermission(PermissionEnum.UPDATE_EMISSION_POINTS)"
              class="flex-grow tw:flex-1"
              variant="tonal"
              color="info"
              size="small"
              @click="
                router.push({
                  name: 'cash-drawer-balances',
                  params: { id: box.id }
                })
              "
            >
              <Icon icon="mdi:eye" class="mr-1" width="20" />
              <v-tooltip activator="parent" location="bottom" open-delay="400">Ver balances de caja</v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div v-else class="d-flex flex-column align-center tw-gap-y-2 py-6">
      <Icon icon="mdi-cash-register" width="40" class="text-gray-400" />
      <div class="tw:text-sm tw:text-gray-500">No se encontraron cajas para este establecimiento</div>
    </div>
  </div>

  <CreateCashBox
    :model-value="showCreateCashBox"
    :is-loading="isCashBoxesLoading"
    :store="props.selectedStore as Store"
    @cancel="showCreateCashBox = false"
    @save="handleSaveCashBox"
  />
  <CreateCashDrawer
    :model-value="showCreateCashDrawer"
    :is-loading="openCashDrawerMutation.isPending.value"
    @cancel="showCreateCashDrawer = false"
    @save="openCashDrawer"
  />
</template>

<style scoped>
.tw\:border-5 {
  border-style: var(--tw-border-style) !important;
  border-bottom-width: 5px !important;
}

.font-12 {
  font-size: 12pt !important;
}

.font-9 {
  font-size: 9pt !important;
}

.text-c-green {
  color: #006e00 !important;
}
</style>
