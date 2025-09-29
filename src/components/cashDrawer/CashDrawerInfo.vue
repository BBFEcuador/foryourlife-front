<script setup lang="ts">
import type { CashBox, CashDrawer } from '@/models/CashDrawer';
import { Icon } from '@iconify/vue';
import { router } from '@/router';
import useCashDrawerMutation from '@/composables/admin/pos/useCashDrawerMutation';
import { adminStore } from '@/stores/adminStore';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';
import { ref, computed } from 'vue';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast } from '@/service/sweetAlert';
import Swal from 'sweetalert2';
import type { User } from '@/models/User';

const props = defineProps<{
  cashDrawer: CashDrawer | null | undefined;
}>();

const emit = defineEmits(['update-refetch']);

const store = adminStore();
const userIdref = ref(store.user?.user?.id ?? '');
const { closeCashDrawerMutation, toggleLockCashDrawerMutation, forgetPinMutation } = useCashDrawerMutation();

const pin = ref('');
const enteredPin = ref('');
const pinSet = ref(false);
const pinDialog = ref(false);
const unlockDialog = ref(false);

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const [date, time] = dateStr.split('T');
  return `${date} ${time?.slice(0, 5) ?? ''}`;
}

const cashBox = computed(() => props.cashDrawer?.cashBox ?? ({} as CashBox));
const openedByUser = computed(() => props.cashDrawer?.openedByUser ?? {} as User);
const createdBy = computed(() => cashBox.value?.createdBy ?? {});
const startDate = computed(() => props.cashDrawer?.startDate ?? '');
const openingBalance = computed(() => props.cashDrawer?.openingBalance ?? 0);
const detail = computed(() => props.cashDrawer?.detail ?? '');
const actualBalance = computed(() => props.cashDrawer?.actualBalance ?? 0);
const status = computed(() => props.cashDrawer?.status ?? '');
const cashDrawerId = computed(() => props.cashDrawer?.id ?? '');
const cashBoxId = computed(() => cashBox.value?.id ?? '');

const handleCloseCashDrawer = async () => {
  if (!cashBoxId.value || !userIdref.value) return;
  const cashDrawerPayload = {
    cashDrawerId: cashBoxId.value,
    userId: userIdref.value
  };
  await closeCashDrawerMutation.mutateAsync(cashDrawerPayload, {
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
      router.push({ name: 'pos-main' });
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};

const handleLock = () => {
  if (pin.value.trim().length < 4) {
    toast.warning('El PIN debe tener al menos 4 caracteres');
    return;
  }
  if (!cashDrawerId.value) return;
  toggleLockCashDrawerMutation.mutate(
    { pin: pin.value, cashDrawerId: cashDrawerId.value },
    {
      onSuccess() {
        toast.success('Caja bloqueada correctamente');
        pinSet.value = true;
        pinDialog.value = false;
        emit('update-refetch');
      },
      onError(error) {
        const e = error as AxiosError<ErrorApiResponse>;
        showErrorToast(e);
      }
    }
  );
};

const handleUnlock = () => {
  if (enteredPin.value.trim().length < 4) {
    toast.warning('El PIN debe tener al menos 4 caracteres');
    return;
  }
  if (!cashDrawerId.value) return;
  toggleLockCashDrawerMutation.mutate(
    { pin: enteredPin.value, cashDrawerId: cashDrawerId.value },
    {
      onSuccess() {
        toast.success('Caja desbloqueada correctamente');
        pinSet.value = true;
        pinDialog.value = false;
        emit('update-refetch');
      },
      onError(error) {
        const e = error as AxiosError<ErrorApiResponse>;
        showErrorToast(e);
      }
    }
  );
};

const handleForgetPin = () => {
  if (!cashDrawerId.value) return;
  forgetPinMutation.mutate(cashDrawerId.value, {
    onSuccess() {
      unlockDialog.value = false;
      Swal.fire({
        text: `Se envio el PIN a tu correo registrado`,
        title: 'Correo de Recuperación',
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
    },
    onError(err) {
      const e = err as AxiosError<ErrorApiResponse>;
      showErrorToast(e);
    }
  });
};
</script>
<template>
  <div v-if="props.cashDrawer && cashBox">
    <v-card class="payment-card">
      <v-row class="tw:flex-wrap">
        <v-col cols="12" md="8">
          <v-card-title>
            <h3 class="tw:font-medium">Caja No. {{ cashBox.number ?? '-' }}</h3>
          </v-card-title>
          <v-card-text class="px-4">
            <div class="tw:grid tw:grid-cols-3 tw:gap-x-10 tw:gap-y-4">
              <div>
                <span class="tw:font-medium">Creada por:</span>
                <span class="tw:block">{{ createdBy ?? '-' }}</span>
              </div>
              <div>
                <span class="tw:font-medium">Fecha creación:</span>
                <span class="tw:block">{{ formatDate(cashBox.createdDate) }}</span>
              </div>
              <div>
                <span class="tw:font-medium">Abierta por:</span>
                <span class="tw:block">{{ openedByUser.name ?? '-' }}</span>
              </div>
              <div>
                <span class="tw:font-medium">Fecha de apertura:</span>
                <span class="tw:block">{{ formatDate(startDate) }}</span>
              </div>
              <div>
                <span class="tw:font-medium">Saldo Inicial:</span>
                <span class="tw:block">{{ openingBalance }}</span>
              </div>
              <div v-if="detail">
                <span class="tw:font-medium">Detalle:</span>
                <span class="tw:block">{{ detail }}</span>
              </div>
            </div>
          </v-card-text>
        </v-col>
        <v-col cols="12" md="4" class="tw:flex tw:flex-col tw:justify-center tw:items-center tw:gap-4 px-6">
          <div class="tw:text-lg">Saldo Actual: {{ actualBalance }} $</div>
          <v-btn
            color="success"
            variant="tonal"
            class="tw:w-full"
            @click="
              router.push({
                name: 'payments-admin'
              })
            "
          >
            <Icon icon="mdi:eye" class="mr-2" />
            Ver Pagos
          </v-btn>
          <div class="tw:flex tw:gap-2 tw:w-full">
            <v-btn
              class="tw:flex-1"
              color="warning"
              variant="tonal"
              @click="status === 'LOCKED' ? (unlockDialog = true) : (pinDialog = true)"
            >
              <Icon icon="majesticons:restricted-line" class="mr-1" />
              {{ status === 'LOCKED' ? 'Desbloquear Caja' : 'Bloquear Caja' }}
            </v-btn>

            <v-btn variant="tonal" class="tw:flex-1" color="error" @click="handleCloseCashDrawer">
              <Icon icon="mdi:lock" class="mr-1" />
              Cerrar Caja
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="pinDialog" width="400">
      <v-card>
        <v-card-title class="text-h3 text-center">Establecer PIN de 4 dígitos</v-card-title>
        <v-card-text class="d-flex flex-column justify-center gap-2">
          <v-otp-input v-model="pin" length="4"></v-otp-input>
          <v-btn color="primary" @click="handleLock">Confirmar</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="unlockDialog" width="400">
      <v-card>
        <v-card-title class="text-h3 text-center">Ingresar PIN para desbloquear</v-card-title>
        <v-card-text class="d-flex flex-column justify-center gap-2">
          <v-otp-input v-model="enteredPin" length="4"></v-otp-input>
          <v-btn color="primary" @click="handleUnlock">Desbloquear</v-btn>
          <v-label class="pt-2 tw:underline tw:cursor-pointer" @click="handleForgetPin">Olvide mi Pin</v-label>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
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
