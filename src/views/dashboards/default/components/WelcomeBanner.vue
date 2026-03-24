<script setup lang="ts">
// assets
import Banner from '@/assets/images/analytics/welcome-banner.png';
import useUserInvitationMutations from '@/composables/participants/invitation/useUserInvitationMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast } from '@/service/sweetAlert';
import { userStore } from '@/stores/useStore';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

const stores = userStore();
const showReferralCard = ref(false);
const { generateInvitationWithQuantityUserMutation } = useUserInvitationMutations();
const invitationLink = ref('');
const copied = ref(false);
const emit = defineEmits(['link-create'])
const toggleReferralCard = () => {
  // showReferralCard.value = !showReferralCard.value;
  const userId = stores.user.user.id;
  generateInvitationWithQuantityUserMutation.mutate(
    { id: userId, quantity: "100000" },
    {
      onSuccess: (data) => {
        emit('link-create')
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
};
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error('Error al copiar el enlace:', err);
  }
  showReferralCard.value = false;
};

</script>

<template>
  <v-card class="welcomeBanner text-surface overflow-hidden" elevation="0" rounded="lg">
    <v-card-text class="py-5 px-md-12 px-6">
      <v-row>
        <v-col cols="12" xl="6" md="8" sm="10">
          <div class="pb-md-8 pt-md-7 pt-5 pb-6">
            <h2 class="text-sm-h2 text-h3">Hola {{ stores.user.user.name }} </h2>
            <p class="text-h6 mb-7">
              Empieza o continua tus entrenamientos, ¡mucho ánimo!
            </p>
            <div class="d-flex align-center">
              <v-btn color="info" size="x-large" rounded="md" class="tw:z-50" @click="toggleReferralCard" :loading="generateInvitationWithQuantityUserMutation.isPending.value">
                Referir
                <Icon icon="mdi-arrow-right"></Icon>
              </v-btn>
              <v-slide-x-transition>
                <v-card v-if="showReferralCard" class="ml-4 pa-4 z-50" elevation="4" rounded="lg" style="z-index: 50 !important">
                  <VTextField v-model="invitationLink" readonly variant="outlined" density="comfortable" hide-details
                    class="tw:mb-2">
                    <template #append>
                      <VBtn color="primary" variant="elevated" @click="copyLink" class="!tw:font-normal">
                        {{ copied ? 'Copiado!' : 'Copiar enlace' }}
                      </VBtn>
                    </template>
                  </VTextField>
                </v-card>
              </v-slide-x-transition>
            </div>
          </div>
        </v-col>
        <v-col cols="12" xl="6" md="4" class="d-md-block d-none">
          <div class="text-right pr-8">
            <v-img :src="Banner" cover class="ml-auto" width="200" alt="welcome banner" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style lang="scss">
.welcomeBanner {
  background: rgb(var(--v-theme-darkprimary));
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('@/assets/images/backgrounds/welcome-bg.png');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    top: 0;
    left: 0;
    opacity: 0.1;
  }
}
</style>
