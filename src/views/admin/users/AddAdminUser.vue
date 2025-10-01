<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useAdminRoles from '@/composables/admin/rol/useAdminRoles';
import useCampus from '@/composables/admin/useCampus';
import useAdminUserMutations from '@/composables/admin/user/useAdminUserMutations';
import type { Admin } from '@/models/Admin';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { router } from '@/router';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';

const { campus, isFetching } = useCampus();
const { isRolesLoading, roles } = useAdminRoles();
const { saveAdminMutation } = useAdminUserMutations();
const breadcrumbs = ref([
  {
    title: 'Usuarios',
    disabled: false,
    href: '#'
  }
]);

const rules = {
  name1: { required },
  name2: { required },
  lastName1: { required },
  lastName2: { required },
  password: { required },
  phone: { required },
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
    showSuccessToast('Ingreso exitoso', 'Se a creado el usuario correctamente');
    validator.value.$reset();
    router.push({ name: 'users-admin' });
  }
});
</script>

<template>
  <BaseBreadcrumb :title="'Usuario'" :breadcrumbs="breadcrumbs" class="mb-6"></BaseBreadcrumb>
  <v-row class="px-4">
    <v-col cols="12" md="6">
      <UiParentCard title="Información base" class="rounded-lg elevation-2">
        <div class="mb-4 tw:grid tw:grid-cols-2 tw:gap-4">
          <InputSection label="Nombre" class="mb-4">
            <VTextField placeholder="Nombre del usuario" v-model="admin.name1"
              :error-messages="validator.name1.$errors.map((x) => x.$message.toString())" variant="outlined"
              bg-color="surface" class="rounded-lg" />
          </InputSection>

          <InputSection label="Segundo Nombre" class="mb-4">
            <VTextField placeholder="Segundo Nombre del usuario" v-model="admin.name2"
              :error-messages="validator.name2.$errors.map((x) => x.$message.toString())" variant="outlined"
              bg-color="surface" class="rounded-lg" />
          </InputSection>
          <InputSection label="Primer Apellido" class="mb-4">
            <VTextField placeholder="Apellido del usuario" v-model="admin.lastName1"
              :error-messages="validator.lastName1.$errors.map((x) => x.$message.toString())" variant="outlined"
              bg-color="surface" class="rounded-lg" />
          </InputSection>
          <InputSection label="Segundo Apellido" class="mb-4">
            <VTextField placeholder="Segundo Apellido del usuario" v-model="admin.lastName2"
              :error-messages="validator.lastName2.$errors.map((x) => x.$message.toString())" variant="outlined"
              bg-color="surface" class="rounded-lg" />
          </InputSection>
        </div>
        <InputSection label="Correo electronico" class="mb-4">
          <VTextField placeholder="E-mail" v-model="admin.email"
            :error-messages="validator.email.$errors.map((x) => x.$message.toString())" variant="outlined"
            bg-color="surface" class="rounded-lg" />
        </InputSection>
        <InputSection label="Telf" class="mb-4">
          <VTextField placeholder="Telefono" v-model="admin.phone"
            :error-messages="validator.phone.$errors.map((x) => x.$message.toString())" variant="outlined"
            bg-color="surface" class="rounded-lg" />
        </InputSection>
      </UiParentCard>
    </v-col>
    <v-col cols="12" md="6">
      <UiParentCard title="Seguridad" class="rounded-lg elevation-2">
        <InputSection label="Sedes" class="mb-4">
          <VSelect placeholder="Seleccione las sedes del usuario" :items="campus" return-object :loading="isFetching"
            item-title="city" multiple chips clearable v-model="admin.campus"
            :error-messages="validator.campus.$errors.map((x) => x.$message.toString())" variant="outlined"
            bg-color="surface" class="rounded-lg" />
        </InputSection>

        <InputSection label="Rol" class="mb-4">
          <VSelect placeholder="Seleccione las sedes del usuario" :items="roles" return-object :loading="isRolesLoading"
            item-title="name" chips clearable :error-messages="validator.role.$errors.map((x) => x.$message.toString())"
            v-model="admin.role" variant="outlined" bg-color="surface" class="rounded-lg" />
        </InputSection>
        <InputSection label="Contraseña" class="mb-4">
          <VTextField placeholder="Contraseña del usuario" v-model="admin.password"
              :error-messages="validator.password.$errors.map((x) => x.$message.toString())" variant="outlined"
              bg-color="surface" class="rounded-lg" />
        </InputSection>
      </UiParentCard>
    </v-col>
    <VCol cols="12">
      <div class="d-flex justify-end px-4">
        <VBtn @click="onUserSubmit" color="primary" variant="elevated" :loading="saveAdminMutation.isPending.value"
          size="large" class="rounded-lg px-6">
          <Icon icon="mdi:account-plus" class="mr-2" />
          Crear usuario
        </VBtn>
      </div>
    </VCol>
  </v-row>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-text-field,
.v-select {
  transition: all 0.2s ease;
}

.v-text-field:hover,
.v-select:hover {
  transform: scale(1.01);
}
</style>
