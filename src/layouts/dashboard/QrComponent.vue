<script setup lang="ts">
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";

const link = ref("http://localhost:5173/register/57b78b93-e5a8-4390-ad7d-023e4d696eac");
</script>

<template>
    <v-card elevation="0" class="pa-4"> 
        <div class="qr-container">
            <qrcode-vue :value="link" :size="270" level="H" />
            <div class="qr-logo">
                <img src="/src/assets/images/logos/Logo_Focus.png" class="" />
            </div>
        </div>
    </v-card>
</template>

<style scoped>
.qr-container {
    position: relative;
    display: inline-block;

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
}
</style>