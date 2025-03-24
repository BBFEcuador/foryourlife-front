<script setup lang="ts">
import { shallowRef } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import CardHeader from '@/components/shared/CardHeader.vue';
import { ref, computed } from 'vue';

const projectitems = shallowRef([
  {
    color: 'warning',
    name: 'Referidos',
    task: '1'
  },
]);

const metaReferidos = ref(8);
const referidos = ref(7);
const progreso = computed(() => (referidos.value / metaReferidos.value) * 100);</script>
<template>
  <CardHeader title="Meta de Referidos" class="overflow-hidden">
    <div class="pa-6">
      <div class="d-flex justify-space-between mb-2">
        <p class="text-body-1 mb-0">Progreso</p>
        <p class="text-body-1 mb-0">{{ progreso }}%</p>
      </div>
      <v-progress-linear aria-label="progressbar" rounded color="primary" :model-value="progreso" height="6"></v-progress-linear>
      <v-list class="py-5" aria-busy="true" aria-label="project list">
        <v-list-item v-for="(item, index) in projectitems" :key="index" :value="index" rounded="md">
          <template v-slot:prepend>
            <v-avatar size="8" :color="item.color"></v-avatar>
          </template>
          <span class="text-body-1">{{ item.name }}</span>
          <template v-slot:append>
            <v-chip size="small" rounded="md" v-if="item.task">
              <template v-slot:prepend>
                <SvgSprite name="custom-link1" class="mr-1" style="width: 12px; height: 12px" />
              </template>
              {{ item.task }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </CardHeader>
</template>
