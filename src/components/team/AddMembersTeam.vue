<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { Participant, Team } from '@/models/Participants';
import type { AxiosError } from 'axios';
import { showErrorToast } from '@/service/sweetAlert';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import useMasterlifesMutations from '@/composables/masterlife/useMasterlifeMutations';
import useVisionarymutations from '@/composables/admin/visionaries/useVisionarymutations';
import type { Visionary } from '@/models/Visionary';
import type { StaffWriteModel } from '@/models/Staff';
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import type { MasterLife } from '@/models/MasterLife';
import type { AddUsers } from '@/models/AddUsers';

const tab = ref('1');
const selectedParticipants = ref<string[]>([]);
const participants = ref<Participant[]>([]);
const searchParticipant = ref('');

const visionaries = ref<Visionary[]>([]);
const selectedVisionaries = ref<string[]>([]);
const searchVisionary = ref('');

const staffs = ref<StaffWriteModel[]>([]);
const selectedStaffs = ref<string[]>([]);
const searchStaff = ref('');

const masterlifes = ref<MasterLife[]>([]);
const selectedMasterlifes = ref<string[]>([]);
const searchMasterlife = ref('');

const { getByLvlMutation } = useParticipantMutations();
const { availableMasterlifeMembersMutations } = useMasterlifesMutations();
const { availableVisionaryMutations } = useVisionarymutations();
const { availableStaffMutations } = useStaffMutations();

interface FormData {
  // id?: string;
  members: string[];
}

interface Props {
  modelValue: boolean;
  isLoading?: boolean;
  team?: Team;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  programs: () => []
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', members: AddUsers): void;
  (e: 'cancel'): void;
}>();

const isOpen = ref(false);
const form = ref<HTMLFormElement | null>(null);

const createDefaultFormData = (): FormData => ({
  members: []
});

const formData = ref<FormData>(createDefaultFormData());

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      formData.value = {
        members: selectedParticipants.value || []
      };
    } else {
      selectedParticipants.value = [];
      selectedVisionaries.value = [];
    }
  },
  { immediate: true }
);

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const saveAddMembers = async () => {
  const membersData: AddUsers = {
    userIds: selectedParticipants.value || [],
    masterLifeIds: selectedMasterlifes.value || [],
    staffIds: selectedStaffs.value || [],
    visitorIds: selectedVisionaries.value || []
  };
  console.log('Members to add:', membersData);
  emit('save', membersData);
};

onBeforeMount(() => {
  const training = props.team?.training;
  if (!training) return;

  getByLvlMutation.mutate({ lvl: training.courseLevel, ...(training.campus?.id && { campusId: training.campus.id }) });
  availableMasterlifeMembersMutations.mutate({
    endDate: props.team?.training?.endDate!,
    startDate: props.team?.training?.startDate!
  });
  availableVisionaryMutations.mutate({
    endDate: props.team?.training?.endDate!,
    startDate: props.team?.training?.startDate!
  });
  availableStaffMutations.mutate({
    endDate: props.team?.training?.endDate!,
    startDate: props.team?.training?.startDate!
  });
});

