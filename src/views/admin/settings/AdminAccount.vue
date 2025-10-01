<script setup lang="ts">
import useAccount from '@/composables/admin/useAdminSettings';
import UpdateAccountForm from '@/components/account/UpdateAccountForm.vue';

const { account, accountHasError, idlAccount, isAccountLoading } = useAccount();
</script>

<template>
  <v-row v-if="isAccountLoading">
    <v-col cols="12" md="6">
      <v-card elevation="1">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else-if="accountHasError">
    <v-col cols="12">
      <p>error</p>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12" md="5">
      <v-card class="tw:text-center tw:h-full" overflow-hidden rounded="lg" flat>
        <v-card-title class="tw:rounded-t-lg bg-primary mb-3 tw:w-full"> Información actual </v-card-title>
        <v-card-subtitle class="mt-4 tw:w-full"> Perfil de Administrador </v-card-subtitle>
        <v-card-item class="tw:grid tw:place-content-center">
          <h3 class="tw:font-semibold text-h3">{{ idlAccount.name1 }}</h3>
          <h4 class="text-lightText text-h4">{{ idlAccount.email }}</h4>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" md="7">
      <UpdateAccountForm :account="account" />
    </v-col>
  </v-row>
</template>
