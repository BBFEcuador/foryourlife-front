<script setup lang="ts">
import type { Team } from '@/models/Participants';
import { formatDate } from '@fullcalendar/core/index.js';
import { Icon } from '@iconify/vue/dist/iconify.js';

interface props {
    team: Team;
};

const props = defineProps<props>();
</script>
<template>
      <v-card elevation="0" class="tw:overflow-hidden tw:rounded-xl tw:p-5 tw:bg-white tw:shadow-md">
    <!-- <v-img :src="team?.photo" alt="Team Photo" class="tw:w-full tw:h-48 tw:object-cover tw:rounded-t-xl" /> -->

    <v-card-item class="tw:mt-3">
      <div class="tw:flex tw:flex-col tw:gap-3">
        <div class="tw:flex tw:items-center tw:gap-2">
          <Icon icon="material-symbols:person" height="21" class="tw:text-blue-500" />
          <span class="tw:text-lg tw:font-medium">{{ team?.trainer?.name ?? 'Sin entrenador' }}</span>
        </div>
        <div class="tw:flex tw:items-center tw:gap-2">
          <Icon icon="material-symbols:alternate-email" height="21" class="tw:text-blue-500" />
          <span class="tw:text-lg tw:text-gray-600">{{ team?.trainer?.email ?? 'Sin email' }}</span>
        </div>
        <div class="tw:flex tw:items-center tw:gap-2">
          <Icon icon="material-symbols:call" height="21" class="tw:text-blue-500" />
          <span class="tw:text-lg tw:text-gray-600">{{ team?.trainer?.phone ?? 'Sin teléfono' }}</span>
        </div>
      </div>
    </v-card-item>

    <v-divider class="tw:my-4" />
    <v-card-item>
      <div class="tw:grid tw:grid-cols-2 tw:gap-4">
        <div>
          <span class="tw:text-sm tw:text-gray-500">Inicio del Entrenamiento:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ formatDate(team?.training?.startDate) }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Fin del Entrenamiento:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ formatDate(team?.training?.endDate) }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Nivel del Curso:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.courseLevel ?? 'No disponible' }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Sede:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.campus?.city ?? 'No disponible' }}
          </p>
        </div>
      </div>
    </v-card-item>

    <!-- Próximo Nivel -->
    <v-divider class="tw:my-4" />
    <v-card-item>
      <div class="tw:grid tw:grid-cols-2 tw:gap-4">
          <span class="tw:text-sm tw:text-gray-500">Próximo Nivel:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.nextLevel?.courseLevel ?? 'Sin próximo nivel' }}
          </p>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Inicio del Próximo Nivel:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ formatDate(team?.training?.nextLevel?.startDate) }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Fin del Próximo Nivel:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ formatDate(team?.training?.nextLevel?.endDate) }}
          </p>
        </div>
      </div>
    </v-card-item>
    <v-divider class="tw:my-4" />
    <v-card-item>
      <div class="tw:grid tw:grid-cols-2 tw:gap-4">
        <div>
          <span class="tw:text-sm tw:text-gray-500">Sede:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.campus?.city ?? 'No disponible' }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Dirección:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.campus?.address ?? 'No disponible' }}
          </p>
        </div>
        <div>
          <span class="tw:text-sm tw:text-gray-500">Teléfono:</span>
          <p class="tw:text-lg tw:font-medium tw:text-gray-700">
            {{ team?.training?.campus?.phone ?? 'No disponible' }}
          </p>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>