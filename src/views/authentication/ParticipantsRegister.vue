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
    city: { required },
    hasPsychiatricHistory: {},
    hasMedicalHistory: {},
    takesMedication: {}
  }
};

const validator = useVuelidate(rules, participant);

const step = ref(0);
const steps = [
  { title: 'Información Básica', icon: 'mdi-account-outline', complete: false },
  { title: 'Información Personal', icon: 'mdi-card-account-details-outline', complete: false },
  { title: 'Información Crítica', icon: 'mdi-shield-alert-outline', complete: false }
];

const validateStep = async () => {
  const fields = {
    0: ['name', 'email', 'password', 'phone'],
    1: ['profile.birthday', 'profile.gender', 'profile.occupation', 'profile.civilStatus', 'profile.dni', 'profile.city', 'profile.address'],
    2: []
  };

  const stepFields = fields[step.value as keyof typeof fields];
  if (!stepFields) return true;

  const stepValidator = validator.value;
  let isValid = true;

  for (const field of stepFields) {
    const fieldPath = field.split('.');
    let fieldValidator = stepValidator;
    
    for (const part of fieldPath) {
      fieldValidator = fieldValidator[part];
    }
    
    await fieldValidator.$validate();
    if (fieldValidator.$error) {
      isValid = false;
    }
  }

  steps[step.value].complete = isValid;
  return isValid;
};

const nextStep = async () => {
  if (await validateStep()) {
    step.value++;
  }
};

const prevStep = () => {
  step.value--;
};

const onSubmit = async () => {
  if (await validateStep()) {
    participant.value.token = route.params.token.toString();
    saveParticipantsMutation.mutate(participant.value);
  }
};

