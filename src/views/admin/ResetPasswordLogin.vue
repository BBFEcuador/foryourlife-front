<script setup lang="ts">
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { useRouter } from 'vue-router';
import { required } from '@vuelidate/validators';

import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import useAccountUserMutation from '@/composables/admin/UseAccountAdminMutation';

const email = ref('');

const router = useRouter();
const rules = {
    email: { required, email }
};

const request = ref();
const validator = useVuelidate(rules, { email: request });
const { passwordResetMutation } = useAccountUserMutation();

const onResetPassowrdSubmit = () => {
    validator.value.$validate();
    if (!validator.value.$error) {
        passwordResetMutation.mutate({ email: request.value });
    }
};

watch(passwordResetMutation.isError, () => {
    if (passwordResetMutation.isError.value) {
        let errorMessage = 'Error del servidor';
        let error = passwordResetMutation.error.value as AxiosError<{
            message: string;
        }>;
        if (error.response?.data?.message) {
            errorMessage = JSON.stringify(error.response?.data?.message);
        }

        toast.error(errorMessage, {
            autoClose: 3000,
            closeButton: true
        });
    }
});

watch(passwordResetMutation.isSuccess, () => {
    if (passwordResetMutation.isSuccess.value) {
        toast.success('Se envió un correo electrónico', {
            autoClose: 3000,
            closeButton: true
        });
    }
});

const goLogin = () => {
  router.push({ name: 'Admin Login' })
}
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Recupera tu contraseña</h3>
  </div>
  <span class="text-secondary subtitle-1 mt-6">
    A continuación, Ingresa la dirección de correo electrónico asociada con su cuenta y
    le enviaremos un enlace por correo electrónico para restablecer su contraseña. 
  </span>
  <form @submit.prevent="onResetPassowrdSubmit" class="mt-sm-13 mt-8">
        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText heading" placeholder="info@example.com"
            >Dirección de email</v-label
        >
        <VTextField
            placeholder="admin@example.com"
            v-model="request"
            :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
        />
        <v-btn type="submit" size="large" color="lightprimary" flat block :loading="passwordResetMutation.isPending.value"
            >Recuperar contraseña</v-btn
        >
      </form>
      <div class="mt-2">
        <v-btn type="submit" size="large" color="lightsecondary" flat block @click="goLogin"
            >Volver al Login</v-btn
        >
      </div>
    </template>
