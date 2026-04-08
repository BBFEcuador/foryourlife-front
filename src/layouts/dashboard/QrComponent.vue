<script setup lang="ts">
import { computed, ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { Icon } from '@iconify/vue';
import { showSuccessToast } from '@/service/sweetAlert';
import type { Invitation } from '@/models/Invitation';

interface props {
  invitations: Invitation[];
}

const props = defineProps<props>();

const copyToClipboard = async (token: string, active: boolean) => {
  // Validación para no permitir copiar si está inactivo
  if (!active) return;

  try {
    await navigator.clipboard.writeText(getLink(token));
    showSuccessToast('Link copiado al portapapeles');
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};

const getLink = (token: string) => {
  return `${window.location.origin}/register/${token}`;
};
</script>

<template>
  <v-row align="stretch">
    <v-col cols="12" md="4" class="d-flex">
      <v-card
        variant="tonal"
        class="tw:w-full tw:!border-2 tw:!border-dashed tw:!border-primary pa-4"
        style="border-style: dashed !important"
      >
        <v-card-text class="tw:h-full tw:flex tw:flex-col">
          <div class="tw:flex tw:justify-center mb-6">
            <div class="tw:relative p-4 tw:!bg-white tw:rounded-2xl tw:shadow-sm">
              <Icon icon="solar:info-circle-bold-duotone" class="text-primary" height="35" />
              <div class="tw:absolute tw:-inset-2 tw:bg-primary/10 tw:rounded-full tw:blur-lg tw:-z-10"></div>
            </div>
          </div>
          <div class="tw:text-center mb-6">
            <h3 class="tw:text-lg tw:font-bold tw:text-gray-800 mb-1">Instrucciones</h3>
            <p class="tw:text-xs tw:text-primary tw:font-semibold tw:uppercase tw:tracking-widest">Paso a paso</p>
          </div>
          <div class="tw:space-y-4 tw:flex-grow">
            <div class="tw:flex tw:items-start tw:gap-3">
              <div class="mt-1 p-1 tw:bg-primary/10 tw:rounded-md">
                <Icon icon="mdi:check" class="tw:text-primary" height="14" />
              </div>
              <p class="tw:text-sm tw:text-gray-600 tw:leading-snug">
                <span class="tw:font-bold tw:text-gray-700">Comparte:</span> Envía el código QR o el link de invitación a tus contactos.
              </p>
            </div>
            <div class="tw:flex tw:items-start tw:gap-3">
              <div class="tw:mt-1 tw:p-1 tw:bg-primary/10 tw:rounded-md">
                <Icon icon="mdi:check" class="tw:text-primary" height="14" />
              </div>
              <p class="tw:text-sm tw:text-gray-600 tw:leading-snug">
                <span class="tw:font-bold tw:text-gray-700">Acceso:</span> Los participantes escanean el código o hacen clic en el link.
              </p>
            </div>
            <div class="tw:flex tw:items-start tw:gap-3">
              <div class="tw:mt-1 tw:p-1 tw:bg-primary/10 tw:rounded-md">
                <Icon icon="mdi:check" class="tw:text-primary" height="14" />
              </div>
              <p class="tw:text-sm tw:text-gray-600 tw:leading-snug">
                <span class="tw:font-bold tw:text-gray-700">Registro:</span> El sistema los vinculará automáticamente al completar sus datos.
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-for="invite in invitations" :key="invite.id" cols="12" md="4">
      <v-card class="tw:bg-gradient-to-br tw:from-primary/5 tw:to-secondary/5 tw:backdrop-blur-sm tw:overflow-hidden">
        <v-card-title>
          <div class="tw:flex tw:items-center tw:gap-3">
            <Icon icon="mdi:qrcode-scan" class="tw:text-primary tw:shrink-0" height="26" />
            <div class="tw:flex tw:flex-col tw:leading-tight">
              <span class="tw:text-sm tw:font-semibold"> Código de Invitación </span>
              <span class="tw:text-base text-primary">
                {{ invite.enrolled?.trainingName || 'Sin capacitación' }}
              </span>
            </div>
          </div>
        </v-card-title>

        <v-card-text>
          <div class="text-end tw:mb-6">
            <span
              :class="[
                'tw:px-3 tw:py-1 tw:rounded-full tw:text-[10px] tw:font-bold tw:uppercase',
                invite.active ? 'tw:bg-green-100 tw:text-green-600' : 'tw:bg-red-100 tw:text-red-600'
              ]"
            >
              {{ invite.active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <div class="tw:relative">
            <div
              :class="[
                'tw:flex tw:flex-col tw:items-center tw:gap-6 tw:transition-all tw:duration-500',
                !invite.active ? 'tw:grayscale tw:blur-md tw:pointer-events-none tw:select-none' : ''
              ]"
            >
              <div class="qr-container tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg">
                <qrcode-vue :value="getLink(invite.token)" :size="200" level="H" class="tw:rounded-xl" />
                <div class="qr-logo">
                  <img src="/src/assets/images/logos/Logo_Focus.png" class="tw:w-14 tw:h-14 tw:object-contain" />
                </div>
              </div>

              <div class="tw:w-full tw:space-y-2">
                <p class="tw:text-sm tw:text-gray-600 tw:font-medium">Link de Invitación:</p>
                <div class="tw:flex tw:gap-2">
                  <v-text-field
                    :value="invite.active ? getLink(invite.token) : '••••••••••••••••••••'"
                    readonly
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="tw:flex-1"
                    bg-color="white"
                  >
                    <template #append-inner>
                      <v-btn
                        icon
                        variant="text"
                        color="primary"
                        size="small"
                        :disabled="!invite.active"
                        @click="copyToClipboard(invite.token, invite.active)"
                        class="!tw:bg-primary/10 tw:rounded-lg group"
                        v-tooltip="invite.active ? 'Copiar link' : 'Deshabilitado'"
                      >
                        <div class="tw:relative">
                          <Icon
                            :icon="invite.active ? 'mdi:content-copy' : 'mdi:lock'"
                            height="20"
                            class="tw:transition-transform group-hover:tw:scale-110"
                          />
                          <div
                            v-if="invite.active"
                            class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"
                          ></div>
                        </div>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>
            </div>

            <div v-if="!invite.active" class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:z-10">
              <div class="tw:bg-white pa-2 tw:rounded-full tw:shadow-xl">
                <Icon icon="mdi:lock" class="tw:text-gray-700" height="28" />
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.qr-container {
  position: relative;
  display: inline-block;
  transition: transform 0.2s ease;
}

.qr-container:hover {
  transform: scale(1.02);

  .qr-logo {
    width: 80px;
    height: 80px;
    img {
      width: 60px;
      height: 60px;
    }
  }
}

.qr-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75px;
  height: 75px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.qr-logo img {
  transition: transform 0.2s ease;
}

ul,
ol {
  list-style: inherit;
}

.tw\:border-dashed {
  --tw-border-style: dashed !important;
  border-style: dashed !important;
}
.tw\:border-2 {
  border-style: var(--tw-border-style) !important;
  border-width: 2px !important;
}
.tw\:rounded-\[2rem\] {
  border-radius: 2rem !important;
}
</style>
