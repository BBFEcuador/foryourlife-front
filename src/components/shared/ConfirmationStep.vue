<script setup lang="ts">
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';
import type { Visionary } from '@/models/Visionary';
import { showErrorToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const tab = ref('participants');
const router = useRouter();
const { saveTeamMutations } = useAdminTeamMutations();
const props = defineProps<{
  team: TeamWriteModel;
  disabled?: boolean;
}>();

const emit = defineEmits(['back', 'finish']);

const onBack = () => {
  emit('back');
};

const onSubmit = () => {
  saveTeamMutations.mutate(props.team);
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

watch(saveTeamMutations.isError, () => {
  if (saveTeamMutations.isError.value) {
    const error = saveTeamMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(saveTeamMutations.isSuccess, () => {
  if (saveTeamMutations.isSuccess.value) {
    router.push({ name: 'teams-admin' });
  }
});

const batchSize = 10;

const visibleParticipants = ref<Participant[]>([]);
const visibleStaffs = ref<StaffWriteModel[]>([]);
const visibleVisionaries = ref<Visionary[]>([]);

const loading = reactive({
  participants: false,
  staff: false,
  visionaries: false
});

const scrollRefs = {
  participants: ref(null),
  staff: ref(null),
  visionaries: ref(null)
};

// Función genérica para cargar más elementos
const loadMore = (tab: any) => {
  if (loading[tab]) return;
  loading[tab] = true;

  setTimeout(() => {
    let source, target;
    if (tab === 'participants') {
      source = props.team.users;
      target = visibleParticipants;
    } else if (tab === 'staff') {
      source = props.team.staffs;
      target = visibleStaffs;
    } else if (tab === 'visionaries') {
      source = props.team.visionaries;
      target = visibleVisionaries;
    }

    const nextBatch = source.slice(target.value.length, target.value.length + batchSize);
    target.value.push(...nextBatch);
    loading[tab] = false;
  }, 300); // Simula carga
};

// Evento de scroll
const onScroll = (tab, event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    loadMore(tab);
  }
};

// Inicializa la primera tanda
onMounted(() => {
  loadMore('participants');
  loadMore('staff');
  loadMore('visionaries');
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
                  <div class="text-caption text-medium-emphasis">{{ team.trainingObj?.startDate }} - {{
                    team.trainingObj?.endDate }}</div>
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
                  <div class="overflow-y-auto" style="max-height: 400px" @scroll="onScroll('participants', $event)"
                    ref="participantsContainer">
                    <v-list lines="two">
                      <v-list-item v-for="user in visibleParticipants" :key="user.id"
                        :subtitle="user.participantLevel?.courseLevel">
                        <template #prepend>
                          <v-avatar color="info" variant="tonal">
                            <span class="text-h6">{{ user.name.charAt(0) }}</span>
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{ user.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-window-item>

                <v-window-item value="staff">
                  <div class="overflow-y-auto" style="max-height: 400px" @scroll="onScroll('staff', $event)"
                    ref="staffContainer">
                    <v-list lines="two">
                      <v-list-item v-for="staff in visibleStaffs" :key="staff.user.id" :subtitle="staff.rol">
                        <template #prepend>
                          <v-avatar color="green" variant="tonal">
                            <span class="text-h6">{{ staff.user.name.charAt(0) }}</span>
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{ staff.user.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-window-item>

                <v-window-item value="visionaries">
                  <div class="overflow-y-auto" style="max-height: 400px" @scroll="onScroll('visionaries', $event)"
                    ref="visionariesContainer">
                    <v-list lines="two">
                      <v-list-item v-for="visionary in visibleVisionaries" :key="visionary.user.id"
                        :subtitle="visionary.role">
                        <template #prepend>
                          <v-avatar color="deep-purple" variant="tonal">
                            <span class="text-h6">{{ visionary.user.name.charAt(0) }}</span>
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{ visionary.user.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
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
            <v-btn color="success" :loading="saveTeamMutations.isPending.value" :disabled="disabled" size="large"
              @click="onSubmit">
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
