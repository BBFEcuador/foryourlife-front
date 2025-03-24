<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import Logo from '../admin/logo/Logo.vue';

const slides = [
    {
        title: 'Focus',
        description: 'Espacio de autoconocimiento, creación y planeación para obtener resultados que superan lo ordinario. A través de distinciones del coaching, identificación de patrones que atrasan el movimiento del ser humano y acciones que acercarán al participante a una realidad que quizá no se veía posible.',
        icon: 'mdi-target'
    },
    {
        title: 'Your',
        description: 'Diseñado para atravesar paradigmas, creencias y limitaciones que  suceden en el día a día. Reconocer el potencial que hay dentro de cada ser humano y cómo utilizarlo en pro de la obtención de resultados. ',
        icon: 'mdi-account-check'
    },
    {
        title: 'Life',
        description: 'Esencia, introspección y expansión son claves en el desarrollo personal y relacional. Por esto, durante aproximadamente 12 semanas se trabaja de manera profunda en el ser, su visión y la forma en que cada persona puede crear lo que desea teniendo claro el ¿Para qué? y una intención direccionada a la acción.',
        icon: 'mdi-heart'
    }
];
</script>

<template>
    <div class="pa-3">
        <v-row class="h-screen">
            <v-col cols="12" lg="5" xl="5" class="bg-secondary h-100 tw:z-10 pa-0 hidden-md-and-down">
                <div class="h-100 d-flex flex-column justify-center">
                    <v-carousel cycle height="400" hide-delimiter-background show-arrows="hover" interval="10000">
                        <v-carousel-item v-for="(slide, i) in slides" :key="i" class="pa-4">
                            <div class="d-flex flex-column align-center text-center">
                                <Icon :icon="slide.icon" height="64" class="mb-4" color="primary"></Icon>
                                <h2 class="text-h1 font-weight-bold mb-4">{{ slide.title }}</h2>
                                <p class="tw:text-xl tw:opacity-80 tw:max-w-md">
                                    {{ slide.description }}
                                </p>
                            </div>
                        </v-carousel-item>
                    </v-carousel>
                </div>
            </v-col>
            <v-col cols="12" lg="7" xl="7" class="bg-surface tw:h-screen tw:z-10">
                <div class="d-flex justify-center align-center h-100">
                    <div class="tw:px-8 mt-5 auth-card">
                        <div class="tw:grid tw:place-content-center">
                            <Logo class="mb-5 tw:w-64" />
                        </div>
                        <RouterView v-slot="{ Component }">
                            <transition name="slide-fade" mode="out-in">
                                <component :is="Component" />
                            </transition>
                        </RouterView>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
