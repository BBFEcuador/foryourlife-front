<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import AdminAccount from './settings/AdminAccount.vue';
import ContificoSettings from './settings/ContificoSettings.vue';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const breadcrumbs = ref([
  {
    title: 'Configuración',
    disabled: false,
    href: '#'
  }
]);

interface Section {
  title: string;
  description: string;
  value: string;
  icon: string;
}

const sections: Section[] = [
  {
    title: 'Cuenta',
    description: 'Personalización de datos de cuenta',
    value: 'cuenta',
    icon: 'mdi:account'
  },
  {
    title: 'Contifico',
    description: 'Configuración de datos para el funcionamiento de la facturación',
    value: 'contifico',
    icon: 'ph:coins-fill'
  }
];

const selectedSection = ref<Section | null>(null);
</script>
<template>
  <BaseBreadcrumb :title="'Configuración'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div v-if="checkPermission(PermissionEnum.SEE_CONFIGURATIONS)">
    <v-row dense>
      <v-col v-for="section in sections" :key="section.value" :cols="12" :md="12 / sections.length">
        <v-card
          :elevation="selectedSection?.value === section.value ? 8 : 2"
          class="tw:cursor-pointer h-100"
          :color="selectedSection?.value === section.value ? 'primary' : 'white'"
          @click="selectedSection = section"
        >
          <v-card-title class="d-flex tw:gap-x-2 align-center">
            <Icon :icon="section.icon" />
            <div class="tw:font-bold">{{ section.title }}</div>
          </v-card-title>
          <v-card-text class="tw-flex tw-items-center tw-text-sm">
            <div class="tw-whitespace-normal tw-break-words">
              {{ section.description }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-4">
          <template v-if="selectedSection?.value === 'cuenta'">
            <AdminAccount />
          </template>
          <template v-else-if="selectedSection?.value === 'contifico'">
            <ContificoSettings />
          </template>
          <template v-else>
            <p>Selecciona una sección para ver el contenido.</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
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
