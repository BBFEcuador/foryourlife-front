<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import useStaffs from '@/composables/admin/staff/useStaffs';
import type { StaffWriteModel } from '@/models/Staff';
import { ref, watch } from 'vue';
import { Icon } from 'vue3-carousel';


const {isStaffError,isStaffloading,staffData} = useStaffs()
const {saveStaffMutations} = useStaffMutations()
const showForm = ref(false)
const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const search = ref();
const headers = [
  { title: 'Nombre', value: 'user.name', sortable: true },
  { title: 'E-mail', value: 'user.email', sortable: true },
  { title: 'Teléfono', value: 'user.phone', sortable: true },
  { title: 'Activo', value: 'active', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false, width: 50 }
];

const staff = ref<StaffWriteModel>({
    user:{}
} as StaffWriteModel)


const onSave = () => {
    saveStaffMutations.mutate(staff.value)
}

watch(saveStaffMutations.isError,() => {
    if (saveStaffMutations.isError.value) {
        alert('error')
    }
})

watch(saveStaffMutations.isSuccess,() => {
    if (saveStaffMutations.isSuccess.value) {
        alert('gut')
    }
})
</script>

<template>
  <BaseBreadcrumb :title="'Staff'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
      <v-col cols="12">
          <UiParentCard title="Lista de Staff">
            <v-data-table :headers="headers" :search="search" :items="staffData" :loading="isStaffloading">
          <template v-slot:top>
            <v-toolbar class="bg-surface tw-px-3" flat v-motion :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0 }" :delay="200" :duration="250">
              <VTextField hide-details placeholder="Buscar Sede" v-model="search" class="custom-card">
                <Icon icon="mdi-magnify" height="18"></Icon>
              </VTextField>
              <v-spacer></v-spacer>
              <VBtn variant="elevated" color="primary" @click="showForm = true">
                <Icon class="mr-2" icon="mdi:plus" />
                Agregar
              </VBtn>
            </v-toolbar>
          </template>
          <template #item.active="{ item }">
            <VChip v-if="item.active" color="success">
              Activo
            </VChip>
            <VChip v-else color="error">
              Inactivo
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <VBtn icon color="secondary" >
                <Icon icon="tabler:pencil-check" />
              </VBtn>
              <v-btn flat :color="item.active ? 'error' : 'success'" icon >
                <Icon :icon="item.active
                  ? 'mdi-power'
                  : 'mdi-power-off'" />
              </v-btn>
            </div>
          </template>
        </v-data-table>
          </UiParentCard>
      </v-col>
      <VDialog max-width="500" v-model="showForm">
            <UiParentCard title="Guardar staff">
                <InputSection label="Nombre">
                    <VTextField placeholder="Nombre del staff" v-model="staff.user.name"/>
                </InputSection>
                <InputSection label="E-mail">
                    <VTextField placeholder="correo del staff" v-model="staff.user.email"/>
                </InputSection>
                <InputSection label="Tel">
                    <VTextField placeholder="Telefono del staff" v-model="staff.user.phone"/>
                </InputSection>
                <InputSection label="Rol">
                    <VSelect placeholder="Rol del staff" :items="['CAPITAN','STAFF']" v-model="staff.rol"/>
                </InputSection>
                <div class="tw:w-full tw:flex tw:justify-end">
                    <VBtn @click="onSave">Guardar</VBtn>
                </div>
            </UiParentCard>
      </VDialog>
  </v-row>
</template>


<style scoped></style>