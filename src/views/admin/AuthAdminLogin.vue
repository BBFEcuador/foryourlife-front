<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { AxiosError } from 'axios';
import useAdminLogin from '@/composables/admin/useAdminLogin';
import type { LoginAdminRequest } from '@/models/AdminRequest';
import { showErrorToast } from '@/service/sweetAlert';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { adminStore } from '@/stores/adminStore';

const AdminLoginRequest = ref<LoginAdminRequest>({} as LoginAdminRequest);

const router = useRouter();
const store = adminStore();
const rules = {
  username: { required, email },
  password: { required }
};

const validator = useVuelidate(rules, AdminLoginRequest);
const showPassword = ref(false);

const { postLoginMutation } = useAdminLogin();
const onLoginSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    postLoginMutation.mutate(AdminLoginRequest.value);
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
      if (response.cashDrawer.length > 0) {
        store.setCashDrawerOpen(true);
        store.setCashDrawer(response.cashDrawer[0]);
      }
      router.push({ name: 'home-admin' });
    }
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Iniciar Sesión Admin</h3>
  </div>
  <Form class="mt-7 loginForm" @submit.prevent="onLoginSubmit">
    <div class="mb-6">
      <v-label>Correo electrónico</v-label>
      <v-text-field
        v-model="AdminLoginRequest.username"
        :error-messages="validator.username.$errors.map((x) => x.$message.toString())"
        color="primary"
        placeholder="Introduce tu correo"
        outlined
      ></v-text-field>
    </div>
    <div>
      <v-label>Contraseña</v-label>
      <v-text-field
        v-model="AdminLoginRequest.password"
        :error-messages="validator.password.$errors.map((x) => x.$message.toString())"
        color="primary"
        placeholder="Introduce tu contraseña"
        :type="showPassword ? 'text' : 'password'"
        class="pwdInput"
        outlined
      >
        <template #append-inner>
          <Icon
            :icon="!showPassword ? 'weui:eyes-on-outlined' : 'weui:eyes-off-outlined'"
            @click="togglePasswordVisibility"
            height="18"
            class="cursor-pointer"
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
