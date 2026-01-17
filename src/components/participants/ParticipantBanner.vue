<script setup lang="ts">
import profileBg from '@/assets/images/backgrounds/initlevel.jpg';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { Participant } from '@/models/Participants';
import { getInitialsAvatarUrl } from '@/service/getAvatar';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import useInvitation from '@/composables/invitation/useInvitation';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';

const route = useRoute();

interface props {
  participant: Participant;
}

const props = defineProps<props>();

const { promotionMasterLifeMutation, promotionVisionaryMutation, promotionStaffMutation } = useParticipantMutations();
const { invitation, isInvitationLoading } = useInvitation(props.participant.invitationToken);

const name = () => {
  Swal.fire({
    text: `Recuerda que desea promover a Masterlife`,
    title: '¿Está seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!',
    cancelButtonText: '¡Lo pensaré!'
  }).then((result) => {
    if (result.isConfirmed) {
      promotionMasterLifeMutation.mutate(props.participant.user.id, {
        onError(error) {
          const e = error as AxiosError<ErrorApiResponse>;
          showErrorToast(e);
        },
        onSuccess() {
          showSuccessToast('Master life creado exitosamente');
        }
      });
    }
  });
};

const promotionVisionary = () => {
  Swal.fire({
    text: `Recuerda que desea promover a Visionario`,
    title: '¿Está seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!',
    cancelButtonText: '¡Lo pensaré!'
  }).then((result) => {
    if (result.isConfirmed) {
      promotionVisionaryMutation.mutate(
        { userId: props.participant.user.id, role: 'VISIONARY' },
        {
          onError(error) {
            const e = error as AxiosError<ErrorApiResponse>;
            showErrorToast(e);
          },
          onSuccess() {
            showSuccessToast('Visionario creado exitosamente');
          }
        }
      );
    }
  });
};

const promotionStaff = () => {
  Swal.fire({
    text: `Recuerda que desea promover a Staff`,
    title: '¿Está seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!',
    cancelButtonText: '¡Lo pensaré!'
  }).then((result) => {
    if (result.isConfirmed) {
      promotionStaffMutation.mutate(
        { userId: props.participant.user.id, role: 'STAFF' },
        {
          onError(error) {
            const e = error as AxiosError<ErrorApiResponse>;
            showErrorToast(e);
          },
          onSuccess() {
            showSuccessToast('Staff creado exitosamente');
          }
        }
      );
    }
  });
};

const navigateToInvitation = (userId: string) => {
  if (!invitation.value.admin) {
    window.location.href = `/admin/participants/edit/${userId}`;
  } else return;
};
</script>
<template>
  <v-card elevation="0" class="tw:overflow-hidden">
    <v-img :src="profileBg" alt="profile" class="w-100 h-40" />
    <div>
      <v-row class="mt-1">
        <v-col cols="12" lg="4" sm="12" class="order-sm-second">
          <div class="px-4 py-1">
            <v-row class="justify-center">
              <v-col cols="6" class="d-flex flex-column align-center">
                <Icon icon="fluent:people-team-16-filled" height="20"></Icon>
                <h4 class="text-h4">{{ participant?.team?.name ?? 'N/A' }}</h4>
                <h6 class="text-h6 font-weight-regular">Equipo</h6>
              </v-col>
              <v-col cols="6" class="d-flex flex-column align-center">
                <Icon icon="token:lvl" height="20"></Icon>
                <h4 class="text-h4">{{ participant.participantLevel.courseLevel }}</h4>
                <h6 class="text-h6 font-weight-regular">Nivel</h6>
              </v-col>
              <v-label v-if="!isInvitationLoading" @click="navigateToInvitation(invitation.senderId)">
                Invitado por:
                <p class="tw:font-bold tw:underline ml-1">{{ invitation.enrolled.name }}</p>
              </v-label>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" lg="4" sm="12" class="d-flex justify-center order-sml-first">
          <div class="text-center top-spacer">
            <div class="avatar-border">
              <v-avatar size="100" class="userImage">
                <v-img :src="getInitialsAvatarUrl(participant?.name!)" alt="Avatar" />
              </v-avatar>
            </div>
            <h5 class="text-h5 mt-3">{{ participant.name }}</h5>
            <span class="textSecondary font-weight-regular">Estudiante</span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" sm="12" class="d-flex justify-center order-sml-first">
          <v-menu location="bottom" v-if="participant.participantLevel.courseLevel == 'LIFE_GRADUATE'">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" class="px-4">
                <Icon icon="mdi:account-convert" class="mr-2" />
                Promover participante
                <Icon icon="mdi:chevron-down" class="ml-2" />
              </v-btn>
            </template>

            <v-list width="300" class="pa-2">
              <v-list-item
                @click="name"
                :disabled="promotionMasterLifeMutation.isPending.value"
                title="Master Life"
                subtitle="Promover a Master Life"
                class="mb-2 rounded-lg"
              >
                <template v-slot:append>
                  <Icon icon="mdi:school" class="mr-2" />
                  <v-progress-circular
                    v-if="promotionMasterLifeMutation.isPending.value"
                    indeterminate
                    size="20"
                    width="2"
                    color="primary"
                  />
                </template>
              </v-list-item>

              <v-list-item
                @click="promotionVisionary"
                :disabled="promotionVisionaryMutation.isPending.value"
                title="Visionario"
                subtitle="Promover a Visionario"
                class="mb-2 rounded-lg"
              >
                <template v-slot:append>
                  <Icon icon="mdi:eye-outline" class="mr-2" />
                  <v-progress-circular
                    v-if="promotionVisionaryMutation.isPending.value"
                    indeterminate
                    size="20"
                    width="2"
                    color="primary"
                  />
                </template>
              </v-list-item>

              <v-list-item
                @click="promotionStaff"
                :disabled="promotionStaffMutation.isPending.value"
                title="Staff"
                subtitle="Promover a Staff"
                class="rounded-lg"
              >
                <template v-slot:append>
                  <Icon icon="mdi:account-tie" class="mr-2" />
                  <v-progress-circular v-if="promotionStaffMutation.isPending.value" indeterminate size="20" width="2" color="primary" />
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style lang="scss">
.avatar-border {
  background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
  border-radius: 50%;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  .userImage {
    border: 4px solid rgb(255, 255, 255);
  }
}

.top-spacer {
  margin-top: -80px;
}

.profiletab .v-slide-group__content {
  justify-content: end;

  .v-btn--variant-text .v-btn__overlay {
    background: transparent;
  }
}

@media (max-width: 1023px) {
  .order-sm-second {
    order: 2;
  }

  .order-sml-first {
    order: 1;
  }

  .order-sm-third {
    order: 3;
  }

  .order-sm-last {
    order: 4;
  }
}

.btn-brand-facebook {
  background-color: rgb(24, 119, 242) !important;
}

.btn-brand-twitter {
  background-color: rgb(29, 161, 242) !important;
}

.btn-brand-dribbble {
  background-color: rgb(234, 76, 137) !important;
}

.btn-brand-youtube {
  background-color: rgb(205, 32, 31) !important;
}
</style>