const showPassword = ref(false)

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
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
              <v-card elevation="0" variant="outlined" rounded="lg" class="bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="tw:grid tw:place-content-center">
                    <Logo class="mb-5 tw:w-64" />
                  </div>
                  
                  <!-- Progress Steps -->
                  <div class="mb-8">
                    <v-row justify="center" class="mb-4">
                      <v-col cols="auto" v-for="(s, i) in steps" :key="i">
                        <div class="d-flex align-center">
                          <div 
                            class="step-circle d-flex align-center justify-center" 
                            :class="{
                              'completed': s.complete,
                              'active': i === step
                            }"
                          >
                            <Icon :icon="s.icon" :class="{'text-white': i === step || s.complete}" />
                          </div>
                          <div v-if="i < steps.length - 1" class="step-line" :class="{'completed': s.complete}"></div>
                        </div>
                        <div class="text-center mt-2">
                          <span class="text-caption" :class="{'text-primary': i === step}">{{ s.title }}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <v-window v-model="step" class="mb-6">
                    <!-- Step 1: Basic Information -->
                    <v-window-item :value="0">
                      <v-card variant="flat">
                        <v-card-text>
                          <h3 class="text-h5 mb-6">Información Básica</h3>
                          <v-row>
                            <v-col cols="12" md="6">
                              <InputSection label="Nombre">
                                <VTextField 
                                  placeholder="Ingrese su nombre completo" 
                                  v-model="participant.name"
                                  :error-messages="validator.name.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.name.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Teléfono">
                                <VTextField 
                                  placeholder="0987654321" 
                                  v-model="participant.phone"
                                  :error-messages="validator.phone.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.phone.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Correo electrónico">
                                <VTextField 
                                  placeholder="example@example.com" 
                                  v-model="participant.email"
                                  :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.email.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Contraseña">
                                <VTextField 
                                  :type="showPassword ? 'text' : 'password'" 
                                  placeholder="***********"
                                  v-model="participant.password"
                                  :error-messages="validator.password.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.password.$touch()"
                                >
                                  <template #append-inner>
                                    <VBtn icon variant="text" @click="showPassword = !showPassword">
                                      <Icon v-if="showPassword" icon="mdi-eye-off" />
                                      <Icon v-else icon="mdi-eye" />
                                    </VBtn>
                                  </template>
                                </VTextField>
                              </InputSection>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-window-item>

                    <!-- Step 2: Personal Information -->
                    <v-window-item :value="1">
                      <v-card variant="flat">
                        <v-card-text>
                          <h3 class="text-h5 mb-6">Información Personal</h3>
                          <v-row>
                            <v-col cols="12" md="6">
                              <InputSection label="¿Cuándo cumples años?">
                                <VTextField 
                                  type="date" 
                                  v-model="participant.profile.birthday"
                                  :error-messages="validator.profile.birthday.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.birthday.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Género">
                                <VSelect 
                                  :items="[
                                    { label: 'Femenino', value: 'M' },
                                    { label: 'Masculino', value: 'H' }
                                  ]" 
                                  v-model="participant.profile.gender" 
                                  item-title="label" 
                                  item-value="value"
                                  :error-messages="validator.profile.gender.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.gender.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Ocupación">
                                <VTextField 
                                  placeholder="Profesional" 
                                  v-model="participant.profile.occupation"
                                  :error-messages="validator.profile.occupation.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.occupation.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Estado Civil">
                                <VSelect 
                                  :items="['Soltero', 'Casado']"
                                  v-model="participant.profile.civilStatus"
                                  :error-messages="validator.profile.civilStatus.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.civilStatus.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Identificación">
                                <VTextField 
                                  placeholder="17########" 
                                  v-model="participant.profile.dni"
                                  :error-messages="validator.profile.dni.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.dni.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Ciudad">
                                <VTextField 
                                  placeholder="Quito" 
                                  v-model="participant.profile.city"
                                  :error-messages="validator.profile.city.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.city.$touch()"
                                />
                              </InputSection>
                            </v-col>
                            <v-col cols="12">
                              <InputSection label="Dirección">
                                <VTextarea 
                                  placeholder="Av......" 
                                  v-model="participant.profile.address"
                                  :error-messages="validator.profile.address.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.address.$touch()"
                                />
                              </InputSection>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-window-item>

                    <!-- Step 3: Critical Information -->
                    <v-window-item :value="2">
                      <v-card variant="flat">
                        <v-card-text>
                          <h3 class="text-h5 mb-6">Información Crítica</h3>
                          <v-row>
                            <v-col cols="12">
                              <v-checkbox 
                                label="¿Tienes algún antecedente personal de enfermedades psiquiátricas o estás bajo tratamiento actualmente?"
                                color="primary"
                                hide-details
                                class="mb-4"
                              />
                              <v-checkbox 
                                label="¿Tienes algún antecedente médico del cuál debamos tener conocimiento?"
                                color="primary"
                                hide-details
                                class="mb-4"
                              />
                              <v-checkbox 
                                label="¿Tomas algún medicamento que altere tu conducta habitual?"
                                color="primary"
                                hide-details
                                class="mb-4"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-window-item>
                  </v-window>

                  <!-- Navigation Buttons -->
                  <v-card-actions class="px-4">
                    <v-btn
                      v-if="step > 0"
                      variant="outlined"
                      @click="prevStep"
                      class="mr-2"
                    >
                      <Icon icon="mdi-arrow-left" class="mr-2"/>
                      Anterior
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="step < 2"
                      color="primary"
                      @click="nextStep"
                      :loading="validator?.value?.$pending"
                    >
                      Siguiente
                      <Icon icon="mdi-arrow-right" class="ml-2"/>
                    </v-btn>
                    <v-btn
                      v-else
                      color="success"
                      @click="onSubmit"
                      :loading="saveParticipantsMutation.isPending.value"
                    >
                      <Icon icon="mdi-check" class="mr-2"/>
                      Finalizar Registro
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
}

.step-circle.active {
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.step-circle.completed {
  background-color: rgb(var(--v-theme-success));
  border-color: rgb(var(--v-theme-success));
}

.step-line {
  width: 100px;
  height: 2px;
  background-color: #e2e8f0;
  margin: 0 -20px;
  transition: all 0.3s ease;
}

.step-line.completed {
  background-color: rgb(var(--v-theme-success));
}

.v-window {
  border-radius: 8px;
  overflow: hidden;
}

.v-window-item {
  transition: all 0.3s ease;
}

:deep(.v-window__container) {
  border-radius: 8px;
}

.v-card {
  transition: all 0.3s ease;
}
</style>
