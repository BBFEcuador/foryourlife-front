<script setup lang="ts">
import useBankAccounts from '@/composables/admin/paymentMethods/useBankAccounts';
import { Icon } from '@iconify/vue/dist/iconify.js';
import CreateBankAccount from './CreateBankAccount.vue';
import EditBankAccount from './EditBankAccount.vue';
import { computed, ref } from 'vue';
import type { BankAccount, BankAccountRequest } from '@/models/Payments';
import useBankAccountMutations from '@/composables/admin/paymentMethods/useBankAccountMutation';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';
import useContificoBankAccountsMutation from '@/composables/admin/contifico/useContificoBankAccounts';
import { adminStore } from '@/stores/adminStore';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const { bankAccounts, isBankAccountsLoading, refetchBankAccounts } = useBankAccounts();
const { saveBankAccountMutation } = useBankAccountMutations();
const { useContificoSyncBankAccountsMutation } = useContificoBankAccountsMutation();
const loadingProperty = computed(() => useContificoSyncBankAccountsMutation.isPending.value);
const store = adminStore();
const disabledProperty = !store.isCampusSelected;
const selectedBankAccount = ref({} as BankAccount);

const headers = [
  { title: 'Nombre', value: 'name', sortable: true },
  { title: 'Nro. Cuenta', value: 'number', sortable: true },
  { title: 'Campus', value: 'campus.city', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const search = ref('');

const saveBankAccount = async (bankAccount: BankAccountRequest) => {
  await saveBankAccountMutation.mutateAsync(bankAccount, {
    onSuccess: async () => {
      showCreateDialog.value = false;
      showEditDialog.value = false;
      toast.success('Cuenta Bancaria guardada exitosamente');
      await refetchBankAccounts();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al guardar la Cuenta Bancaria');
    }
  });
};

const syncContificoBankAccounts = () => {
  if (!store.isCampusSelected) {
    toast.error('Seleccione un campus para sincronizar');
    return;
  }

  useContificoSyncBankAccountsMutation.mutate(store.selectCampusId, {
    onSuccess: async () => {
      toast.success('Productos actualizados correctamente');
      await refetchBankAccounts();
    },
    onError(error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar la caja');
    }
  });
};

const handleEditBankAccount = (item: BankAccount) => {
  selectedBankAccount.value = item;
  showEditDialog.value = true;
};
</script>
<template>
  <v-data-table
    :headers="headers"
    :items="bankAccounts"
    :items-length="bankAccounts.length"
    :loading="isBankAccountsLoading || loadingProperty"
    :search="search"
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
          placeholder="Buscar cuenta..."
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
            <VBtn icon variant="text" size="small" @click="search = ''" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
              <Icon icon="mdi:close" height="18" />
            </VBtn>
          </template>
        </VTextField>
        <v-spacer></v-spacer>
        <VBtn
          variant="elevated"
          color="info"
          class="ml-2"
          @click="syncContificoBankAccounts"
          :loading="loadingProperty"
          :disabled="disabledProperty"
        >
          <Icon class="mr-2" icon="mdi:refresh" />
          Sincronizar Cuentas Bancarias de Contifico
        </VBtn>
        <VBtn
          v-if="checkPermission(PermissionEnum.CREATE_PAYMENT_METHODS)"
          variant="elevated"
          color="primary"
          class="ml-2"
          @click="showCreateDialog = true"
        >
          <Icon class="mr-2" icon="mdi:plus" />
          Agregar Cuenta Bancaria
        </VBtn>
      </v-toolbar>
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
          v-tooltip="'Editar Cuenta'"
          @click="handleEditBankAccount(item)"
        >
          <Icon icon="tabler:pencil" height="18" />
        </v-btn>
      </div>
    </template>
  </v-data-table>

  <CreateBankAccount :model-value="showCreateDialog" @cancel="showCreateDialog = false" @save="saveBankAccount" />

  <EditBankAccount
    v-if="showEditDialog"
    :model-value="showEditDialog"
    @cancel="showEditDialog = false"
    :bankAccount="selectedBankAccount"
    @save="saveBankAccount"
  />
</template>
