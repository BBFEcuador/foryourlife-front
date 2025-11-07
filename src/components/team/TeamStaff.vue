<script setup lang="ts">
import useAdminTeamMutations from '@/composables/admin/team/useAdminTeamMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant, Team } from '@/models/Participants';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';

interface Props {
  team: Team;
  isTeamLoading: boolean;
  isTeamError: boolean;
  isForEdit: boolean;
}
const props = defineProps<Props>();
const { removeParticipantsMutations, promoteParticipantsMutation } = useAdminTeamMutations();

const headers = props.isForEdit
  ? [
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
    ]
  : [
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
      }
    ];

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

const onRemoveParticipant = async (id: string) => {
  const result = await Swal.fire({
    title: '¿Quitar Staff?',
    text: `¿Está seguro que desea quitar a ${props.team.staffs.find((user) => user.id === id)?.user.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    removeParticipantsMutations.mutate(
      { url: 'removeStaffs', teamId: props.team.id, users: [{ id } as Participant] },
      {
        onError(e) {
          const error = e as AxiosError<ErrorApiResponse>;
          showErrorToast(error);
        },
        onSuccess(_, v, __) {
          props.team.staffs = props.team.staffs.filter((x) => x.id != v.users[0].id);
          showSuccessToast('Staff quitado correctamente');
        }
      }
    );
  }
};
</script>
<template>
  <v-data-table :headers="headers" show-select :search="search" :items="team.staffs" :loading="isTeamLoading">
    <template #top>
      <v-toolbar
        class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
        flat
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="250"
      >
        <div class="tw:flex-1 tw:max-w-md tw:relative">
          <VTextField
            v-model="search"
            placeholder="Buscar participantes..."
            variant="outlined"
            density="comfortable"
            hide-details
            class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
            bg-color="white"
          >
            <template #prepend-inner>
              <div class="tw:relative">
                <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
              </div>
            </template>
            <template #append v-if="search">
              <VBtn icon variant="text" size="small" @click="search = ''" class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                <Icon icon="mdi:close" height="18" />
              </VBtn>
            </template>
          </VTextField>
        </div>
      </v-toolbar>
    </template>
    <template #item.name="{ item }">
      <span class="tw:text-nowrap">{{ item.user.name }}</span>
    </template>
    <template #item.phone="{ item }">
      <v-btn
        variant="tonal"
        color="primary"
        rounded="xl"
        size="small"
        v-tooltip="'Llamar'"
        @click="handleContact('phone', item.user.phone)"
      >
        <Icon icon="mdi-phone" />
        <span class="tw:text-nowrap ml-2">{{ item.user.phone }}</span>
      </v-btn>
    </template>
    <template #item.email="{ item }">
      <v-btn variant="tonal" color="secondary" rounded="xl" size="small" @click="handleContact('email', item.user.email)">
        <Icon icon="mdi-email" />
        <span class="tw:text-nowrap ml-2">{{ item.user.email }}</span>
      </v-btn>
    </template>
    <template #item.actions="{ item }" v-if="isForEdit">
      <VBtn
        v-if="checkPermission(PermissionEnum.UPDATE_TEAMS)"
        icon
        variant="text"
        :loading="removeParticipantsMutations.isPending.value"
        color="error"
        @click="onRemoveParticipant(item.id)"
        class="!tw:bg-red-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-red-100 tw:transition-all group"
        v-tooltip="'Quitar participante'"
      >
        <div class="tw:relative">
          <Icon icon="ant-design:user-delete-outlined" height="22" class="tw:transition-transform group-hover:tw:scale-110" />
          <div class="tw:absolute tw:inset-0 bg-error tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"></div>
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
        <h3 class="tw:text-xl tw:font-medium tw:text-gray-700 tw:mb-2">No se encontró staff</h3>
        <p class="tw:text-gray-500">Intenta con otros términos de búsqueda</p>
        <VBtn
          v-if="checkPermission(PermissionEnum.SEE_TEAMS)"
          variant="text"
          color="primary"
          class="tw:mt-4"
          :loading="isTeamLoading"
          @click="refreshParticipantsTeams"
        >
          <div class="tw:relative">
            <Icon icon="mdi:refresh" class="mr-2 tw:transition-transform hover:tw:rotate-180" />
            <div class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-20"></div>
          </div>
          Recargar Miembros
        </VBtn>
      </div>
    </template>
  </v-data-table>
</template>
<style scoped></style>
