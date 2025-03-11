<script setup lang="ts">
import type { Team } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref } from 'vue';

const tab = ref('participants');

const props = defineProps<{
  team: TeamWriteModel;
  disabled?: boolean;
}>();

const emit = defineEmits(['back', 'finish']);

const onBack = () => {
  emit('back');
};

const onFinish = () => {
  emit('finish');
};

const levelColor = computed(() => {
  switch (props.team.lvl) {
    case 'FOCUS':
      return 'deep-purple';
    case 'YOUR':
      return 'indigo';
    case 'LIFE':
      return 'blue';
    default:
      return 'primary';
  }
});

const totalMembers = computed(() => {
  return props.team.users.length + (props.team.lvl === 'FOCUS' ? props.team.staffs.length + props.team.visionaries.length : 0);
});
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-6">
      <Icon icon="mdi-check-circle" size="32" class="mr-3" color="success" />
      <div>
        <h4 class="text-h4 mb-1">Confirmación</h4>
        <span class="text-medium-emphasis">Revisa los detalles del equipo antes de confirmar</span>
      </div>
    </div>

    <v-container class="px-0">
      <v-row>
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="mb-4 team-summary-card">
            <v-card-item>
              <v-card-title class="d-flex text-center mb-2">
                <Icon icon="mdi:shield-account-outline" :color="levelColor" height="32" class="mr-2" />
                {{ team.name ? team.name : 'Ingresa un nombre' }}
              </v-card-title>
              <v-card-subtitle>
                <v-chip :color="levelColor" size="small" class="mr-2">{{ team.lvl }}</v-chip>
                <v-chip size="small" variant="outlined">{{ totalMembers }} miembros</v-chip>
              </v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <v-card-text>
              <div class="d-flex align-center mb-4">
                <Icon icon="mdi-calendar" class="mr-2" color="primary" />
                <div>
                  <div class="font-weight-medium">{{ team.trainingObj?.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ team.trainingObj?.startDate }} - {{ team.trainingObj?.endDate }}</div>
                </div>
              </div>

              <div class="d-flex align-center">
                <Icon icon="mdi-account-tie" class="mr-2" color="primary" />
                <div>
                  <div class="font-weight-medium">{{ team.trainerObj?.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ team.trainerObj?.email }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card variant="outlined" class="mb-4">
            <v-tabs v-model="tab" color="primary" align-tabs="center">
              <v-tab value="participants" class="text-none">
                <Icon icon="mdi-account-group" class="mr-2" />
                Participantes ({{ team.users.length }})
              </v-tab>
              <v-tab v-if="team.lvl === 'FOCUS'" value="staff" class="text-none">
                <Icon icon="mdi-account-tie-voice" class="mr-2" />
                Staff ({{ team.staffs.length }})
              </v-tab>
              <v-tab v-if="team.lvl === 'FOCUS'" value="visionaries" class="text-none">
                <Icon icon="mdi-eye" class="mr-2" />
                Visionarios ({{ team.visionaries.length }})
              </v-tab>
            </v-tabs>

            <v-card-text class="pt-4">
              <v-window v-model="tab">
                <v-window-item value="participants">
                  <v-list lines="two">
                    <v-list-item v-for="user in team.users" :key="user.id" :subtitle="user.participantLevel?.courseLevel">
                      <template v-slot:prepend>
                        <v-avatar color="info" variant="tonal">
                          <span class="text-h6">{{ user.name.charAt(0) }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ user.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-window-item>

                <v-window-item value="staff">
                  <v-list lines="two">
                    <v-list-item v-for="staff in team.staffs" :key="staff.user.id" :subtitle="staff.rol">
                      <template v-slot:prepend>
                        <v-avatar :color="levelColor" variant="tonal">
                          <span class="text-h6">{{ staff.user.name.charAt(0) }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ staff.user.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-window-item>

                <v-window-item value="visionaries">
                  <v-list lines="two">
                    <v-list-item v-for="visionary in team.visionaries" :key="visionary.user.id" :subtitle="visionary.role">
                      <template v-slot:prepend>
                        <v-avatar color="deep-purple" variant="tonal">
                          <span class="text-h6">{{ visionary.user.name.charAt(0) }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ visionary.user.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>

          <div class="d-flex">
            <v-btn variant="outlined" @click="onBack" class="mr-2">
              <Icon icon="mdi-arrow-left" class="mr-2" />
              Atrás
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" :loading="false" :disabled="disabled" size="large" @click="onFinish">
              <Icon icon="mdi-check" class="mr-2" />
              Confirmar Equipo
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.team-summary-card {
  position: relative;
  overflow: hidden;
}

.team-summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
}

:deep(.v-list-item) {
  border-radius: 8px;
  margin-bottom: 8px;
}

:deep(.v-tab) {
  text-transform: none !important;
  letter-spacing: normal !important;
}

:deep(.v-window) {
  border-radius: 0 0 8px 8px;
}
</style>
