<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref, onMounted } from 'vue';
import type { PaymentStaffDashboard } from '@/models/DashboardFocus';

const props = defineProps<{ data: PaymentStaffDashboard[] }>();
const emit = defineEmits(['loaded']);
const ready = ref(false);
const search = ref('');

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  ready.value = true;
  emit('loaded');
});

// Formateador de moneda para limpieza visual
const fCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val ?? 0);

// HEADERS CON GRUPOS (UI Mejorada)
const headers = [
  { title: 'Staff', key: 'staffName', align: 'start', sortable: true, width: '200px', class: 'sticky-column' },
  {
    title: 'DOMINGOS',
    align: 'center',
    children: [
      { title: 'Abono YOUR', key: 'yourPaymentsSunday', align: 'end' },
      { title: 'YOUR + LIFE', key: 'yourPlusLifePaymentsSunday', align: 'end' },
      { title: 'Total', key: 'totalPaymentsSunday', align: 'end' },
      { title: '%', key: 'passPercentageSunday', align: 'center' },
    ],
  },
  {
    title: 'FINALES',
    align: 'center',
    children: [
      { title: 'Abono Final', key: 'yourPaymentsFinal', align: 'end' },
      { title: 'YOUR + LIFE', key: 'yourPlusLifePaymentsFinal', align: 'end' },
      { title: 'Total', key: 'totalPaymentsFinal', align: 'end' },
      { title: '%', key: 'passPercentageFinal', align: 'center' },
    ],
  },
];

// Cálculo de totales simplificado
const calculateTotal = (key: keyof PaymentStaffDashboard) => {
  return props.data?.reduce((acc, item) => acc + (Number(item[key]) || 0), 0) || 0;
};

const totals = computed(() => ({
  yourSunday: calculateTotal('yourPaymentsSunday'),
  totalSunday: calculateTotal('totalPaymentsSunday'),
  yourFinal: calculateTotal('yourPaymentsFinal'),
  totalFinal: calculateTotal('totalPaymentsFinal'),
  // ... agrega los demás si los necesitas en el footer
}));
</script>

<template>
  <v-card variant="flat" border rounded="lg" v-if="ready" class="payment-card">
    <v-card-item class="bg-grey-lighten-5">
      <template v-slot:prepend>
        <v-avatar color="green-lighten-5" rounded="lg">
          <Icon icon="mdi-account-cash-outline" class="text-green-darken-2" width="24" />
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold">Resumen de Pagos por Staff</v-card-title>
      <v-card-subtitle>Desglose de rendimiento Domingos vs Finales</v-card-subtitle>
      
      <template v-slot:append>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar Staff"
          variant="solo"
          density="compact"
          hide-details
          flat
          bg-color="white"
          class="search-field"
        ></v-text-field>
      </template>
    </v-card-item>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="props.data"
      :search="search"
      hover
      fixed-header
      class="custom-table"
      density="comfortable"
    >
      <template #[`item.staffName`]="{ item }">
        <div class="d-flex align-center py-2">
          <v-avatar size="32" color="blue-grey-lighten-5" class="mr-3">
            <span class="text-caption font-weight-bold">{{ item.staffName.charAt(0) }}</span>
          </v-avatar>
          <span class="font-weight-medium">{{ item.staffName }}</span>
        </div>
      </template>

      <template v-for="col in ['yourPaymentsSunday', 'yourPlusLifePaymentsSunday', 'totalPaymentsSunday', 'yourPaymentsFinal', 'yourPlusLifePaymentsFinal', 'totalPaymentsFinal']" :key="col" #[`item.${col}`]="{ value }">
        <span class="font-variant-numeric">{{ fCurrency(value) }}</span>
      </template>

      <template #[`item.passPercentageSunday`]="{ value }">
        <v-chip size="small" :color="value >= 80 ? 'green' : 'orange'" variant="tonal" label>
          {{ value }}%
        </v-chip>
      </template>

      <template #[`item.passPercentageFinal`]="{ value }">
        <v-chip size="small" :color="value >= 80 ? 'green' : 'orange'" variant="tonal" label>
          {{ value }}%
        </v-chip>
      </template>

      <template #body.append>
        <tr class="bg-grey-lighten-4 font-weight-bold">
          <td class="text-uppercase">Totales</td>
          <td class="text-right">{{ fCurrency(totals.yourSunday) }}</td>
          <td></td> <td class="text-right text-primary">{{ fCurrency(totals.totalSunday) }}</td>
          <td></td> <td class="text-right">{{ fCurrency(totals.yourFinal) }}</td>
          <td></td>
          <td class="text-right text-primary">{{ fCurrency(totals.totalFinal) }}</td>
          <td></td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.search-field {
  width: 250px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

/* UI: Separación visual de grupos de cabeceras */
:deep(.v-data-table-header__content) {
  justify-content: center !important;
}

/* Colores sutiles para diferenciar grupos */
:deep(thead tr:nth-child(1) th:nth-child(2)) {
  background-color: #f0f7ff !important; /* Azul tenue para Domingos */
  color: #1976d2 !important;
}

:deep(thead tr:nth-child(1) th:nth-child(3)) {
  background-color: #f5fcf5 !important; /* Verde tenue para Finales */
  color: #2e7d32 !important;
}

.font-variant-numeric {
  font-variant-numeric: tabular-nums; /* Mantiene los números alineados */
}

.custom-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.7rem !important;
}
</style>