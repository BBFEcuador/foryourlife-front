<script setup lang="ts">
import type { Criteria, Filter } from '@/models/Criteria';
import { ref, watch } from 'vue';

const emits = defineEmits(['clear-filters', 'update-filters']);

const open = ref(['Tipo', 'City']);

const criteria = ref<Criteria>({ filters: [] as Filter[], limit: 0, offset: 0 });
const userTipe = ref([]);
watch(userTipe, () => {
  if (userTipe.value.length > 0) {
    criteria.value.filters = criteria.value.filters.filter((x) => x.column != 'courseLevel');
    userTipe.value.map((x) => {
      criteria.value.filters.push({
        column: 'roleName',
        joinTable: 'participantLevel',
        operation: 'JOIN',
        value: `ROLE_${x}`,
        logicalOperator: 'OR'
      });
    });
  }
});

const onFiltersEmit = () => {
  emits('update-filters', criteria.value);
};

const onFilerClear = () => {
  emits('clear-filters');
  userTipe.value = [];
  criteria.value.filters = [];
};
</script>

<template>
  <v-list v-model:opened="open" class="custome-filter" v-auto-animate>
    <v-list-group value="Tipo">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Tipo" class="px-0" :ripple="false"></v-list-item>
      </template>
      <v-list-item :title="'Focus'" v-model="userTipe">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn value="FOCUS" v-model="userTipe"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="'Your'" v-model="userTipe">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn value="YOUR" v-model="userTipe"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="'Life'" v-model="userTipe">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn value="LIFE" v-model="userTipe"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list-group>
    <VDivider />
    <v-list-group value="City">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Sede" class="px-0" :ripple="false"></v-list-item>
      </template>
      <v-list-item :title="'Quito'">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="'Cuenca'">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="'Bogota'">
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list-group>
    <VDivider />
    <VBtn color="error" block variant="flat" rounded="xl" class="mt-4" @click="onFiltersEmit">Filtrar</VBtn>
    <VBtn color="error" block variant="tonal" rounded="xl" class="mt-4" @click="onFilerClear"
      v-if="criteria.filters.length > 0">Limpiar</VBtn>
  </v-list>
</template>

<style scoped></style>
