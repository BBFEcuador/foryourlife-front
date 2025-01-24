<script setup lang="ts">
import UpdateAccountForm from '@/components/account/UpdateAccountForm.vue';
import useAccount from '@/composables/admin/useAdminSettings';


const {account,accountHasError,idlAccount,isAccountLoading} = useAccount();
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
                <v-card class="pb-5 tw-mt-3 tw-text-center tw-overflow-hidden" rounded="lg" flat>
                    <v-card-title class="tw-mb-3 tw-w-full bg-primary"> Información actual </v-card-title>
                    <v-card-subtitle class="tw-mb-4 tw-w-full"> Perfil de Administrador </v-card-subtitle>
                    <v-card-text>
                        <div class="tw-font-semibold tw-text-lg">{{ idlAccount.name }}</div>
                        <div class="tw-text-gray-500">{{ idlAccount.email }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <UpdateAccountForm :account="account" />
                <!-- <UnsubscribeCompanyForm :account="account" />
                <DeleteAccountForm :account="account" /> -->
            </v-col>
        </v-row>
</template>


<style scoped></style>