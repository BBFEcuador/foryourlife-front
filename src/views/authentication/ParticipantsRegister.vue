<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useParticipantsMutations from '@/composables/participants/useParticipantsMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import { showErrorToast } from '@/service/sweetAlert';
import useVuelidate from '@vuelidate/core';
import { email, numeric, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const participant = ref<Participant>({ profile: {} } as Participant);
const { saveParticipantsMutation } = useParticipantsMutations();
const route = useRoute();

const rules = {
  name: { required },
  email: { required, email },
  password: { required },
  phone: { required, numeric },
  profile: {
    birthday: { required },
    address: { required },
    occupation: { required },
    gender: { required },
    civilStatus: { required },
    dni: { required },
    city: { required }
  }
};

const validator = useVuelidate(rules, participant);

const onSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    participant.value.token = route.params.token.toString();
    saveParticipantsMutation.mutate(participant.value);
  }
};

watch(saveParticipantsMutation.isError, () => {
  if (saveParticipantsMutation.isError.value) {
    const error = saveParticipantsMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveParticipantsMutation.isSuccess, () => {
  if (saveParticipantsMutation.isSuccess.value) {
    alert('sexoo');
  }
});
</script>

<template>
  <v-container>
    <VRow>
      <VCol cols="12" md="6">
        <UiParentCard title="Info usuario">
          <InputSection label="Nombre">
            <VTextField
              placeholder="Ingrese su nombre completo"
              v-model="participant.name"
              :error-messages="validator.name.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Telefono">
            <VTextField
              placeholder="Telefono"
              v-model="participant.phone"
              :error-messages="validator.phone.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="E-mail">
            <VTextField
              placeholder="Correo"
              v-model="participant.email"
              :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Contraseña">
            <VTextField
              placeholder="Pass"
              v-model="participant.password"
              :error-messages="validator.password.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
        </UiParentCard>
      </VCol>
      <VCol cols="12" md="6">
        <UiParentCard title="Info perfil">
          <InputSection label="Cumpleaños">
            <VTextField
              placeholder="Fecha"
              type="date"
              v-model="participant.profile.birthday"
              :error-messages="validator.profile.birthday.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Genero">
            <VSelect
              placeholder="Genero"
              :items="[
                { label: 'Mujer', value: 'M' },
                { label: 'Hombre', value: 'H' }
              ]"
              v-model="participant.profile.gender"
              item-title="label"
              item-value="value"
              :error-messages="validator.profile.gender.$errors.map((x) => x.$message.toString())"
            ></VSelect>
          </InputSection>
          <InputSection label="Ocupacion">
            <VTextField
              placeholder="Fecha"
              v-model="participant.profile.occupation"
              :error-messages="validator.profile.occupation.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Estatus Civil">
            <VSelect
              placeholder="Estatus Civil"
              :items="['Soltero', 'Casado']"
              v-model="participant.profile.civilStatus"
              :error-messages="validator.profile.civilStatus.$errors.map((x) => x.$message.toString())"
            ></VSelect>
          </InputSection>
          <InputSection label="DNI">
            <VTextField
              placeholder="Documento de identidad"
              v-model="participant.profile.dni"
              :error-messages="validator.profile.dni.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Ciudad">
            <VTextField
              placeholder="Fecha"
              v-model="participant.profile.city"
              :error-messages="validator.profile.city.$errors.map((x) => x.$message.toString())"
            ></VTextField>
          </InputSection>
          <InputSection label="Direccion">
            <VTextarea
              placeholder=""
              v-model="participant.profile.address"
              :error-messages="validator.profile.address.$errors.map((x) => x.$message.toString())"
            ></VTextarea>
          </InputSection>
        </UiParentCard>
      </VCol>
      <VCol>
        <div class="w-full d-flex justify-end">
          <VBtn color="primary" variant="elevated" @click="onSubmit">Crear</VBtn>
        </div>
      </VCol>
    </VRow>
  </v-container>
</template>

<style scoped></style>
