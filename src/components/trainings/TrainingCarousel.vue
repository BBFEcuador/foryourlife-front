<script setup lang="ts">
import type { Training } from '@/models/Team';
import { getInitialsAvatarUrl } from '@/service/getAvatar';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, watch } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

interface Props {
  trainings: Training[];
}

const props = defineProps<Props>();
  const emits = defineEmits(['training-selected']);

const currentSlide = ref(0);

const slideShow = ref<{ image: string; id: number; name: string, training: Training }[]>([]);

watch(() => props.trainings, (newTrainings) => {
  if (newTrainings && newTrainings.length) {
    slideShow.value = newTrainings.map((Training, index) => ({
      image: getInitialsAvatarUrl(Training.name),
      id: index + 1,
      name: Training.name,
      training: Training,
    }));
  }
}, { immediate: true });

const slideTo = (val: number, training: Training) => {
  currentSlide.value = val;
  emits('training-selected', training);
};
</script>
<template>
  <VRow align="center" justify="center" class="my-5">
    <VCol cols="12" md="9">
      <Carousel id="thumbnails" :transition="500" :items-to-show="5" :wrap-around="true"
        @update:modelValue="(val) => (currentSlide = val)">
        <Slide v-for="(slide, i) in slideShow" :key="i">
          <div class="cursor-pointer text-center" @click="slideTo(i, slide.training)">
            <v-avatar size="100" class="thumbnail-image elevation-3">
              <VImg :src="slide.image" class="rounded-xl" >
                <template #error>
                  <Icon icon="bi:person-circle" class="text-h1" height="100" />
                </template>
              </VImg>
            </v-avatar>
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
    <VCol cols="12" md="3" class="d-flex justify-center">
      <v-card elevation="3" variant="outlined" class="pa-4 rounded-xl text-center">
        <v-toolbar-title class="text-h5 font-weight-semibold">
          Seleccionado:
        </v-toolbar-title>
        <v-avatar size="150" class="selected-image elevation-4 mb-3">
          <img :src="slideShow[currentSlide]?.image" alt="Training" class="rounded-circle" />
        </v-avatar>
        <p class="font-weight-bold text-h6 text-truncate">
          {{ slideShow[currentSlide]?.name }}
        </p>
      </v-card>
    </VCol>
  </VRow>
</template>

<style scoped>
.thumbnail-image {
  transition: transform 0.3s ease;
}

.thumbnail-image:hover {
  transform: scale(1.1);
}

.selected-image {
  border: 1px solid #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>