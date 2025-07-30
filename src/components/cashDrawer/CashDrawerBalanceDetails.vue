<script setup lang="ts">
import type { CashDrawer } from '@/models/CashDrawer';
import UiParentCard from '../shared/UiParentCard.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
  cashDrawer: CashDrawer;
  modelValue: boolean;
}>();

const emit = defineEmits(['cancel']);
</script>
<template>
  <v-dialog v-model="props.modelValue">
    <UiParentCard title="Actualizar Factura">
      <template #action>
        <v-btn elevation="0" variant="plain" icon @click="emit('cancel')" class="tw:rounded-md"> <Icon icon="mdi:close" /> </v-btn>
      </template>
      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Nombre Completo</h3>
        </div>
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Dirección</h3>
        </div>
      </div>

      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Cédula/Pasaporte o Ruc</h3>
        </div>
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Teléfono</h3>
        </div>
      </div>
      <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
        <div>
          <h3 class="tw:text-lg tw:font-semibold pb-2">Email</h3>
        </div>
      </div>

      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click=""> Guardar </v-btn>
      </v-card-actions>
    </UiParentCard>
  </v-dialog>
</template>
