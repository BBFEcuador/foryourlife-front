<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useAdminRoles from '@/composables/admin/rol/useAdminRoles';
import useCampus from '@/composables/admin/useCampus';
import useAdminUserMutations from '@/composables/admin/user/useAdminUserMutations';
import type { Admin } from '@/models/Admin';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';

const { campus, isError, isFetching } = useCampus();
const { isRolesError, isRolesLoading, roles } = useAdminRoles();
const { saveAdminMutation } = useAdminUserMutations();
const breadcrumbs = ref([
  {
    title: 'Others',
    disabled: false,
    href: '#'
  }
]);

const rules = {
  name: { required },
  email: { required, email },
  campus: { required },
  role: { required }
};
const admin = ref<Admin>({} as Admin);
const validator = useVuelidate(rules, admin);
const onUserSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    saveAdminMutation.mutate(admin.value);
  }
};

watch(saveAdminMutation.isError, () => {
  if (saveAdminMutation.isError.value) {
    const error = saveAdminMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveAdminMutation.isSuccess, () => {
  if (saveAdminMutation.isSuccess.value) {
    admin.value = {} as Admin;
    showSuccessToast('Ingreso exitoso', 'Se enviara un email con la contraseña temporal');
    validator.value.$reset();
  }
});
</script>

<template>
  <BaseBreadcrumb :title="'Usuario'" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="6">
      <UiParentCard title="Informacion base">
        <InputSection label="Nombre">
          <VTextField
            placeholder="Nombre del usuario"
            v-model="admin.name"
            :error-messages="validator.name.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
        <InputSection label="Correo electronico">
          <VTextField
            placeholder="E-mail"
            v-model="admin.email"
            :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>
      </UiParentCard>
    </v-col>
    <v-col cols="12" md="6">
      <UiParentCard title="Seguridad">
        <InputSection label="Sedes">
          <VSelect
            placeholder="Seleccione las sedes del usuario"
            :items="campus"
            return-object
            :loading="isFetching"
            item-title="city"
            multiple
            chips
            clearable
            v-model="admin.campus"
            :error-messages="validator.campus.$errors.map((x) => x.$message.toString())"
          />
        </InputSection>

        <InputSection label="Rol">
          <VSelect
            placeholder="Seleccione las sedes del usuario"
            :items="roles"
            return-object
            :loading="isRolesLoading"
            item-title="name"
            chips
            clearable
            :error-messages="validator.role.$errors.map((x) => x.$message.toString())"
            v-model="admin.role"
          />
        </InputSection>
      </UiParentCard>
    </v-col>
    <VCol cols="12">
      <div class="w-full d-flex justify-end">
        <VBtn @click="onUserSubmit" color="primary" variant="elevated" :loading="saveAdminMutation.isPending.value"> Crear </VBtn>
      </div>
    </VCol>
  </v-row>
</template>

<style scoped></style>
