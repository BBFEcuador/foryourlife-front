<script setup lang="ts">

import useAccountUserMutation from '@/composables/admin/UseAccountAdminMutation';
import type { Admin } from '@/models/Admin';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import useVuelidate from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { AxiosError } from 'axios';
import { computed, ref, watch } from 'vue';


interface props {
    account: Admin;
}
interface changePasswordRequest {
    password: string;
    confirmPassword: string;
}
const props = defineProps<props>();

const { updateAccountPasswordMutation } = useAccountUserMutation();

const request = ref<changePasswordRequest>({} as changePasswordRequest);
const computedConfirmPassword = computed(() => request.value.password);
const rules = {
    password: { required },
    confirmPassword: {
        required,
        sameAs: sameAs(computedConfirmPassword)
    }
};
const validator = useVuelidate(rules, request);

const onPasswordUpdateSubmit = () => {
    validator.value.$validate();
    if (!validator.value.$error) {
        updateAccountPasswordMutation.mutate({
            password: request.value.password,
            id: props.account.id
        });
    }
};

watch(updateAccountPasswordMutation.isError, () => {
    if (updateAccountPasswordMutation.isError.value) {
        let error = updateAccountPasswordMutation.error.value as AxiosError<ErrorApiResponse>;
        showErrorToast(error);
    }
});
watch(updateAccountPasswordMutation.isSuccess, () => {
    if (updateAccountPasswordMutation.isSuccess.value) {
        showSuccessToast('Contraseña actualizada 👌');
        request.value = {} as changePasswordRequest;
        validator.value.$reset();
    }
});
</script>

<template>
    <form action="" @submit.prevent="onPasswordUpdateSubmit">
        <v-card class="tw:mt-3 tw:p-5 tw:rounded-lg tw:overflow-hidden" flat>
            <v-card-title class="tw:rounded-t-lg tw:w-full text-center bg-primary tw:text-white tw:py-3">
                Actualizar contraseña
            </v-card-title>
            <v-card-item class="tw:flex tw:flex-col tw:gap-4">
                <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-4">
                    <p class="tw:font-semibold tw:mb-1">Nueva Contraseña</p>
                    <VTextField class="tw:w-full" v-model="request.password"
                        :error-messages="validator.password.$errors.map((x) => x.$message.toString())" />
                        <p class="tw:font-semibold tw:mb-1">Confirma la Contraseña</p>
                        <VTextField class="tw:w-full" v-model="request.confirmPassword"
                        :error-messages="validator.confirmPassword.$errors.map((x) => x.$message.toString())" />
                </div>
                <VBtn color="primary" type="submit" :loading="updateAccountPasswordMutation.isPending.value"
                    class="tw:w-full tw:mt-3">
                    Actualizar
                </VBtn>
            </v-card-item>
        </v-card>
    </form>
</template>

<style scoped></style>