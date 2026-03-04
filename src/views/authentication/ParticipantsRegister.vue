<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import PhoneList from '@/components/forms/PhoneList.vue';
import useParticipantsMutations from '@/composables/participants/useParticipantsMutations';
import Logo from '@/layouts/admin/logo/Logo.vue';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { SaveParticipantReq } from '@/models/Participants';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import type { CountryCode } from 'libphonenumber-js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { VSelect } from 'vuetify/components';

const participant = ref<SaveParticipantReq>({
  profile: {},
  contact: {},
  medicalRecord: {
    medical_history_detail: 'N/A',
    medication_history_detail: 'N/A',
    psychiatric_history_detail: 'N/A'
  },
  termsAndConditions: false
} as SaveParticipantReq);
const { saveParticipantsMutation } = useParticipantsMutations();
const route = useRoute();
const docType = ['Cédula', 'Pasaporte'];
const selectDocType = ref('Cédula');

const hasMedication = ref(false);
const hasMedicalHistory = ref(false);
const hasPsychiatricHistory = ref(false);

watch(hasMedication, (val) => {
  if (val) {
    participant.value.medicalRecord.medication_history_detail = '';
  } else {
    participant.value.medicalRecord.medication_history_detail = 'N/A';
  }
});

watch(hasMedicalHistory, (val) => {
  if (val) {
    participant.value.medicalRecord.medical_history_detail = '';
  } else {
    participant.value.medicalRecord.medical_history_detail = 'N/A';
  }
});

watch(hasPsychiatricHistory, (val) => {
  if (val) {
    participant.value.medicalRecord.psychiatric_history_detail = '';
  } else {
    participant.value.medicalRecord.psychiatric_history_detail = 'N/A';
  }
});

watch(selectDocType, () => {
  participant.value.profile.dni = '';
});

// Make sure passport is always stored in uppercase
watch(
  () => participant.value.profile.dni,
  (newValue) => {
    if (selectDocType.value !== 'Cédula' && newValue) {
      participant.value.profile.dni = newValue.toUpperCase();
    }
  }
);

const selectedCountry = ref('EC' as CountryCode);

const onCountryChange = (country: string) => {
  selectedCountry.value = country as CountryCode;
};

const phoneValidator = (value: string | undefined | null): boolean => {
  if (!value) return true;

  const phoneNumber = parsePhoneNumberFromString(value);
  return phoneNumber ? phoneNumber.isValid() : false;
};

const phoneValidationMessage = () => {
  return `Por favor ingrese un número de teléfono válido`;
};

