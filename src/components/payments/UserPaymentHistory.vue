<script setup lang="ts">
import type { Payment } from '@/models/Payments';
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
  modelValue: boolean;
  payment: Payment;
}>();

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const close = () => (visible.value = false);

const itemsPerPage = 5;
const page = ref(1);

const total = computed(() => props.payment?.paymentshistory.length ?? 0);
const paginatedHistory = computed(() => {
  const history = [...(props.payment?.paymentshistory ?? [])].reverse();
  const start = (page.value - 1) * itemsPerPage;
  return history.slice(start, start + itemsPerPage);
});

const headers = [
  { title: 'Fecha', value: 'date' },
  { title: 'Monto', value: 'amount' },
  { title: 'Método de pago', value: 'paymentMethod' }
];
</script>
<template>
  <v-dialog v-model="visible" max-width="800">
    <v-card>
      <v-toolbar color="primary" title="Historial de pagos">
        <v-spacer />
        <v-btn icon variant="text" size="small" @click="close" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
          <Icon icon="mdi:close" height="18" />
        </v-btn>
      </v-toolbar>
      <v-data-table-server
        v-if="total > 0"
        :headers="headers"
        :items="paginatedHistory"
        :items-length="total"
        :items-per-page="itemsPerPage"
        class="mt-4"
      >
        <template #item.date="{ item }">
          <span>{{ item.date }}</span>
        </template>
        <template #item.amount="{ item }">
          <span>${{ item.amount }}</span>
        </template>
        <template #item.paymentMethod="{ item }">
          <span>{{ item.paymentMethod.type }}</span>
        </template>
      </v-data-table-server>
      <div v-else class="pa-4 tw:text-center">
        No hay datos disponibles
      </div>
    </v-card>
  </v-dialog>
</template>
