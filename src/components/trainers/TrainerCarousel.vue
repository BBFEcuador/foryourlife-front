<script setup lang="ts">
import type { Trainers } from '@/models/Trainers';
import { ref, watch } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

interface Props {
    trainers: Trainers[];
}

const props = defineProps<Props>();

const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
};

const currentSlide = ref(0);

const slideShow = ref<{ image: string; id: number; name: string }[]>([]);

watch(() => props.trainers, (newTrainers) => {
    if (newTrainers && newTrainers.length) {
        slideShow.value = newTrainers.map((trainer, index) => ({
            image: getAvatarUrl(trainer.name),
            id: index + 1,
            name: trainer.name,
        }));
    }
}, { immediate: true });

const slideTo = (val: number) => {
    currentSlide.value = val;
};
</script>

<template>
    <VRow align="center" justify="center" class="my-5">
      <VCol cols="12" md="8">
        <Carousel
          id="thumbnails"
          :transition="500"
          :items-to-show="5"
          :wrap-around="true"
          @update:modelValue="(val) => (currentSlide = val)"
        >
          <Slide v-for="(slide, i) in slideShow" :key="i">
            <div class="carousel__item cursor-pointer text-center" @click="slideTo(i)">
              <img
                :src="slide.image"
                alt="Trainer"
                class="thumbnail-image rounded-xl"
              />
              <p class="font-weight-bold text-truncate mt-2">
                {{ slide.name }}
              </p>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </VCol>
  
      <VCol cols="12" md="4">
        <Carousel
          id="gallery"
          :items-to-show="2"
          :wrap-around="true"
          v-model="currentSlide" style="border: solid;"
        >
          <Slide v-for="(slide, i) in slideShow" :key="i">
            <div class="carousel__item text-center">
              <img
                :src="slide.image"
                alt="Trainer"
                class="gallery-image rounded-xl mb-2"
              />
              <p class="font-weight-bold">{{ slide.name }}</p>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </VCol>
    </VRow>
  </template>

