<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Trainers } from '@/models/Trainers'
import { getDicebearAvatarUrl } from '@/service/getAvatar'
import { Icon } from '@iconify/vue/dist/iconify.js';

interface Props {
  trainers: Trainers[]
}

const props = defineProps<Props>()
const emits = defineEmits(['trainer-selected'])

const model = ref<number | null>(null)
const searchQuery = ref('')
const showDetailModal = ref(false)

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

const filteredTrainers = computed(() => {
  if (!searchQuery.value) return slideShow.value
  const query = searchQuery.value.toLowerCase()
  return slideShow.value.filter(trainer =>
    trainer.name.toLowerCase().includes(query) ||
    trainer.traner.email.toLowerCase().includes(query) ||
    trainer.traner.phone.includes(query)
  )
})

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

const openDetailModal = () => {
  if (selectedTrainer.value) {
    showDetailModal.value = true
  }
}

const handleContact = (type: 'email' | 'phone', contact: string) => {
  if (type === 'email') {
    window.location.href = `mailto:${contact}`
  } else {
    window.location.href = `tel:${contact}`
  }
}
</script>

<template>
  <v-row align="center" justify="center" class="my-3">
    <v-col cols="12" md="9">
      <v-card class="mx-auto" rounded="lg" variant="outlined" max-width="800">
        <v-card-item class="pa-2">
          <v-text-field v-model="searchQuery" label="Buscar entrenadores..." variant="outlined" density="compact"
            hide-details class="py-2">
            <template #prepend-inner>
              <Icon icon="mdi-magnify" />
            </template>
          </v-text-field>
        </v-card-item>

        <v-slide-group v-model="model" class="pa-2" selected-class="bg-borderLight" show-arrows>
          <v-slide-group-item v-for="(slide, index) in filteredTrainers" :key="index"
            v-slot="{ isSelected, toggle, selectedClass }">
            <v-card :class="['ma-2', selectedClass]" width="150" @click="toggleTrainer(index, slide.traner)"
              variant="outlined">
              <VCardItem class="pa-2">
                <h4
                  class="tw:bottom-[-18px] tw:left-1/2 tw:transform -tw:translate-x-1/2 text-subtitle-1 tw:whitespace-nowrap mb-2">
                  {{ slide.name }}
                </h4>
                <div class="d-flex tw:fill-height tw:align-center tw:justify-center">
                  <v-avatar size="70" class="thumbnail-image">
                    <v-img :src="slide.image" class="rounded-lg" cover>
                      <template #error>
                        <Icon icon="bi:person-circle" class="text-h2" height="70" />
                      </template>
                    </v-img>
                  </v-avatar>
                </div>
                <span class="text-truncate d-block tw:gap-1 text-secondary text-caption mt-2">
                  {{ slide.traner.email }}
                </span>
                <div class="tw:text-sm text-secondary tw:whitespace-nowrap text-caption">
                  {{ slide.traner.phone }}
                </div>
                <v-scale-transition>
                  <Icon v-if="isSelected" color="green" icon="mdi-check-circle" size="20" class="selected-icon" />
                </v-scale-transition>
              </VCardItem>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-expand-transition >
        <v-card v-if="selectedTrainer" elevation="3" variant="outlined" class="pa-3 rounded-xl text-center">
          <v-toolbar-title class="text-h6 font-weight-semibold mb-3">
            Seleccionado:
          </v-toolbar-title>
          <v-avatar size="100" class="selected-image elevation-4 mb-3">
            <v-img :src="selectedTrainer.image" class="rounded-circle" cover>
              <template #error>
                <Icon icon="bi:person-circle" class="text-h2" height="80" />
              </template>
            </v-img>
          </v-avatar>
          <p class="font-weight-bold text-subtitle-1 text-truncate mb-3">
            {{ selectedTrainer.name }}
          </p>
          <div class="d-flex justify-center gap-2 mb-3">
            <v-btn color="primary" variant="tonal" size="small" density="compact"
              @click="handleContact('email', selectedTrainer.traner.email)">
              <Icon icon="mdi-email" class="mr-1" height="16"></Icon>
              Correo
            </v-btn>
            <v-btn color="primary" variant="tonal" size="small" density="compact"
              @click="handleContact('phone', selectedTrainer.traner.phone)">
              <Icon icon="mdi-phone" class="mr-1" height="16"></Icon>
              Llamar
            </v-btn>
          </div>
          <v-btn block color="primary" variant="outlined" @click="openDetailModal">
            Más detalles
          </v-btn>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
  <v-dialog v-model="showDetailModal" max-width="600px">
    <v-card v-if="selectedTrainer">
      <v-card-item class="pa-4">
        <v-card-title class="text-h6 mb-3">
          {{ selectedTrainer.name }}
        </v-card-title>
        <div class="d-flex align-center mb-3">
          <v-avatar size="80" class="mr-3">
            <v-img :src="selectedTrainer.image" cover />
          </v-avatar>
          <div>
            <div class="d-flex align-center mb-1">
              <Icon icon="mdi-email" size="small" class="mr-2" />
              <span class="text-body-2">{{ selectedTrainer.traner.email }}</span>
            </div>
            <div class="d-flex align-center">
              <Icon icon="mdi-phone" size="small" class="mr-2" />
              <span class="text-body-2">{{ selectedTrainer.traner.phone }}</span>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="text-subtitle-1 mb-1">About</div>
          <p class="text-body-2">
            Professional trainer specialized in helping clients achieve their fitness goals through personalized
            training
            programs and nutrition guidance.
          </p>
        </div>
      </v-card-item>
      <v-card-actions class="pa-3">
        <v-spacer />
        <v-btn color="primary" variant="tonal" size="small" @click="showDetailModal = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
