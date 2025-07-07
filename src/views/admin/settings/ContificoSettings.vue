<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { adminStore } from '@/stores/adminStore';
import useContificoSettingsMutations from '@/composables/admin/contifico/useContificoConfigMutation';
import useContificoConfigByCampus from '@/composables/admin/contifico/useContificoConfig';
import type { ContificoConfigRequest } from '@/models/Contifico';
import type { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';

const apiToken = ref('');
const authorization = ref('');

const disableConfig = computed(() => !adminStore().isCampusSelected);
const campusId = ref(adminStore().selectCampusId);

const { saveContificoSettingsMutation } = useContificoSettingsMutations();
const { contificoConfig, refetchContificoConfig } = useContificoConfigByCampus(campusId);

const prevKey = computed(() => '*'.repeat((contificoConfig.value?.apiKey || '').length));
const prevAuth = computed(() => '*'.repeat((contificoConfig.value?.apiSecret || '').length));

const handleSaveConfiguration = async () => {
  const configReq: ContificoConfigRequest = {
    campusId: campusId.value,
    apiKey: apiToken.value,
    apiSecret: authorization.value
  };

  await saveContificoSettingsMutation.mutateAsync(configReq, {
    onSuccess: () => {
      toast.success('Configuración guardada');
      refetchContificoConfig();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al guardar la configuración');
    }
  });
};
</script>
<template>
  <v-card class="d-flex align-center" elevation="0" :disabled="disableConfig">
    <div class="tw:font-semibold tw:w-3/12">Accesos</div>
    <div class="tw:w-8/12 tw:border-l tw:border-gray-200 pl-4">
      <div class="d-flex align-center tw:gap-x-3">
        <p class="tw:font-medium tw:md:w-4/12">Api Token</p>
        <v-text-field v-model="apiToken" :placeholder="prevKey" persistent-hint variant="outlined"></v-text-field>
      </div>
      <v-spacer class="ma-2" />
      <div class="d-flex align-center tw:gap-x-3">
        <p class="tw:font-medium tw:md:w-4/12">Autorización</p>
        <v-text-field v-model="authorization" :placeholder="prevAuth" variant="outlined" dense hide-details></v-text-field>
      </div>
    </div>
    <v-btn class="ml-2" color="success" variant="flat" @click="handleSaveConfiguration">Guardar</v-btn>
  </v-card>
  <v-divider class="tw:border tw:border-gray-200 ma-2"></v-divider>
</template>
