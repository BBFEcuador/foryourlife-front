<script setup lang="ts">
import type { LoginRequest } from '@/models/Login';
import { userStore } from '@/stores/useStore';
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { required, email } from '@vuelidate/validators';
import useLogin from '@/composables/participants/auth/useLogin';
import type { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { Icon } from '@iconify/vue/dist/iconify.js';

const loginRequest = ref<LoginRequest>({} as LoginRequest);
const { postLoginMutation } = useLogin();
const router = useRouter();
const store = userStore();
const rules = {
  username: { required },
  password: { required }
};

const validator = useVuelidate(rules, loginRequest);
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};


const onLoginSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    postLoginMutation.mutate(loginRequest.value);
  }
};

watch(postLoginMutation.isError, () => {
  if (postLoginMutation.isError.value) {
    let message = 'Ha ocurrido un error';
    let error = postLoginMutation.error.value as AxiosError<{
      message: string;
    }>;
    if (error.response?.data?.message) {
      message = error.response?.data?.message;
    }
    toast.error(message, {
      autoClose: 3000,
      closeButton: true
    });
  }
});

watch(postLoginMutation.isSuccess, () => {
  if (postLoginMutation.isSuccess.value) {
    let response = postLoginMutation.data.value;
    if (response) {
      store.setToken(response.token);
      store.setUser(response.user);
      router.push({ name: 'UserDashboard' });
    }
  }
});
</script>
<template>
  <form @submit.prevent="onLoginSubmit" class="mt-7 loginForm">
    <div class="mb-6">
      <v-label>Correo electrónico</v-label>
      <VTextField v-model="loginRequest.username" class="mb-8" required type="email" hide-details="auto"
        :error-messages="validator.username.$errors.map((x) => x.$message.toString())"></VTextField>
    </div>
    <div>
      <v-label>Contraseña</v-label>
      <VTextField v-model="loginRequest.password" required hide-details="auto"
        :type="showPassword ? 'text' : 'password'"
        :error-messages="validator.password.$errors.map((x) => x.$message.toString())">
        <template #append-inner>
          <Icon icon="mdi:eye" class="cursor-pointer" @click="togglePasswordVisibility" />
        </template>
      </VTextField>
    </div>
    <v-btn color="darkprimary" :loading="postLoginMutation.isPending.value" block class="mt-5" variant="flat" size="large"
      rounded="md" type="submit">
      Iniciar Sesión</v-btn>
  </form>
</template>
