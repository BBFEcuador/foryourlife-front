<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { Icon } from '@iconify/vue';

defineProps<{
  data: {
    label: string;
    email: string;
    role: string;
    avatar: string;
    color: string;
    isRoot?: boolean;
    canAddChildren?: boolean;
    id: string;
  };
}>();

const emit = defineEmits(['add-children', 'remove-node', 'swap-node']);

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'VISIONARY': return 'mdi:crown';
    case 'STAFF': return 'mdi:account-tie';
    case 'PARTICIPANT': return 'mdi:account';
    case 'MASTERLIFE': return 'mdi:star';
    default: return 'mdi:circle';
  }
};
</script>

<template>
  <div class="org-chart-node elevation-2 rounded-lg position-relative"
    :style="{ borderTop: `4px solid ${data.color}` }">
    <Handle type="target" :position="Position.Top" class="custom-handle" />

    <div class="d-flex gap-4">
      <v-btn v-if="data.role !== 'PARTICIPANT'" icon size="x-small" variant="flat"
        class="text-primary top-0 left-0 ma-1" @click.stop="emit('add-children', data)"
        style="z-index: 10;">
        <Icon icon="mdi-plus" height="16"></Icon>
        <v-tooltip activator="parent" location="top">Agregar</v-tooltip>
      </v-btn>
      <v-btn icon size="x-small" variant="text" color="warning" class="top-0 left-0 ma-1"
        style="z-index: 10;" @click.stop="emit('swap-node', data)">
        <Icon icon="mdi:account-switch" height="16"></Icon>
        <v-tooltip activator="parent" location="top">Intercambiar</v-tooltip>
      </v-btn>

      <v-btn icon size="x-small" variant="text" color="error" class="top-0 right-0 ma-1"
        @click.stop="emit('remove-node', data)" style="z-index: 10;">
        <Icon icon="mdi:close" height="16"></Icon>
        <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
      </v-btn>

    </div>

    <div class="pa-3 text-center">
      <div class="font-weight-bold text-subtitle-2 mb-0 text-truncate">{{ data.label }}</div>
      <div class="text-caption text-grey text-truncate mb-1" style="max-width: 160px;">{{ data.email }}</div>

      <v-chip size="x-small" :color="data.color" variant="flat" class="text-white mt-1">
        <Icon :icon="getRoleIcon(data.role)" class="mr-1" />
        {{ data.role }}
      </v-chip>
    </div>

    <Handle type="source" :position="Position.Bottom" class="custom-handle" />
  </div>
</template>

<style scoped>
.org-chart-node {
  transition: all 0.2s ease;
}

.org-chart-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.custom-handle {
  width: 10px;
  height: 10px;
  background: #cbd5e1;
  border: 2px solid white;
}
</style>