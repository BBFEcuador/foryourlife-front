<script setup lang="ts">
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant, Team } from '@/models/Participants';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import UiParentCard from '../shared/UiParentCard.vue';
import InputSection from '../forms/InputSection.vue';

interface Props {
  team: Team;
  isTeamLoading: boolean;
  isTeamError: boolean;
}
const props = defineProps<Props>();
const { removeParticipantsMutations } = useAdminTeamMutations();
const userToDelete = ref<Participant>({} as Participant);
const showDeleteParticipant = ref(false);

const headers = ref([
  {
    title: 'Participante',
    value: 'name',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Contacto',
    value: 'phone',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Correo',
    value: 'email',
    width: '200',
    class: 'tw:text-nowrap',
    sortable: true
  },
  {
    title: 'Ajustes',
    value: 'actions',
    width: '110',
    align: 'center' as const,
    sortable: false
  }
]);

// const AttendanceStatus = {
//     PRESENT: 'present',
//     ABSENT: 'absent',
//     DESERTED: 'deserted'
// } as const;

// type AttendanceType = typeof AttendanceStatus[keyof typeof AttendanceStatus];

// const mockAttendance = ref(new Map(props.team.users.map(user => [
//     user.id,
//     {
//         friday: Math.random() > 0.7 ? AttendanceStatus.ABSENT : 
//                Math.random() > 0.9 ? AttendanceStatus.DESERTED : AttendanceStatus.PRESENT,
//         saturday: Math.random() > 0.7 ? AttendanceStatus.ABSENT : 
//                  Math.random() > 0.9 ? AttendanceStatus.DESERTED : AttendanceStatus.PRESENT,
//         sunday: Math.random() > 0.7 ? AttendanceStatus.ABSENT : 
//                Math.random() > 0.9 ? AttendanceStatus.DESERTED : AttendanceStatus.PRESENT
//     }
// ])));

// const getAttendanceColor = (status: AttendanceType): string => {
//     switch (status) {
//         case AttendanceStatus.PRESENT:
//             return 'success';
//         case AttendanceStatus.ABSENT:
//             return 'error';
//         case AttendanceStatus.DESERTED:
//             return 'warning';
//         default:
//             return 'error';
//     }
// };

// const getAttendanceIcon = (status: AttendanceType): string => {
//     switch (status) {
//         case AttendanceStatus.PRESENT:
//             return 'mdi:check';
//         case AttendanceStatus.ABSENT:
//             return 'mdi:close';
//         case AttendanceStatus.DESERTED:
//             return 'mdi:run-fast';
//         default:
//             return 'mdi:close';
//     }
// };

// const toggleAttendance = (userId: string, day: 'friday' | 'saturday' | 'sunday') => {
//     const userAttendance = mockAttendance.value.get(userId);
//     if (userAttendance) {
//         const currentStatus = userAttendance[day];
//         let newStatus: AttendanceType;

//         switch (currentStatus) {
//             case AttendanceStatus.PRESENT:
//                 newStatus = AttendanceStatus.ABSENT;
//                 break;
//             case AttendanceStatus.ABSENT:
//                 newStatus = AttendanceStatus.DESERTED;
//                 break;
//             case AttendanceStatus.DESERTED:
//                 newStatus = AttendanceStatus.PRESENT;
//                 break;
//             default:
//                 newStatus = AttendanceStatus.PRESENT;
//         }

//         userAttendance[day] = newStatus;
//         mockAttendance.value.set(userId, { ...userAttendance });
//     }
// };

const handleContact = (type: 'email' | 'phone', contact: string) => {
  if (type === 'email') {
    window.location.href = `mailto:${contact}`;
  } else {
    window.location.href = `tel:${contact}`;
  }
};
const search = ref('');
const emit = defineEmits(['refetchTeam', 'send-participants']);

const refreshParticipantsTeams = async () => {
  search.value = '';
  emit('refetchTeam');
};

const onRemoveParticipant = async (id: Participant) => {
  userToDelete.value = { ...id };
  showDeleteParticipant.value = true;
};

const onDelete = () => {
  removeParticipantsMutations.mutate(
    { url: 'removeParticipants', teamId: props.team.id, users: [{ ...userToDelete.value, isDesertor: !userToDelete.value.isLingerer }] },
    {
      onError(e) {
        const error = e as AxiosError<ErrorApiResponse>;
        showErrorToast(error);
      },
      onSuccess(_, v, __) {
        props.team.users = props.team.users.filter((x) => x.id != v.users[0].id);
        showDeleteParticipant.value = false;
        showSuccessToast('Participante quitado correctamente');
      }
    }
  );
};