const rules = {
  name1: {
    required: { ...required, $message: 'Debe ingresar su primer nombre' }
  },
  nickname: {
    required: { ...required, $message: 'Debe ingresar su nickname' }
  },
  lastname1: {
    required: { ...required, $message: 'Debe ingresar su primer apellido' }
  },
  lastname2: {
    required: { ...required, $message: 'Debe ingresar su segundo apellido' }
  },
  email: {
    required: { ...required, $message: 'Debe ingresar un correo electrónico' },
    email: { ...email, $message: 'Ingrese un correo electrónico válido' }
  },
  password: {
    required: { ...required, $message: 'Debe ingresar una contraseña' },
    hasSpecialChar: {
      $validator: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      $message: 'La contraseña debe contener al menos un carácter especial'
    },
    minLength: {
      $validator: (value: string) => value.length >= 8,
      $message: 'La contraseña debe tener al menos 8 caracteres'
    }
  },
  phone: {
    required: { ...required, $message: 'Debe ingresar un número de teléfono' },
    phoneValidator: {
      $validator: phoneValidator,
      $message: phoneValidationMessage
    }
  },
  profile: {
    birthday: {
      required: { ...required, $message: 'Debe ingresar su fecha de nacimiento' }
    },
    address: {
      required: { ...required, $message: 'Debe ingresar su dirección' }
    },
    occupation: {
      required: { ...required, $message: 'Debe ingresar su ocupación' }
    },
    gender: {
      required: { ...required, $message: 'Debe seleccionar su género' }
    },
    civilStatus: {
      required: { ...required, $message: 'Debe seleccionar su estado civil' }
    },
    dni: {
      required: { ...required, $message: () => `Debe ingresar su ${selectDocType.value}` },
      numeric: {
        $validator: () => {
          if (selectDocType.value == 'Cédula') {
            return participant.value.profile.dni.match('^[0-9]+$');
          } else {
            return true;
          }
        },
        $message: 'La cédula debe contener solo números'
      },
      length: {
        $validator: () => {
          if (selectDocType.value == 'Cédula') {
            return participant.value.profile.dni.length == 10;
          } else {
            return true;
          }
        },
        $message: 'La cédula debe tener exactamente 10 dígitos'
      }
    },
    city: {
      required: { ...required, $message: 'Debe seleccionar su ciudad' }
    },
    hasPsychiatricHistory: {
      required: { ...required, $message: 'Debe responder esta pregunta' }
    },
    hasMedicalHistory: {
      required: { ...required, $message: 'Debe responder esta pregunta' }
    },
    takesMedication: {
      required: { ...required, $message: 'Debe responder esta pregunta' }
    }
  },
  contact: {
    name: {
      required: { ...required, $message: 'Debe ingresar el nombre del contacto' }
    },
    lastname: {
      required: { ...required, $message: 'Debe ingresar el apellido del contacto' }
    },
    relationship: {
      required: { ...required, $message: 'Debe ingresar la relación con el contacto' }
    },
    phone: {
      required: { ...required, $message: 'Debe ingresar un número de teléfono de contacto' },
      phoneValidator: {
        $validator: phoneValidator,
        $message: phoneValidationMessage
      }
    }
  },
  medicalRecord: {
    medication_history_detail: { required: { ...required, $message: 'Debe ingresar un número de teléfono de contacto' } },
    medical_history_detail: { required: { ...required, $message: 'Debe ingresar un número de teléfono de contacto' } },
    psychiatric_history_detail: { required: { ...required, $message: 'Debe ingresar un número de teléfono de contacto' } }
  },
  termsAndConditions: {
    required: { ...required, $message: 'Debe aceptar los términos y condiciones' },
    isTrue: {
      $validator: (value: boolean) => value === true,
      $message: 'Debe aceptar los términos y condiciones'
    }
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
    0: ['name1', 'nickname', 'lastname1', 'lastname2', 'email', 'password', 'phone', 'contact.name', 'contact.lastname', 'contact.relationship', 'contact.phone'],
    1: [
      'profile.birthday',
      'profile.gender',
      'profile.occupation',
      'profile.civilStatus',
      'profile.dni',
      'profile.city',
      'profile.address'
    ],
    2: [
      'medicalRecord.medication_history_detail',
      'medicalRecord.medical_history_detail',
      'medicalRecord.psychiatric_history_detail',
      'termsAndConditions'
    ]
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
    participant.value.contact.name = participant.value.contact.name + " " + participant.value.contact.lastname
    saveParticipantsMutation.mutate(participant.value);
  }
};

const showPassword = ref(false);

