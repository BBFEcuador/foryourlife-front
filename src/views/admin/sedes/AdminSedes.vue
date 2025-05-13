<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useCampusMutations from '@/composables/admin/campus/useCampusMutations';
import useCampus from '@/composables/admin/useCampus';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Campus } from '@/models/Campus';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

const { campus, isError, isFetching, refetch } = useCampus();
const search = ref();
const { saveCampusMutations } = useCampusMutations();
const showEditDialog = ref(false);
const campusReq = ref<Campus>({} as Campus);
const rules = {
  country: { required },
  city: { required },
  address: { required },
  phone: { required }
};

const $v = useVuelidate(rules, campusReq);
const breadcrumbs = ref([
  {
    title: 'Administrativo',
    disabled: false,
    href: '#'
  }
]);

const headers = [
  { title: 'País', value: 'country', class: 'my-header-style' },
  { title: 'Ciudad', value: 'city' },
  { title: 'Dirección', value: 'address' },
  { title: 'Teléfono', value: 'phone' },
  { title: '', value: 'actions', width: 50 }
];

const onSaveCampus = () => {
  $v.value.$validate();
  if (!$v.value.$error) {
    saveCampusMutations.mutate(campusReq.value, {
      onError(error, variables, context) {
        showErrorToast(error as AxiosError<ErrorApiResponse>);
      },
      onSuccess(data, variables, context) {
        showEditDialog.value = false;
        $v.value.$reset();
        campusReq.value = {} as Campus;
        refetch();
      }
    });
  }
};
</script>
<template>
  <BaseBreadcrumb :title="'Sedes'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg" hover>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="campus"
            :loading="isFetching"
            hover
            class="tw:rounded-xl elevation-0 !tw:border-gray-100"
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
                  placeholder="Buscar Usuarios..."
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
                  variant="elevated"
                  color="primary"
                  @click="
                    () => {
                      campusReq = {} as Campus;
                      showEditDialog = true;
                    }
                  "
                >
                  Agregar
                </VBtn>
              </v-toolbar>
            </template>
            <template #loading>
              <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
            </template>

            <template #no-data>
              <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                <Icon icon="mdi:map-marker" height="48" class="tw:mb-4" />
                <p class="tw:text-lg">No se encontraron sedes</p>
                <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </template>
            <template #item.actions="{ item }">
              <VBtn
                icon
                variant="text"
                color="success"
                @click="
                  () => {
                    campusReq = {...item};
                    showEditDialog = true;
                  }
                "
              >
                <Icon icon="line-md:pencil-twotone" />
              </VBtn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
    <VDialog v-model="showEditDialog" max-width="500">
      <UiParentCard title="Guardar campus">
        <InputSection label="Pais">
          <VSelect
            placeholder="Seleccione un pais"
            :items="['Ecuador', 'Colombia']"
            :error-messages="$v.country.$errors.map((x) => x.$message.toString())"
            v-model="campusReq.country"
          />
        </InputSection>
        <InputSection label="Ciudad">
          <VTextField
            placeholder="Ingrese una ciudad"
            :error-messages="$v.city.$errors.map((x) => x.$message.toString())"
            v-model="campusReq.city"
          />
        </InputSection>
        <InputSection label="Telf">
          <VTextField
            placeholder="Ingrese un telefono"
            :error-messages="$v.phone.$errors.map((x) => x.$message.toString())"
            v-model="campusReq.phone"
          />
        </InputSection>
        <InputSection label="Direccion">
          <VTextarea
            placeholder="Direccion...."
            :error-messages="$v.address.$errors.map((x) => x.$message.toString())"
            v-model="campusReq.address"
          />
        </InputSection>
        <div class="tw:mt-1 tw:w-full tw:flex tw:justify-end">
          <VBtn @click="onSaveCampus" variant="elevated" color="primary">guardar</VBtn>
        </div>
      </UiParentCard>
    </VDialog>
  </v-row>
</template>

<style scoped>
.custom-card {
  max-width: 400px;
}
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}
</style>