const colorSwitch = computed(() => {
  return userToDelete.value.isLingerer ? 'warning' : 'error';
});
</script>
<template>
  <v-data-table :headers="headers" show-select :search="search" :items="team.users" :loading="isTeamLoading">
    <template #top>
      <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
        :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
        <div class="tw:flex-1 tw:max-w-md tw:relative">
          <VTextField v-model="search" placeholder="Buscar participantes..." variant="outlined" density="comfortable"
            hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm" bg-color="white">
            <template #prepend-inner>
              <div class="tw:relative">
                <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
              </div>
            </template>
            <template #append v-if="search">
              <VBtn icon variant="text" size="small" @click="search = ''"
                class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                <Icon icon="mdi:close" height="18" />
              </VBtn>
            </template>
          </VTextField>
        </div>
      </v-toolbar>
    </template>
    <template #item.name="{ item }">
      <span class="tw:text-nowrap">{{ item.name }}</span>
    </template>
    <template #item.phone="{ item }">
      <v-btn variant="tonal" color="primary" rounded="xl" size="small" v-tooltip="'Llamar'"
        @click="handleContact('phone', item.phone)">
        <Icon icon="mdi-phone" />
        <span class="tw:text-nowrap ml-2">{{ item.phone }}</span>
      </v-btn>
    </template>
    <template #item.email="{ item }">
      <v-btn variant="tonal" color="secondary" rounded="xl" size="small" @click="handleContact('email', item.email)">
        <Icon icon="mdi-email" />
        <span class="tw:text-nowrap ml-2">{{ item.email }}</span>
      </v-btn>
    </template>
    <template #item.actions="{ item }">
      <VBtn icon variant="text" :loading="removeParticipantsMutations.isPending.value" color="error"
        @click="onRemoveParticipant(item)"
        class="!tw:bg-red-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-red-100 tw:transition-all group"
        v-tooltip="'Quitar participante'">
        <div class="tw:relative">
          <Icon icon="ant-design:user-delete-outlined" height="22"
            class="tw:transition-transform group-hover:tw:scale-110" />
          <div
            class="tw:absolute tw:inset-0 bg-error tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity">
          </div>
        </div>
      </VBtn>
    </template>
    <template #loading>
      <VProgressLinear color="primary" indeterminate class="tw:rounded-t-xl" height="2" />
      <div class="tw:flex tw:justify-center tw:py-12 tw:bg-gray-50/30">
        <div class="tw:flex tw:items-center tw:gap-4 tw:bg-white tw:px-6 tw:py-4 tw:rounded-2xl tw:shadow-lg">
          <VProgressCircular indeterminate color="primary" size="24" width="3" />
          <div>
            <p class="tw:font-medium tw:text-gray-700">Cargando participantes</p>
            <p class="tw:text-sm tw:text-gray-500">Por favor espere...</p>
          </div>
        </div>
      </div>
    </template>

    <template #no-data>
      <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:bg-gray-50/30">
        <div class="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-gray-100 tw:to-transparent tw:opacity-50"></div>
        <div class="tw:relative tw:z-10">
          <Icon icon="mdi:account-group" height="64" class="tw:text-gray-400 tw:mb-2" />
          <div class="tw:absolute tw:-top-1 tw:-right-1">
            <div class="tw:relative">
              <Icon icon="mdi:close-circle" class="tw:text-red-500" height="24" />
              <div class="tw:absolute tw:inset-0 tw:bg-red-500 tw:opacity-25 tw:blur-sm tw:rounded-full"></div>
            </div>
          </div>
        </div>
        <h3 class="tw:text-xl tw:font-medium tw:text-gray-700 tw:mb-2">No se encontraron equipos</h3>
        <p class="tw:text-gray-500">Intenta con otros términos de búsqueda</p>
        <VBtn variant="text" color="primary" class="tw:mt-4" :loading="isTeamLoading" @click="refreshParticipantsTeams">
          <div class="tw:relative">
            <Icon icon="mdi:refresh" class="mr-2 tw:transition-transform hover:tw:rotate-180" />
            <div class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-20">
            </div>
          </div>
          Recargar Miembros
        </VBtn>
      </div>
    </template>
  </v-data-table>
  <VDialog max-width="500" v-model="showDeleteParticipant" persistent>
    <UiParentCard title="Quitar Participante" class="tw:overflow-hidden">
      <div class="tw:space-y-6">
        <!-- Warning Message -->
        <div class="tw:p-4 tw:rounded-xl tw:flex tw:items-start tw:gap-3">
          <div class="tw:relative">
            <Icon icon="mdi:alert-circle" class="text-error" height="24" />
            <div class="tw:absolute tw:inset-0 tw:opacity-25 tw:blur-sm tw:rounded-full"></div>
          </div>
          <div class="tw:flex-1">
            <h4 class="tw:font-medium text-error">¿Estás seguro de expulsar a este participante del equipo {{ team.name
              }}?</h4>
            <p class="text-error tw:font-bold tw:mt-1">{{ userToDelete.name }}</p>
          </div>
        </div>
        <div class="tw:p-4 tw:rounded-xl">
          <InputSection label="Tipo de Expulsión" class="mb-2">
            <div class="tw:flex tw:items-center align-center tw:gap-4">
              <Icon icon="mdi:account-off" class="text-error" height="24" />
              <span class="tw:font-medium text-error">Desertor</span>
              <VSwitch v-model="userToDelete.isLingerer" hide-details
                :class="userToDelete.isLingerer ? 'text-error' : 'text-warning'" />

                <span class="tw:font-medium text-warning">Rezagado</span>
                <Icon icon="mdi:account-clock" class="text-warning" height="24" />
            </div>
          </InputSection>
        </div>
      </div>
      <div class="tw:flex tw:justify-end tw:gap-3 tw:mt-6">
        <VBtn :loading="removeParticipantsMutations.isPending.value" variant="outlined" color="gray"
          @click="showDeleteParticipant = false" class="tw:min-w-[100px]">
          <Icon icon="mdi:close" class="mr-2" />
          Cancelar
        </VBtn>
        <VBtn :loading="removeParticipantsMutations.isPending.value" color="error" @click="onDelete"
          class="tw:min-w-[100px]">
          <div class="tw:relative">
            <Icon icon="mdi:account-remove" class="mr-2" />
            <div class="tw:absolute tw:inset-0 tw:bg-white tw:opacity-25 tw:blur-sm tw:rounded-full"></div>
          </div>
          Quitar
        </VBtn>
      </div>
    </UiParentCard>
  </VDialog>
</template>
<style scoped></style>
