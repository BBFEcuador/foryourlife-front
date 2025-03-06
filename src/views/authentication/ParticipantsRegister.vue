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
import AuthRegister from './authForms/AuthRegister.vue';
import Logo from '@/layouts/admin/logo/Logo.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { toast } from 'vue3-toastify';

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
    toast.success('Participante Agregado, ingresa con tus credenciales.', {
            autoClose: 3000,
            closeButton: true
        });
  }
});

const showPassword = ref(false)
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class=" bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="tw:grid tw:place-content-center">
                    <Logo class="mb-5 tw:w-64" />
                  </div>
                  <h3 class="text-h3 text-center pb-3" >Bienvenido! A continuación ingresa los siguientes datos para acceder a tu programa. 🚀  </h3>
                  <VRow>
                    <VCol cols="12" md="6">
                      <UiParentCard title="Información Básica">
                        <InputSection label="Nombre">
                          <VTextField placeholder="Ingrese su nombre completo" v-model="participant.name"
                            :error-messages="validator.name.$errors.map((x) => x.$message.toString())"></VTextField>
                        </InputSection>
                        <InputSection label="Telefono">
                          <VTextField placeholder="0987654321" v-model="participant.phone"
                            :error-messages="validator.phone.$errors.map((x) => x.$message.toString())"></VTextField>
                        </InputSection>
                        <InputSection label="Correo electrónico">
                          <VTextField placeholder="example@example.com" v-model="participant.email"
                            :error-messages="validator.email.$errors.map((x) => x.$message.toString())"></VTextField>
                        </InputSection>
                        <InputSection label="Contraseña">
                          <VTextField :type="showPassword ? 'text' : 'password'" placeholder="***********"
                            v-model="participant.password"
                            :error-messages="validator.password.$errors.map((x) => x.$message.toString())">
                            <template #append-inner>
                              <VBtn icon variant="text" @click="showPassword = !showPassword">
                                <Icon v-if="showPassword" icon="mdi-eye-off" />
                                <Icon v-else icon="mdi-eye" />
                              </VBtn>
                            </template>
                          </VTextField>
                        </InputSection>
                      </UiParentCard>
                    </VCol>
                    <VCol cols="12" md="6">
                      <UiParentCard title="Info perfil">
                        <InputSection label="¿Cuándo cumples años?">
                          <VTextField placeholder="Fecha" type="date" v-model="participant.profile.birthday"
                            :error-messages="validator.profile.birthday.$errors.map((x) => x.$message.toString())">
                          </VTextField>
                        </InputSection>
                        <InputSection label="Género">
                          <VSelect placeholder="Género" :items="[
                            { label: 'Femenino', value: 'M' },
                            { label: 'Masculino', value: 'H' }
                          ]" v-model="participant.profile.gender" item-title="label" item-value="value"
                            :error-messages="validator.profile.gender.$errors.map((x) => x.$message.toString())">
                          </VSelect>
                        </InputSection>
                        <InputSection label="Ocupación">
                          <VTextField placeholder="Profesional" v-model="participant.profile.occupation"
                            :error-messages="validator.profile.occupation.$errors.map((x) => x.$message.toString())">
                          </VTextField>
                        </InputSection>
                        <InputSection label="Estado Civil">
                          <VSelect placeholder="Soltero" :items="['Soltero', 'Casado']"
                            v-model="participant.profile.civilStatus"
                            :error-messages="validator.profile.civilStatus.$errors.map((x) => x.$message.toString())">
                          </VSelect>
                        </InputSection>
                        <InputSection label="Identificación">
                          <VTextField placeholder="17########" v-model="participant.profile.dni"
                            :error-messages="validator.profile.dni.$errors.map((x) => x.$message.toString())">
                          </VTextField>
                        </InputSection>
                        <InputSection label="Ciudad">
                          <VTextField placeholder="Quito" v-model="participant.profile.city"
                            :error-messages="validator.profile.city.$errors.map((x) => x.$message.toString())">
                          </VTextField>
                        </InputSection>
                        <InputSection label="Dirección">
                          <VTextarea placeholder="Av......" v-model="participant.profile.address"
                            :error-messages="validator.profile.address.$errors.map((x) => x.$message.toString())">
                          </VTextarea>
                        </InputSection>
                      </UiParentCard>
                    </VCol>
                    <VCol>
                      <div class="w-full d-flex justify-end">
                        <VBtn color="primary" variant="elevated" @click="onSubmit">Crear</VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.loginBox {
  max-width: 800;
  margin: 0 auto;
}
</style>
