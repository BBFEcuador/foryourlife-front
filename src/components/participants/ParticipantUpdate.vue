<script setup lang="ts">
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { Participant, ParticipantUpdate } from '@/models/Participants';
import type { AxiosError } from 'axios';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import InputSection from '../forms/InputSection.vue';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast } from '@/service/sweetAlert';
import { VDateInput } from 'vuetify/labs/VDateInput';

const props = defineProps<props>();
const emits = defineEmits(['onSubmit']);
interface props {
  participant: Participant;
}

const { updateParticipantMutation } = useParticipantMutations();

const onSubmitParticipant = () => {
  let participantUpdate = { ...props.participant };
  updateParticipantMutation.mutate(participantUpdate);
};

watch(updateParticipantMutation.isError, () => {
  if (updateParticipantMutation.isError.value) {
    const error = updateParticipantMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(updateParticipantMutation.isSuccess, () => {
  if (updateParticipantMutation.isSuccess.value) {
    toast.success('Actualizado', {
      autoClose: 3000,
      closeButton: true
    });
  }
});

const formattedBirthday = computed({
  get: () => new Date(props.participant.profile.birthday?.split('T')[0]) || '',
  set: (value) => (props.participant.profile.birthday = value.toISOString().split('T')[0])
});
</script>

<template>
  <v-card elevation="0">
    <v-card-item>
      <h4 class="text-h4 mb-2 font-weight-bold">Información personal</h4>
      <div class="d-flex tw:gap-x-2">
        <v-text-field v-model="props.participant.user.name1" label="Nombre 1" variant="outlined" />
        <v-text-field v-model="props.participant.user.name2" label="Nombre 2" variant="outlined" />
      </div>
      <div class="d-flex tw:gap-x-2">
        <v-text-field v-model="props.participant.user.lastname1" label="Apellido 1" variant="outlined" />
        <v-text-field v-model="props.participant.user.lastname2" label="Apellido 2" variant="outlined" />
      </div>
      <v-text-field v-model="props.participant.user.email" label="Correo Electrónico" variant="outlined" />
      <v-text-field v-model="props.participant.user.phone" label="Teléfono" variant="outlined" />
      <div class="d-flex tw:gap-x-2">
        <v-text-field v-model="props.participant.profile.dni" label="Cédula" variant="outlined" />
        <v-text-field v-model="props.participant.profile.civilStatus" label="Estado Civil" variant="outlined" />
      </div>
      <v-row dense>
        <v-col cols="12" md="6">
          <VDateInput v-model="formattedBirthday" label="Fecha de nacimiento" variant="outlined"></VDateInput>
        </v-col>
        <v-col cols="12" md="6">
          <v-select :items="[
            { label: 'Femenino', value: 'M' },
            { label: 'Masculino', value: 'H' }
          ]" item-title="label" item-value="value" label="Género" variant="outlined"
            v-model="props.participant.profile.gender" />
        </v-col>
      </v-row>
      <v-text-field v-model="props.participant.profile.occupation" label="Ocupación" variant="outlined" />

      <!-- <VDateInput placeholder="" v-model="props.participant.profile.birthday" label="Fecha de nacimiento" variant="outlined"></VDateInput> -->
      <v-text-field v-model="props.participant.profile.city" label="Ciudad" variant="outlined" />
      <v-text-field v-model="props.participant.profile.address" label="Dirección" variant="outlined" />

      <v-spacer />
      <v-btn color="primary" @click="onSubmitParticipant"
        :loading="updateParticipantMutation.isPending.value">Actualizar</v-btn>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
