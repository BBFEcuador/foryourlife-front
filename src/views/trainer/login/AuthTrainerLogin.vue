<script setup lang="ts">
import useTrainerLogin from '@/composables/trainer/useTrainerLogin';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { TrainerLoginRequest } from '@/models/Trainers';
import { showErrorToast } from '@/service/sweetAlert';
import { trainerStore } from '@/stores/trainerStore';
import useVuelidate from '@vuelidate/core';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const trainerLoginRequest = ref<TrainerLoginRequest>({} as TrainerLoginRequest);
const store = trainerStore();
const router = useRouter();

const rules = () => ({
  email: {
    required: (value: string) => !!value || 'El correo electrónico es requerido',
    email: (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'El correo electrónico no es válido',
  },
  password: {
    required: (value: string) => !!value || 'La contraseña es requerida',
  },
});

const validator = useVuelidate(rules, trainerLoginRequest);
const showPassword = ref(false);

const { postLoginMutation } = useTrainerLogin();
const onLoginSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    postLoginMutation.mutate(trainerLoginRequest.value);
  }
};

watch(postLoginMutation.isError, () => {
  if (postLoginMutation.isError) {
    let error = postLoginMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(postLoginMutation.isSuccess, () => {
  if (postLoginMutation.isSuccess.value) {
    let response = postLoginMutation.data.value;
    if (response) {
      store.setToken(response.token);
      store.setAdmin(response.admin);
      store.setAvailableCampus(response.admin.campus);
      router.push({ name: 'Trainer Home' });
    }
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>


<template>
    <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Iniciar Sesión Como <strong>Entrenador</strong></h3>
  </div>
  <Form class="mt-7 loginForm" @submit.prevent="onLoginSubmit">
    <div class="mb-6">
      <v-label>Correo electrónico</v-label>
      <v-text-field
        v-model="trainerLoginRequest.email"
        :error-messages="validator.email.$errors.map((x: any) => x.$message.toString())"
        color="primary"
        placeholder="Introduce tu correo"
        outlined
      ></v-text-field>
    </div>
    <div>
      <v-label>Contraseña</v-label>
      <v-text-field
        v-model="trainerLoginRequest.password"
        :error-messages="validator.password.$errors.map((x: any) => x.$message.toString())"
        color="primary"
        placeholder="Introduce tu contraseña"
        :type="showPassword ? 'text' : 'password'"
        class="pwdInput"
        outlined
      >
        <template #append-inner>
          <Icon
            :icon="!showPassword ? 'weui:eyes-on-outlined' : 'weui:eyes-off-outlined'"
            height="18"
            class="cursor-pointer"
            @click="togglePasswordVisibility"
          />
        </template>
      </v-text-field>
    </div>
    <v-btn
      color="darkprimary"
      block
      class="mt-5"
      variant="flat"
      size="large"
      rounded="md"
      type="submit"
      :loading="postLoginMutation.isPending.value"
    >
      Login
    </v-btn>
  </Form>
</template>

<style scoped></style>
