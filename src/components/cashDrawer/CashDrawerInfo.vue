<script setup lang="ts">
import type { CashDrawer } from '@/models/CashDrawer';
import { Icon } from '@iconify/vue';
import { router } from '@/router';
import useCashDrawerMutation from '@/composables/admin/pos/useCashDrawerMutation';
import { adminStore } from '@/stores/adminStore';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';

const props = defineProps<{
  cashDrawer: CashDrawer;
}>();
const store = adminStore();
const { closeCashDrawerMutation } = useCashDrawerMutation();

function formatDate(dateStr: string): string {
  const [date, time] = dateStr.split('T');
  return `${date} ${time.slice(0, 5)}`;
}

const handleCloseCashDrawer = async () => {
  const cashDrawer = {
    cashDrawerId: props.cashDrawer.cashBox.id,
    userId: store.user.user.id
  };
  await closeCashDrawerMutation.mutateAsync(cashDrawer, {
    onSuccess: (response) => {
      toast.success('Caja cerrada exitosamente');
      store.setCashDrawer({});
      store.setCashDrawerOpen(false);
      router.push({ name: 'pos-main' });
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};
</script>
<template>
  <v-card class="payment-card">
    <v-row class="tw:flex-wrap">
      <v-col cols="12" md="8">
        <v-card-title>
          <h3 class="tw:font-medium">Caja No. {{ props.cashDrawer.cashBox.number }}</h3>
        </v-card-title>
        <v-card-text class="px-4">
          <div class="tw:grid tw:grid-cols-3 tw:gap-x-10 tw:gap-y-4">
            <div>
              <span class="tw:font-medium">Creada por:</span>
              <span class="tw:block">{{ props.cashDrawer.cashBox.createdBy.name }}</span>
            </div>
            <div>
              <span class="tw:font-medium">Fecha creación:</span>
              <span class="tw:block">{{ formatDate(props.cashDrawer.cashBox.created_at) }}</span>
            </div>
            <div>
              <span class="tw:font-medium">Abierta por:</span>
              <span class="tw:block">{{ props.cashDrawer.openedByUser.name }}</span>
            </div>
            <div>
              <span class="tw:font-medium">Fecha de apertura:</span>
              <span class="tw:block">{{ formatDate(props.cashDrawer.startDate) }}</span>
            </div>
            <div>
              <span class="tw:font-medium">Saldo Inicial:</span>
              <span class="tw:block">{{ props.cashDrawer.openingBalance }}</span>
            </div>
            <div v-if="cashDrawer.detail">
              <span class="tw:font-medium">Detalle:</span>
              <span class="tw:block">{{ props.cashDrawer.detail }}</span>
            </div>
          </div>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="4" class="tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-4 px-4">
        <div class="tw:text-lg">Saldo Actual: {{ props.cashDrawer.actualBalance }} $</div>
        <v-btn
          color="green"
          variant="tonal"
          @click="
            router.push({
              name: 'payments-admin'
            })
          "
          class="tw:w-full"
        >
          <Icon icon="mdi:eye" class="mr-2" />
          Ver Pagos
        </v-btn>
        <div class="tw:flex tw:gap-2 tw:w-full">
          <v-btn class="tw:flex-1" color="orange" variant="tonal">
            <Icon icon="majesticons:restricted-line" class="mr-1" />
            Bloquear Caja
          </v-btn>
          <v-btn variant="tonal" class="tw:flex-1" color="red" @click="handleCloseCashDrawer">
            <Icon icon="mdi:lock" class="mr-1" />
            Cerrar Caja
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.payment-card {
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.payment-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.section-fade-in {
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