// PARTICIPANTS
watch(getByLvlMutation.isError, () => {
  if (getByLvlMutation.isError.value) {
    const error = getByLvlMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});
watch(getByLvlMutation.isSuccess, () => {
  if (getByLvlMutation.isSuccess.value) {
    const response = getByLvlMutation.data.value;
    if (response) {
      participants.value = response;
    }
  }
});

const selectAllParticipants = computed({
  get() {
    return filteredParticipants.value.length > 0 && filteredParticipants.value.every((p) => selectedParticipants.value.includes(p.id));
  },
  set(value: boolean) {
    if (value) {
      const ids = filteredParticipants.value.map((p) => p.id);
      selectedParticipants.value = Array.from(new Set([...selectedParticipants.value, ...ids]));
    } else {
      const ids = filteredParticipants.value.map((p) => p.id);
      selectedParticipants.value = selectedParticipants.value.filter((id) => !ids.includes(id));
    }
  }
});
const filteredParticipants = computed(() => {
  if (!searchParticipant.value) return participants.value;

  const search = searchParticipant.value.toLowerCase();

  return participants.value.filter((p) => p.name?.toLowerCase().includes(search));
});
console.log('Participants available:', participants);
// FIN PARTICIPANTS

// VISIONARIES
watch(availableVisionaryMutations.isError, () => {
  if (availableVisionaryMutations.isError.value) {
    const error = availableVisionaryMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});
watch(availableVisionaryMutations.isSuccess, () => {
  if (availableVisionaryMutations.isSuccess.value) {
    const response = availableVisionaryMutations.data.value;
    if (response) {
      visionaries.value = response;
    }
  }
});

const selectAllVisionaries = computed({
  get() {
    return filteredVisionaries.value.length > 0 && filteredVisionaries.value.every((p) => selectedVisionaries.value.includes(p.user.id));
  },
  set(value: boolean) {
    if (value) {
      const ids = filteredVisionaries.value.map((p) => p.user.id);
      selectedVisionaries.value = Array.from(new Set([...selectedVisionaries.value, ...ids]));
    } else {
      const ids = filteredVisionaries.value.map((p) => p.user.id);
      selectedVisionaries.value = selectedVisionaries.value.filter((id) => !ids.includes(id));
    }
  }
});
const filteredVisionaries = computed(() => {
  if (!searchVisionary.value) return visionaries.value;

  const search = searchVisionary.value.toLowerCase();

  return visionaries.value.filter((p) => p.user.name?.toLowerCase().includes(search));
});

// END VISIONARIES

// STAFFS
watch(availableStaffMutations.isError, () => {
  if (availableStaffMutations.isError.value) {
    const error = availableStaffMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});
watch(availableStaffMutations.isSuccess, () => {
  if (availableStaffMutations.isSuccess.value) {
    const response = availableStaffMutations.data.value;
    if (response) {
      staffs.value = response;
    }
  }
});

const selectAllStaffs = computed({
  get() {
    return filteredStaffs.value.length > 0 && filteredStaffs.value.every((p) => selectedStaffs.value.includes(p.user.id));
  },
  set(value: boolean) {
    if (value) {
      const ids = filteredStaffs.value.map((p) => p.user.id);
      selectedStaffs.value = Array.from(new Set([...selectedStaffs.value, ...ids]));
    } else {
      const ids = filteredStaffs.value.map((p) => p.user.id);
      selectedStaffs.value = selectedStaffs.value.filter((id) => !ids.includes(id));
    }
  }
});
const filteredStaffs = computed(() => {
  if (!searchStaff.value) return staffs.value;

  const search = searchStaff.value.toLowerCase();

  return staffs.value.filter((p) => p.user.name?.toLowerCase().includes(search));
});
// END STAFFS

// MASTERLIFES
watch(availableMasterlifeMembersMutations.isError, () => {
  if (availableMasterlifeMembersMutations.isError.value) {
    const error = availableMasterlifeMembersMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(availableMasterlifeMembersMutations.isSuccess, () => {
  if (availableMasterlifeMembersMutations.isSuccess.value) {
    const response = availableMasterlifeMembersMutations.data.value;
    if (response) {
      masterlifes.value = response;
      console.log('Masterlifes loaded:', masterlifes.value);
    }
  }
});

const selectAllMasterlifes = computed({
  get() {
    return filteredMasterlifes.value.length > 0 && filteredMasterlifes.value.every((p) => selectedMasterlifes.value.includes(p.user.id));
  },
  set(value: boolean) {
    if (value) {
      const ids = filteredMasterlifes.value.map((p) => p.user.id);
      selectedMasterlifes.value = Array.from(new Set([...selectedMasterlifes.value, ...ids]));
    } else {
      const ids = filteredMasterlifes.value.map((p) => p.user.id);
      selectedMasterlifes.value = selectedMasterlifes.value.filter((id) => !ids.includes(id));
    }
  }
});
const filteredMasterlifes = computed(() => {
  if (!searchMasterlife.value) return masterlifes.value;

  const search = searchMasterlife.value.toLowerCase();

  return masterlifes.value.filter((p) => p.user.name?.toLowerCase().includes(search));
});
// END MASTERLIFES
</script>
<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center bg-primary">
        <Icon class="mr-2" icon="mdi:account-plus" height="20" />
        <span class="text-h6 text-white">Agregar Miembros</span>
        <v-spacer />
        <v-btn icon variant="text" @click="closeDialog">
          <Icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0 flex-grow-1 tw:overflow-y-auto">
        <v-form ref="form" @submit.prevent="saveAddMembers">
          <v-tabs v-model="tab">
            <v-tab value="1">Participantes</v-tab>
            <v-tab value="2" v-if="props.team?.training?.courseLevel == 'FOCUS'">Visionarios</v-tab>
            <v-tab value="3" v-if="props.team?.training?.courseLevel == 'YOUR' || props.team?.training?.courseLevel == 'FOCUS'"
              >Staff</v-tab
            >
            <v-tab value="4" v-if="props.team?.training?.courseLevel == 'LIFE'">Master life</v-tab>
          </v-tabs>
          <v-card-text class="pa-0">
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="1">
                <div v-if="getByLvlMutation.isPending.value" class="tw:flex tw:justify-center tw:items-center tw-my-6">
                  <v-progress-circular indeterminate color="primary" size="50" width="6" />
                </div>
                <div v-else-if="getByLvlMutation.isSuccess.value">
                  <!-- {{ selectedParticipants }} -->
                  <v-toolbar class="px-3 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50 ma-0" flat v-motion>
                    <template v-slot:prepend>
                      <v-checkbox hide-details v-model="selectAllParticipants" />
                    </template>
                    <VTextField
                      v-model="searchParticipant"
                      placeholder="Buscar..."
                      variant="outlined"
                      density="compact"
                      class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                      clearable
                      hide-details
                    >
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                        </div>
                      </template>
                    </VTextField>
                  </v-toolbar>
                  <div class="pl-4">
                    <v-checkbox
                      v-for="p in filteredParticipants"
                      v-model="selectedParticipants"
                      :label="p.name"
                      :value="p.id"
                      hide-details
                    ></v-checkbox>
                  </div>
                </div>
                <div v-else-if="getByLvlMutation.isError.value" class="text-center">
                  <Icon icon="mdi-account-off" size="48" class="tw-text-gray-400 mx-auto" height="24" />
                  <p class="text-body-3 mt-2 text-muted">Error al cargar los participantes.</p>
                  <div class="tw-text-red-600 text-center"></div>
                </div>
              </v-tabs-window-item>

              <!-- VISIONARIES -->
              <v-tabs-window-item value="2" v-if="props.team?.training?.courseLevel == 'FOCUS'">
                <div v-if="availableVisionaryMutations.isPending.value" class="tw:flex tw:justify-center tw:items-center tw-my-6">
                  <v-progress-circular indeterminate color="primary" size="50" width="6" />
                </div>
                <div v-else-if="availableVisionaryMutations.isSuccess.value">
                  <!-- {{ selectedVisionaries }} -->
                  <v-toolbar class="px-3 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50 ma-0" flat v-motion>
                    <template v-slot:prepend>
                      <v-checkbox hide-details v-model="selectAllVisionaries" />
                    </template>
                    <VTextField
                      v-model="searchVisionary"
                      placeholder="Buscar..."
                      variant="outlined"
                      density="compact"
                      class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                      clearable
                      hide-details
                    >
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                        </div>
                      </template>
                    </VTextField>
                  </v-toolbar>
                  <div class="pl-4">
                    <v-checkbox
                      v-for="p in filteredVisionaries"
                      v-model="selectedVisionaries"
                      :label="p.user.name"
                      :value="p.id"
                      hide-details
                    ></v-checkbox>
                  </div>
                </div>
                <div v-else-if="availableVisionaryMutations.isError.value" class="text-center">
                  <Icon icon="mdi-account-off" size="48" class="tw-text-gray-400 mx-auto" height="24" />
                  <p class="text-body-3 mt-2 text-muted">Error al cargar los visionarios.</p>
                  <div class="tw-text-red-600 text-center"></div>
                </div>
              </v-tabs-window-item>

              <!-- STAFFS -->
              <v-tabs-window-item
                value="3"
                v-if="props.team?.training?.courseLevel == 'YOUR' || props.team?.training?.courseLevel == 'FOCUS'"
              >
                <div v-if="availableStaffMutations.isPending.value" class="tw:flex tw:justify-center tw:items-center tw-my-6">
                  <v-progress-circular indeterminate color="primary" size="50" width="6" />
                </div>
                <div v-else-if="availableStaffMutations.isSuccess.value">
                  <!-- {{ selectedStaffs }} -->
                  <v-toolbar class="px-3 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50 ma-0" flat v-motion>
                    <template v-slot:prepend>
                      <v-checkbox hide-details v-model="selectAllStaffs" />
                    </template>
                    <VTextField
                      v-model="searchStaff"
                      placeholder="Buscar..."
                      variant="outlined"
                      density="compact"
                      class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                      clearable
                      hide-details
                    >
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                        </div>
                      </template>
                    </VTextField>
                  </v-toolbar>
                  <div class="pl-4">
                    <v-checkbox
                      v-for="p in filteredStaffs"
                      v-model="selectedStaffs"
                      :label="p.user.name"
                      :value="p.id"
                      hide-details
                    ></v-checkbox>
                  </div>
                </div>
                <div v-else-if="availableStaffMutations.isError.value" class="text-center">
                  <Icon icon="mdi-account-off" size="48" class="tw-text-gray-400 mx-auto" height="24" />
                  <p class="text-body-3 mt-2 text-muted">Error al cargar los staffs.</p>
                  <div class="tw-text-red-600 text-center"></div>
                </div>
              </v-tabs-window-item>

              <!-- MasterLife -->
              <v-tabs-window-item value="4" v-if="props.team?.training?.courseLevel == 'LIFE'">
                <div v-if="availableMasterlifeMembersMutations.isPending.value" class="tw:flex tw:justify-center tw:items-center tw-my-6">
                  <v-progress-circular indeterminate color="primary" size="50" width="6" />
                </div>
                <div v-else-if="availableMasterlifeMembersMutations.isSuccess.value">
                  <!-- {{ selectedMasterlifes }} -->
                  <v-toolbar class="px-3 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50 ma-0" flat v-motion>
                    <template v-slot:prepend>
                      <v-checkbox hide-details v-model="selectAllMasterlifes" />
                    </template>
                    <VTextField
                      v-model="searchMasterlife"
                      placeholder="Buscar..."
                      variant="outlined"
                      density="compact"
                      class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                      clearable
                      hide-details
                    >
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                        </div>
                      </template>
                    </VTextField>
                  </v-toolbar>
                  <div class="pl-4">
                    <v-checkbox
                      v-for="p in filteredMasterlifes"
                      v-model="selectedMasterlifes"
                      :label="p.user.name"
                      :value="p.id"
                      hide-details
                    ></v-checkbox>
                  </div>
                </div>
                <div v-else-if="availableStaffMutations.isError.value" class="text-center">
                  <Icon icon="mdi-account-off" size="48" class="tw-text-gray-400 mx-auto" height="24" />
                  <p class="text-body-3 mt-2 text-muted">Error al cargar los staffs.</p>
                  <div class="tw-text-red-600 text-center"></div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
        <v-spacer />
        <v-btn color="error" variant="flat" :disabled="isLoading" @click="closeDialog"> Cancelar </v-btn>
        <v-btn color="primary" variant="flat" :loading="isLoading" @click="saveAddMembers"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