watch(saveParticipantsMutation.isError, () => {
  if (saveParticipantsMutation.isError.value) {
    const error = saveParticipantsMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

const router = useRouter();
watch(saveParticipantsMutation.isSuccess, () => {
  if (saveParticipantsMutation.isSuccess.value) {
    toast.success('Registro exitoso. Por favor inicia sesión.', {
      autoClose: 2000,
      closeButton: true,
      onClose: () => router.push({ name: 'login-user', query: { registered: 'true' } })
    });
    router.push({ name: 'login-user', query: { registered: 'true' } });
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
                      <v-col v-for="(s, i) in steps" :key="i" cols="auto">
                        <div class="d-flex align-center">
                          <div class="step-circle d-flex align-center justify-center" :class="{
                            completed: s.complete,
                            active: i === step
                          }">
                            <Icon :icon="s.icon" :class="{ 'text-white': i === step || s.complete }" />
                          </div>
                          <div v-if="i < steps.length - 1" class="step-line" :class="{ completed: s.complete }"></div>
                        </div>
                        <div class="text-center mt-2">
                          <span class="text-caption" :class="{ 'text-primary': i === step }">{{ s.title }}</span>
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
                              <InputSection label="Nombre 1*">
                                <VTextField v-model="participant.name1" placeholder="Ingrese sus nombre"
                                  :error-messages="validator.name1.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.name1.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Nombre 2">
                                <VTextField v-model="participant.name2" placeholder="Ingrese sus nombre" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Apellido 1*">
                                <VTextField v-model="participant.lastname1" placeholder="Ingrese sus apellido"
                                  :error-messages="validator.lastname1.$errors.map((x: any) => x.$message.toString())"
                                  @update:model-value="validator.lastname1.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Apellido 2*">
                                <VTextField v-model="participant.lastname2" placeholder="Ingrese sus apellido"
                                  :error-messages="validator.lastname2.$errors.map((x: any) => x.$message.toString())"
                                  @update:model-value="validator.lastname2.$touch()" />
                              </InputSection>
                            </v-col>

                            <v-col cols="12" md="6">
                              <InputSection label="Como prefiere que le llamen*">
                                <VTextField v-model="participant.nickname" placeholder="nickname*"
                                  :error-messages="validator.nickname.$errors.map((x: any) => x.$message.toString())"
                                  @update:model-value="validator.nickname.$touch()" />
                              </InputSection>
                            </v-col>

                            <v-col cols="12" md="6">
                              <InputSection label="Teléfono*">
                                <PhoneList v-model="participant.phone" required :error="validator.phone.$errors.length
                                  ? validator.phone.$errors.map((x) => x.$message.toString()).join(', ')
                                  : ''
                                  " @update:model-value="validator.phone.$touch()" @country-change="onCountryChange" />
                              </InputSection>
                            </v-col>

                            <v-col cols="12" md="6">
                              <InputSection label="Correo electrónico*" type="email">
                                <VTextField v-model="participant.email" placeholder="example@example.com"
                                  :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.email.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Contraseña*">
                                <VTextField v-model="participant.password" :type="showPassword ? 'text' : 'password'"
                                  persistent-hint placeholder="***********"
                                  :error-messages="validator.password.$errors.map((x) => x.$message.toString())"
                                  hint="Con esta Contraseña podrá acceder a su portal de participante"
                                  @update:model-value="validator.password.$touch()">
                                  <template #append-inner>
                                    <VBtn icon variant="text" @click="showPassword = !showPassword">
                                      <Icon v-if="showPassword" icon="mdi-eye-off" />
                                      <Icon v-else icon="mdi-eye" />
                                    </VBtn>
                                  </template>
                                </VTextField>
                              </InputSection>
                            </v-col>
                            <v-col cols="12">
                              <p class="text-h5 mb-3">Contacto de emergencia</p>
                              <v-row>
                                <v-col cols="12" md="6">
                                  <InputSection label="Nombre">
                                    <VTextField v-model="participant.contact.name" placeholder="Ingrese el nombre" 
                                      :error-messages="validator.contact.name.$errors.map((x) => x.$message.toString())"
                                      @update:model-value="validator.contact.name.$touch()" />
                                  </InputSection>
                                </v-col>
                                <v-col cols="12" md="6">
                                  <InputSection label="Apellido">
                                    <VTextField v-model="participant.contact.lastname" placeholder="Ingrese el apellido" 
                                      :error-messages="validator.contact.lastname.$errors.map((x) => x.$message.toString())"
                                      @update:model-value="validator.contact.lastname.$touch()" />
                                  </InputSection>
                                </v-col>
                                <v-col cols="12" md="6">
                                  <InputSection label="Número de contacto">
                                    <PhoneList v-model="participant.contact.phone" required :error="validator.contact.phone.$errors.length
                                      ? validator.contact.phone.$errors.map((x) => x.$message.toString()).join(', ')
                                      : ''
                                      " @update:model-value="validator.contact.phone.$touch()"
                                      @country-change="onCountryChange" />
                                  </InputSection>
                                </v-col>
                                <v-col cols="12" md="6">
                                  <InputSection label="Parentesco">
                                    <VTextField v-model="participant.contact.relationship" placeholder="Ingrese el parentesco"
                                      :error-messages="validator.contact.relationship.$errors.map((x) => x.$message.toString())"
                                      @update:model-value="validator.contact.relationship.$touch()" />
                                  </InputSection>
                                </v-col>
                              </v-row>
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
                              <InputSection label="¿Fecha de Nacimiento?">
                                <VTextField v-model="participant.profile.birthday" type="date"
                                  :error-messages="validator.profile.birthday.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.birthday.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Género">
                                <VSelect v-model="participant.profile.gender" :items="[
                                  { label: 'Femenino', value: 'M' },
                                  { label: 'Masculino', value: 'H' }
                                ]" item-title="label" item-value="value"
                                  :error-messages="validator.profile.gender.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.gender.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Ocupación">
                                <VTextField v-model="participant.profile.occupation" placeholder="Profesional"
                                  :error-messages="validator.profile.occupation.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.occupation.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Estado Civil">
                                <VSelect v-model="participant.profile.civilStatus" :items="['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión de Hecho']"
                                  :error-messages="validator.profile.civilStatus.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.civilStatus.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12" md="6">
                              <InputSection label="Tipo de Identificación">
                                <VSelect v-model="selectDocType" :items="docType" />
                              </InputSection>
                            </v-col>
                            <v-col v-if="selectDocType == 'Cédula'" cols="12" md="6">
                              <InputSection label="Cédula">
                                <VTextField v-model="participant.profile.dni" inputmode="numeric"
                                  pattern="[0-9]*" maxlength="10" class="hide-spin-buttons" placeholder="17########"
                                  :error-messages="validator.profile.dni.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.dni.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col v-else cols="12" md="6">
                              <InputSection label="Pasaporte">
                                <VTextField v-model="participant.profile.dni" placeholder="L7283I" 
                                  :error-messages="validator.profile.dni.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.dni.$touch()"
                                  @input="participant.profile.dni = $event.target.value.toUpperCase()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12">
                              <InputSection label="Ciudad">
                                <VTextField v-model="participant.profile.city"placeholder="Quito"
                                  :error-messages="validator.profile.city.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.city.$touch()" />
                              </InputSection>
                            </v-col>
                            <v-col cols="12">
                              <InputSection label="Dirección domiciliaria">
                                <VTextarea v-model="participant.profile.address" placeholder="Av......"
                                  :error-messages="validator.profile.address.$errors.map((x) => x.$message.toString())"
                                  @update:model-value="validator.profile.address.$touch()" />
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
                          <v-row v-auto-animate>
                            <v-col cols="12" class="pb-0">
                              <!-- Antecedentes Psiquiátricos -->
                              <v-checkbox v-model="hasPsychiatricHistory" class="mb-4"
                                label="¿Tienes algún antecedente personal de enfermedades psiquiátricas o estás bajo tratamiento actualmente?"
                                color="primary" hide-details  />
                              <VExpandTransition>
                                <div v-if="hasPsychiatricHistory" class="mb-4 pl-4">
                                  <InputSection label="Detalle Psiquiátrico">
                                    <VTextField v-model="participant.medicalRecord.psychiatric_history_detail" placeholder="Especifique condición y tratamiento..."
                                      :error-messages="validator.medicalRecord.psychiatric_history_detail.$errors.map((x: any) => x.$message.toString())"
                                      @update:model-value="validator.medicalRecord.psychiatric_history_detail.$touch()" />
                                  </InputSection>
                                </div>
                              </VExpandTransition>

                              <!-- Antecedentes Médicos -->
                              <v-checkbox v-model="hasMedicalHistory" label="¿Tienes algún antecedente médico del cuál debamos tener conocimiento?"
                                color="primary" hide-details class="mb-4" />
                              <VExpandTransition>
                                <div v-if="hasMedicalHistory" class="mb-4 pl-4">
                                  <InputSection label="Detalle Médico">
                                    <VTextField v-model="participant.medicalRecord.medical_history_detail" placeholder="Especifique condición..."
                                      :error-messages="validator.medicalRecord.medical_history_detail.$errors.map((x: any) => x.$message.toString())"
                                      @update:model-value="validator.medicalRecord.medical_history_detail.$touch()" />
                                  </InputSection>
                                </div>
                              </VExpandTransition>

                              <!-- Medicación -->
                              <v-checkbox v-model="hasMedication" label="¿Tomas algún medicamento que altere tu conducta habitual?"
                                color="primary" hide-details class="mb-4" />
                              <VExpandTransition>
                                <div v-if="hasMedication" class="mb-4 pl-4">
                                  <InputSection label="Medicamento y Diagnóstico">
                                    <VTextField v-model="participant.medicalRecord.medication_history_detail" placeholder="Ej: Losartán 50mg para hipertensión"
                                      :error-messages="validator.medicalRecord.medication_history_detail.$errors.map((x: any) => x.$message.toString())
                                        "
                                      @update:model-value="validator.medicalRecord.medication_history_detail.$touch()" />
                                  </InputSection>
                                </div>
                              </VExpandTransition>
                            </v-col>
                          </v-row>
                          <h3 class="text-h5 mb-6 mt-4">Términos y Condiciones</h3>
                          <v-row>
                            <v-col cols="12">
                              <v-checkbox v-model="participant.termsAndConditions" color="primary" required class="mb-4"
                                :error-messages="validator.termsAndConditions.$errors.map((x: any) => x.$message.toString())"
                                @update:model-value="validator.termsAndConditions.$touch()">
                                <template #label>
                                  <label>
                                    Acepto los
                                    <RouterLink :to="{ name: 'termsAndConditions' }" target="_blank"
                                      class="text-primary" @click.stop>
                                      Términos y Condiciones
                                    </RouterLink>
                                  </label>
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-window-item>
                  </v-window>

                  <!-- Navigation Buttons -->
                  <v-card-actions class="px-4">
                    <v-btn v-if="step > 0" variant="outlined" class="mr-2" @click="prevStep">
                      <Icon icon="mdi-arrow-left" class="mr-2" />
                      Anterior
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="step < 2" color="primary" :loading="validator?.value?.$pending" @click="nextStep">
                      Siguiente
                      <Icon icon="mdi-arrow-right" class="ml-2" />
                    </v-btn>
                    <v-btn v-else color="success" :loading="saveParticipantsMutation.isPending.value" @click="onSubmit">
                      <Icon icon="mdi-check" class="mr-2" />
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

.hide-spin-buttons:deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

.hide-spin-buttons:deep(input::-webkit-outer-spin-button),
.hide-spin-buttons:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
