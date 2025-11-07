<script setup lang="ts">
import BankAccounts from '@/components/paymentMethods/BankAccounts.vue';
import CreatePaymentMethod from '@/components/paymentMethods/CreatePaymentMethod.vue';
import EditPaymentMethod from '@/components/paymentMethods/EditPaymentMethod.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import usePaymentMethodMutations from '@/composables/admin/paymentMethods/usePaymentMethodMutation';
import usePaymentMethods from '@/composables/admin/paymentMethods/usePaymentMethods';
import type { PaymentMethod, PaymentMethodRequest } from '@/models/Payments';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const breadcrumbs = ref([
  {
    title: 'Métodos de pago',
    disabled: false,
    href: '#'
  }
]);

const search = ref('');
const isMethodSelected = ref(false);
const switchBankAccount = ref(false);
const title = ref('Lista de Métodos de Pago');

watch(switchBankAccount, (newVal) => {
  if (newVal) {
    title.value = 'Lista de Cuentas Bancarias';
  } else {
    title.value = 'Lista de Métodos de Pago';
  }
});

const { paymentMethodsData, isPaymentMethodsError, isPaymentMethodsLoading, refetchPaymentMethods } = usePaymentMethods();
const { savePaymentMethodMutation, changePaymentMethodStatusMutation } = usePaymentMethodMutations();

