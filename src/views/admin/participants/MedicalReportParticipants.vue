<script setup lang="ts">
import IntroCard from '@/components/participants/IntroCard.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import InvitedEnrolled from '@/components/participants/InvitedEnrolled.vue';
import ParticipantBanner from '@/components/participants/ParticipantBanner.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import useParticipant from '@/composables/admin/participants/useParticipant';
import useMedicalRecordParticipant from '@/composables/admin/participants/useMedicalRecordParticipant';
import { ref, watch, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { MedicalRecord } from '@/models/Participants';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { AxiosError } from 'axios';
import { showErrorToast } from '@/service/sweetAlert';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { toast } from 'vue3-toastify';

const route = useRoute();

const breadcrumbs = ref([
  {
    title: 'Participantes',
    disabled: false,
    href: '/admin/participants'
  }
]);
const { isMedicalRecordError, isMedicalRecordLoading, medicalRecord, medicalRecordError, refetchMedicalRecord } =
  useMedicalRecordParticipant(route.params.id.toString());
const { isParticipantError, isParticipantLoading, participant } = useParticipant(route.params.id.toString());

const isLoading = computed(() => isMedicalRecordLoading.value || isParticipantLoading.value);

const isError = computed(() => (isMedicalRecordError.value || isParticipantError.value) && medicalRecordStatus.value !== 404);

const medicalRecordStatus = computed(() => {
  const err = medicalRecordError.value as AxiosError | null;
  return err?.response?.status ?? 200;
});

const reqMedical = ref<MedicalRecord>({
  medical_history_detail: 'N/A',
  medication_history_detail: 'N/A',
  psychiatric_history_detail: 'N/A'
} as MedicalRecord);

const hasMedication = ref(false);

const rules = {
  medication_history_detail: { required }
};

const validator = useVuelidate(rules, reqMedical);

const { updateMedicalRecordMutation, createMedicalRecordMutation } = useParticipantMutations();
const onMedicalSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    const medicalRecordId = medicalRecord.value.id;
    if (medicalRecordStatus.value === 404) {
      reqMedical.value.participantId = route.params.id.toString();
      createMedicalRecordMutation.mutate(
        { medicalRecord: reqMedical.value },
        {
          onSuccess: () => {
            refetchMedicalRecord();
            toast.success('Récord médico creado exitosamente');
          },
          onError: (error) => {
            const e = error as AxiosError<ErrorApiResponse>;
            showErrorToast(e);
          }
        }
      );
    } else {
      updateMedicalRecordMutation.mutate(
        { id: medicalRecordId, medicalRecord: reqMedical.value },
        {
          onSuccess: () => {
            toast.success('Récord médico actualizado exitosamente');
          },
          onError: (error) => {
            const e = error as AxiosError<ErrorApiResponse>;
            showErrorToast(e);
          }
        }
      );
    }
  }
};

const isInitializing = ref(false);
watch(
  medicalRecord,
  async (value) => {
    if (!value) return;

    isInitializing.value = true;

    reqMedical.value = {
      medical_history_detail: value.medical_history_detail ?? 'N/A',
      medication_history_detail: value.medication_history_detail ?? 'N/A',
      psychiatric_history_detail: value.psychiatric_history_detail ?? 'N/A',
      id: value.id
    } as MedicalRecord;

    hasMedication.value = !!value.medication_history_detail && value.medication_history_detail !== 'N/A';

    await nextTick();
    isInitializing.value = false;
  },
  { immediate: true }
);
watch(hasMedication, (val) => {
  if (isInitializing.value) return;

  if (val) {
    reqMedical.value.medication_history_detail = '';
  } else {
    reqMedical.value.medication_history_detail = 'N/A';
  }
});
const isSaving = computed(() => {
  return updateMedicalRecordMutation.isPending.value || createMedicalRecordMutation.isPending.value;
});
</script>
<template>
  <BaseBreadcrumb :title="'Récord Médico'" :breadcrumbs="breadcrumbs" />
  <div v-if="checkPermission(PermissionEnum.UPDATE_PARTICIPANTS)">
    <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" size="80" width="8">
        <template #default="slotProps"></template>
      </v-progress-circular>
    </v-col>
    <v-col cols="12" v-else-if="isError">
      <v-card elevation="0" rounded="xl">
        <v-card-text>
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
            <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
            <p class="tw:text-lg text-center">Error al cargar el record médico</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <div v-else>
      <ParticipantBanner :participant="participant" />
      <v-row dense class="mt-4">
        <VCol cols="12" md="4" sm="12" class="tw:flex tw:flex-col tw:items-center tw:gap-y-4">
          <IntroCard :participant="participant" />
          <InvitedEnrolled :token="participant.invitationToken" :id="participant.id" />
        </VCol>
        <VCol cols="12" md="8" sm="12" class="tw:flex tw:flex-col tw:items-center">
          <v-card variant="flat">
            <v-card-text>
              <h3 class="text-h5 mb-6">Información</h3>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    label="¿Tienes algún antecedente personal de enfermedades psiquiátricas o estás bajo tratamiento actualmente?"
                    color="primary"
                    hide-details
                    true-value="si"
                    false-value="N/A"
                    v-model="reqMedical.psychiatric_history_detail"
                    class="mb-4"
                  />
                  <v-checkbox
                    label="¿Tienes algún antecedente médico del cuál debamos tener conocimiento?"
                    color="primary"
                    hide-details
                    true-value="si"
                    false-value="N/A"
                    v-model="reqMedical.medical_history_detail"
                    class="mb-4"
                  />
                  <v-checkbox
                    label="¿Tomas algún medicamento que altere tu conducta habitual?"
                    color="primary"
                    hide-details
                    v-model="hasMedication"
                    class="mb-4"
                  />
                </v-col>
                <VCol cols="12" v-if="hasMedication">
                  <InputSection label="Medicamentos">
                    <VTextarea
                      placeholder="Medicamento.."
                      v-model="reqMedical.medication_history_detail"
                      :error-messages="validator.medication_history_detail.$errors.map((x: any) => x.$message.toString())"
                      @update:model-value="validator.medication_history_detail.$touch()"
                    />
                  </InputSection>
                </VCol>
              </v-row>
              <v-row>
                <v-col cols="12" class="tw:flex tw:justify-end">
                  <v-btn color="primary" @click="onMedicalSubmit" :loading="isSaving"
                    ><Icon icon="mdi-content-save" height="20" class="ml-1" /> Guardar</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </VCol>
      </v-row>
    </div>
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

<style scoped></style>
