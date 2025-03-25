<script setup lang="ts">
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";
import { Icon } from '@iconify/vue';
import { showSuccessToast } from '@/service/sweetAlert';

const link = ref("http://localhost:5173/register/57b78b93-e5a8-4390-ad7d-023e4d696eac");

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(link.value);
        showSuccessToast('Link copiado al portapapeles');
    } catch (err) {
        console.error('Error al copiar:', err);
    }
};
</script>

<template>
    <v-card class="tw:bg-gradient-to-br tw:from-primary/5 tw:to-secondary/5 tw:backdrop-blur-sm">
        <v-card-title class="d-flex align-center gap-2 justify-start">
            <Icon icon="mdi:qrcode-scan" class="tw:text-primary mr-2" height="24" />
            <span class="tw:font-medium">Código de Invitación</span>
        </v-card-title>



        <v-card-text>
            <div class="tw:flex tw:flex-col tw:items-center tw:gap-6">
                <div class="qr-container tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg">
                    <qrcode-vue :value="link" :size="270" level="H" class="tw:rounded-xl" />
                    <div class="qr-logo">
                        <img src="/src/assets/images/logos/Logo_Focus.png" class="tw:w-14 tw:h-14 tw:object-contain" />
                    </div>
                </div>

                <div class="tw:w-full tw:space-y-2">
                    <p class="tw:text-sm tw:text-gray-600 tw:font-medium">Link de Invitación:</p>
                    <div class="tw:flex tw:gap-2">
                        <v-text-field v-model="link" readonly variant="outlined" density="comfortable" hide-details
                            class="tw:flex-1 " bg-color="white">
                            <template #append-inner>
                                <v-btn icon variant="text" color="primary" size="small" @click="copyToClipboard"
                                    class="!tw:bg-primary/10 tw:rounded-lg group" v-tooltip="'Copiar link'">
                                    <div class="tw:relative">
                                        <Icon icon="mdi:content-copy" height="20"
                                            class="tw:transition-transform group-hover:tw:scale-110" />
                                        <div
                                            class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
                                        </div>
                                    </div>
                                </v-btn>
                            </template>
                        </v-text-field>
                    </div>
                </div>

                <div class=" tw:rounded-xl tw:p-4 tw:w-full">
                    <div class="tw:flex tw:items-start tw:gap-3">
                        <Icon icon="mdi:information" class="tw:text-primary tw:mt-0.5" height="20" />
                        <div class="tw:space-y-1">
                            <p class="tw:text-sm tw:font-medium tw:text-gray-700">¿Cómo usar?</p>
                            <ul class="tw:text-sm tw:text-gray-600 tw:space-y-1 tw:list-disc tw:ml-4">
                                <li>Comparte el código QR o el link de invitación</li>
                                <li>Los participantes pueden escanearlo o usar el link directamente</li>
                                <li>El registro será automático una vez completen sus datos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style scoped lang="scss">
.qr-container {
    position: relative;
    display: inline-block;
    transition: transform 0.2s ease;
}

.qr-container:hover {
    transform: scale(1.02);

    .qr-logo {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80px;
        height: 80px;
        transform: translate(-50%, -50%);
        background-color: #fff;
        display: grid;
        place-items: center;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;

        img {
            transition: all 0.2s ease;
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
</style>