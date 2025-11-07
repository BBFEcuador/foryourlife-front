<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { useDate } from 'vuetify';
import FullCalender from './FullCalender.vue';
import CallendarSuply from './callendarSuply.vue';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

const activeView = ref('calendar'); // 'calendar' or 'table'
const adapter = useDate();

const breadcrumbs = ref([
  {
    title: 'Entrenamientos',
    disabled: false,
    href: '#'
  }
]);
</script>

<template>
  <BaseBreadcrumb :title="'Entrenamientos'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div v-if="checkPermission(PermissionEnum.SEE_TRAININGS)">
    <v-row>
      <v-col cols="12">
        <UiParentCard title="Todos los entrenamientos">
          <div class="d-flex justify-end mb-4">
            <v-btn-group>
              <v-btn :color="activeView === 'calendar' ? 'primary' : ''" @click="activeView = 'calendar'">
                <Icon icon="mdi-calendar"></Icon>
                Calendario
              </v-btn>
              <v-btn :color="activeView === 'table' ? 'primary' : ''" @click="activeView = 'table'">
                <Icon icon="mdi-table"></Icon>
                Tabla
              </v-btn>
            </v-btn-group>
          </div>
          <v-fade-transition>
            <FullCalender v-if="activeView === 'calendar'" />
            <CallendarSuply v-else />
          </v-fade-transition>
        </UiParentCard>
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
