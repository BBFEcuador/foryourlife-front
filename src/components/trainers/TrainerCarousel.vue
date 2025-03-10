<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Trainers } from '@/models/Trainers'
import { getDicebearAvatarUrl } from '@/service/getAvatar'

interface Props {
  trainers: Trainers[]
}

const props = defineProps<Props>()
const emits = defineEmits(['trainer-selected'])

const model = ref<number | null>(null)
const selectedTrainer = ref<{
  image: string
  id: number
  name: string
  traner: Trainers
} | null>(null)

const slideShow = ref<{
  image: string;
  id: number;
  name: string;
  traner: Trainers
}[]>([])

watch(
  () => props.trainers,
  (newTrainers) => {
    if (newTrainers && newTrainers.length) {
      slideShow.value = newTrainers.map((trainer, index) => ({
        image: getDicebearAvatarUrl(trainer.name),
        id: index + 1,
        name: trainer.name,
        traner: trainer
      }))
    }
  },
  { immediate: true }
)

const toggleTrainer = (index: number, trainer: Trainers) => {
  model.value = index
  selectedTrainer.value = slideShow.value[index]
  emits('trainer-selected', trainer)
}
</script>

<template>
  <v-row align="center" justify="center" class="my-5">
    <v-col cols="12" md="9">
      <v-card class="mx-auto" rounded="lg" variant="outlined" max-width="800">
        <v-slide-group v-model="model" class="pa-4" selected-class="bg-borderLight" show-arrows>
          <v-slide-group-item v-for="(slide, index) in slideShow" :key="index"
            v-slot="{ isSelected, toggle, selectedClass }">
            <v-card :class="['ma-4', selectedClass]" width="150"
              @click="toggleTrainer(index, slide.traner)" variant="outlined">
              <VCardItem>
                <h4
                  class="tw:bottom-[-18px] tw:left-1/2 tw:transform -tw:translate-x-1/2 text-h5 tw:whitespace-nowrap">
                  {{ slide.name }}
                </h4>
                <div class="d-flex tw:fill-height tw:align-center tw:justify-center">
                  <v-avatar size="80" class="thumbnail-image">
                    <v-img :src="slide.image" class="rounded-lg" cover>
                      <template #error>
                        <Icon icon="bi:person-circle" class="text-h1" height="80" />
                      </template>
                    </v-img>
                  </v-avatar>
                </div>
                <span
                  class="text-truncate d-block tw:gap-2 text-secondary">
                  {{ slide.traner.email }}
                </span>
                <div
                  class="tw:bottom-[-18px] tw:left-1/2 tw:transform -tw:translate-x-1/2 tw:text-sm tw:font-bold text-secondary tw:px-2 tw:py-1 tw:whitespace-nowrap tw:z-10">
                  {{ slide.traner.phone }}
                </div>
                <v-scale-transition>
                  <v-icon v-if="isSelected" color="green" icon="mdi-check-circle" size="24" class="selected-icon" />
                </v-scale-transition>
              </VCardItem>
            </v-card>
          </v-slide-group-item>

        </v-slide-group>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-expand-transition>
        <v-card v-if="selectedTrainer" elevation="3" variant="outlined" class="pa-4 rounded-xl text-center">
          <v-toolbar-title class="text-h5 font-weight-semibold">
            Seleccionado:
          </v-toolbar-title>
          <v-avatar size="120" class="selected-image elevation-4 mb-3">
            <v-img :src="selectedTrainer.image" class="rounded-circle" cover>
              <template #error>
                <Icon icon="bi:person-circle" class="text-h1" height="100" />
              </template>
            </v-img>
          </v-avatar>
          <p class="font-weight-bold text-h6 text-truncate">
            {{ selectedTrainer.name }}
          </p>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
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
