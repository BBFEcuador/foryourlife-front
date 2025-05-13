<script setup lang="ts">
import img1 from '@/assets/images/blog/blog-img1.jpg';
import img2 from '@/assets/images/blog/blog-img2.jpg';
import img3 from '@/assets/images/blog/blog-img3.jpg';
import LevelsGrid from '@/components/shared/LevelsGrid.vue';
import type { TeamWriteModel } from '@/models/Team';

interface props{
    team:TeamWriteModel
}

const props = defineProps<props>()
const emit = defineEmits(['level-selected'])

const onlevelSelected = (level: string) => {
    props.team.lvl = level
    emit('level-selected')
};

</script>
<template>
  <v-card variant="flat" class="pa-4">
    <p class="text-center text-h4 font-weight-medium mb-6">¿Qué equipo vas a crear?</p>
    <v-row>
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
            <LevelsGrid @level-selected="onlevelSelected" :image="img1" description="Básico" title="Focus" />
          </v-card>
        </v-hover>
      </v-col>
      <!-- <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
            <LevelsGrid @level-selected="onlevelSelected" :image="img2" description="Normal" title="Your" />
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card v-bind="props" :elevation="isHovering ? 8 : 2" class="transition-swing">
            <LevelsGrid @level-selected="onlevelSelected" :image="img3" description="Avanzado" title="Life" />
          </v-card>
        </v-hover>
      </v-col> -->
    </v-row>
  </v-card>
</template>

<style scoped></style>