const headers = [
  { title: 'Nombre', value: 'type', sortable: true },
  { title: 'Tipo de pago SRI', value: 'code', sortable: true },
  { title: 'Campus', value: 'campus', sortable: true },
  { title: 'Estado', value: 'isActive', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const onChangeStatus = async (item: PaymentMethod) => {
  const isCurrentlyActive = item.isActive;
  const action = isCurrentlyActive ? 'desactivar' : 'activar';
  const confirmText = isCurrentlyActive ? 'Desactivar' : 'Activar';
  const confirmColor = isCurrentlyActive ? '#d33' : '#3085d6';

  Swal.fire({
    title: `¿Estás seguro de ${action} este Método de pago?`,
    text: `Estás a punto de ${action} el Método de pago ${item.type}. ¿Deseas continuar?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar'
  }).then(async (params) => {
    if (params.isConfirmed) {
      try {
        const paymentMethodReq: PaymentMethodRequest = {
          id: item.id,
          type: item.type,
          isActive: !item.isActive,
          code: item.code,
          campusId: item.campus.id
        };

        await savePaymentMethodMutation.mutateAsync(paymentMethodReq);
        refetchPaymentMethods();
        Swal.fire('¡Éxito!', `El método de pago ha sido ${!isCurrentlyActive ? 'activado' : 'desactivado'} correctamente.`, 'success');
      } catch (error) {
        console.error('Error al cambiar el estado del método de pago:', error);
        Swal.fire('Error', 'No se pudo actualizar el estado del método de pago', 'error');
      }
    }
  });
};

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const selectedPaymentMethod = ref<PaymentMethod>({} as PaymentMethod);

const onCreatePaymentMethod = () => {
  selectedPaymentMethod.value = {} as PaymentMethod;
  showCreateDialog.value = true;
};

const onEditPaymentMethod = (item: PaymentMethod) => {
  selectedPaymentMethod.value = item;
  isMethodSelected.value = true;
  showEditDialog.value = true;
};

const cancelEditPaymentMethod = () => {
  selectedPaymentMethod.value = {} as PaymentMethod;
  isMethodSelected.value = false;
  showEditDialog.value = false;
};

const handleSavePaymentMethod = async (paymenMethodData: Partial<PaymentMethodRequest>) => {
  await savePaymentMethodMutation.mutateAsync(paymenMethodData as PaymentMethodRequest, {
    onSuccess: () => {
      toast.success('Método de pago guardado exitosamente');
      refetchPaymentMethods();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
  showEditDialog.value = false;
  selectedPaymentMethod.value = {} as PaymentMethod;
  isMethodSelected.value = false;
  showCreateDialog.value = false;
};

const switchViews = () => {
  switchBankAccount.value = !switchBankAccount.value;
};
</script>

<template>
  <BaseBreadcrumb :title="'Métodos de Pago'" :breadcrumbs="breadcrumbs" />
  <div v-if="checkPermission(PermissionEnum.SEE_PAYMENT_METHODS)">
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-item class="pa-5">
            <div class="d-sm-flex align-center justify-space-between">
              <v-card-title class="text-h4" style="line-height: 1.57">{{ title }}</v-card-title>
              <VBtn variant="elevated" :color="switchBankAccount ? 'success' : 'info'" @click="switchViews">
                <Icon class="mr-2" :icon="switchBankAccount ? 'ic:outline-payments' : 'mdi:bank'" />
                {{ !switchBankAccount ? 'Cuentas Bancarias' : 'Métodos de pago' }}
              </VBtn>
            </div>
          </v-card-item>
          <v-divider></v-divider>
          <v-card-text>
            <BankAccounts v-if="switchBankAccount" />
            <v-data-table
              v-else
              :headers="headers"
              :search="search"
              :items="paymentMethodsData"
              :loading="isPaymentMethodsLoading"
              :items-length="paymentMethodsData.length"
              :items-per-page="10"
            >
              <template v-slot:top>
                <v-toolbar
                  class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
                  flat
                  v-motion
                  :initial="{ opacity: 0, y: -10 }"
                  :enter="{ opacity: 1, y: 0 }"
                  :delay="200"
                  :duration="250"
                >
                  <VTextField
                    v-model="search"
                    placeholder="Buscar método..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
                    bg-color="white"
                  >
                    <template #prepend-inner>
                      <div class="tw:relative">
                        <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                        <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                      </div>
                    </template>
                    <template #append v-if="search">
                      <VBtn
                        icon
                        variant="text"
                        size="small"
                        @click="search = ''"
                        class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
                      >
                        <Icon icon="mdi:close" height="18" />
                      </VBtn>
                    </template>
                  </VTextField>
                  <v-spacer></v-spacer>
                  <VBtn
                    v-if="checkPermission(PermissionEnum.CREATE_PAYMENT_METHODS)"
                    variant="elevated"
                    color="primary"
                    class="ml-2"
                    @click="onCreatePaymentMethod"
                  >
                    <Icon icon="mdi:plus" />
                    Agregar Método de Pago
                  </VBtn>
                </v-toolbar>
              </template>

              <template #item.campus="{ item }">
                {{ item.campus.city }}
              </template>
              <template #item.isActive="{ item }">
                <VChip
                  :color="item.isActive ? 'success' : 'error'"
                  size="small"
                  variant="flat"
                  class="!tw:font-medium tw:text-xs !tw:min-w-[80px] tw:justify-center"
                  :class="item.isActive ? 'tw:bg-green-50 !tw:text-green-700' : 'tw:bg-red-50 !tw:text-red-700'"
                >
                  <Icon :icon="item.isActive ? 'mdi:check-circle' : 'mdi:close-circle'" class="mr-1" height="16" />
                  {{ item.isActive ? 'Activo' : 'Inactivo' }}
                </VChip>
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    v-if="checkPermission(PermissionEnum.UPDATE_PAYMENT_METHODS)"
                    icon
                    color="info"
                    variant="text"
                    size="32"
                    class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100"
                    v-tooltip="'Editar Descuento'"
                    @click="onEditPaymentMethod(item)"
                  >
                    <Icon icon="tabler:pencil" height="18" />
                  </v-btn>
                  <v-btn
                    v-if="checkPermission(PermissionEnum.DELETE_PAYMENT_METHODS)"
                    color="error"
                    icon
                    variant="text"
                    size="32"
                    v-tooltip="item.isActive ? 'Desactivar' : 'Activar'"
                    :class="item.isActive ? 'tw:bg-red-300 hover:!tw:bg-red-100' : 'tw:bg-green-300 hover:!tw:bg-green-100'"
                    @click="onChangeStatus(item)"
                  >
                    <Icon :icon="item.isActive ? 'mdi-power' : 'mdi-power-off'" height="18" />
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <CreatePaymentMethod v-if="checkPermission(PermissionEnum.CREATE_PAYMENT_METHODS)" :model-value="showCreateDialog" @cancel="showCreateDialog = false" @save="handleSavePaymentMethod" />
    <EditPaymentMethod
      v-if="isMethodSelected && selectedPaymentMethod && checkPermission(PermissionEnum.UPDATE_PAYMENT_METHODS)"
      :model-value="showEditDialog"
      @cancel="cancelEditPaymentMethod"
      :payment-method="selectedPaymentMethod"
      @save="handleSavePaymentMethod"
    />
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
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
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
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
