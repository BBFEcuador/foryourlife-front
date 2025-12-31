<script setup lang="ts">
import TeamBanner from '@/components/team/TeamBanner.vue';
import TeamDetails from '@/components/team/TeamDetails.vue';
import TeamMasterLife from '@/components/team/TeamMasterLife.vue';
import TeamParticipantsList from '@/components/team/TeamParticipantsList.vue';
import TeamStaff from '@/components/team/TeamStaff.vue';
import TeamVisionary from '@/components/team/TeamVisionary.vue';
import type { Team } from '@/models/Participants';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import { Icon } from '@iconify/vue/dist/iconify.js';
import AddMembersTeam from '@/components/team/AddMembersTeam.vue';
import type { AddUsers } from '@/models/AddUsers';
import useMembersMutations from '@/composables/admin/team/useAdminTeamAddUserMutations';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';

interface props {
  team: Team;
  isTeamLoading: boolean;
  isTeamError: boolean;
  isForEdit: boolean;
}
const tab = ref('1');
const props = defineProps<props>();
const emits = defineEmits(['fetch-team']);
const fetchTeamData = async () => {
  emits('fetch-team');
};
const router = useRouter();
const onPromoteTeam = () => {
  const courseLevel = props.team?.training?.courseLevel;
  const teamId = props.team.id;
  switch (courseLevel) {
    case 'FOCUS':
      router.push({ name: 'promote-focus', params: { id: teamId } });
      break;
    case 'YOUR':
      router.push({ name: 'promote-your', params: { id: teamId } });
      break;
    case 'LIFE':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'LIFE_2':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'LIFE_3':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    case 'GRADUATE':
      router.push({ name: 'promote-life', params: { id: teamId } });
      break;
    default:
      console.error(`Nivel desconocido: ${courseLevel}`);
  }
};

const showAddMembersDialog = ref(false);
const { saveAddMembersMutations } = useMembersMutations();
const saveAddedMembers = (members: AddUsers) => {
  saveAddMembersMutations.mutate(
    { teamId: props.team.id, members },
    {
      onSuccess: async () => {
        showAddMembersDialog.value = false;
        toast.success('Miembros agregados exitosamente');
        await fetchTeamData();
      },
      onError(error) {
        console.error('Error al agregar miembros:', error);
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || 'Error al agregar miembros');
      }
    }
  );
};
</script>
<template>
  <div>
    <TeamBanner :team class="mb-2" />
    <v-row>
      <VCol cols="12" md="3" sm="12" class="tw:flex tw:flex-col tw:items-center">
        <TeamDetails :team />
      </VCol>
      <VCol cols="12" md="9" sm="12" class="tw:gap-4">
        <div cols="12" md="3" sm="12" class="text-end mb-4">
          <v-btn class="" color="secondary" @click="showAddMembersDialog = true">
            <Icon class="mr-2" icon="mdi:account-plus" height="24" /> Agregar miembros</v-btn
          >
        </div>
        <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-tabs v-model="tab">
            <v-tab value="1">Participantes</v-tab>
            <v-tab value="2" v-if="team.trainingData?.curseLevel == 'FOCUS'">Visionarios</v-tab>
            <v-tab value="3" v-if="team.trainingData?.curseLevel == 'YOUR' || team.trainingData?.curseLevel == 'FOCUS'">Staff</v-tab>
            <v-tab value="4" v-if="team.trainingData?.curseLevel == 'LIFE'">Master life</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="1">
                <TeamParticipantsList
                  :team="team"
                  :isTeamLoading="isTeamLoading"
                  :isTeamError="isTeamError"
                  :is-for-edit="isForEdit"
                  @refetchTeam="fetchTeamData"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="2" v-if="team.trainingData?.curseLevel == 'FOCUS'">
                <TeamVisionary
                  :team="team"
                  :isTeamLoading="isTeamLoading"
                  :isTeamError="isTeamError"
                  @refetchTeam="fetchTeamData"
                  :is-for-edit="isForEdit"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="3" v-if="team.trainingData?.curseLevel == 'YOUR' || team.trainingData?.curseLevel == 'FOCUS'">
                <TeamStaff
                  :team="team"
                  :isTeamLoading="isTeamLoading"
                  :isTeamError="isTeamError"
                  @refetchTeam="fetchTeamData"
                  :is-for-edit="isForEdit"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="4" v-if="team.trainingData?.curseLevel == 'LIFE'">
                <TeamMasterLife
                  :team="team"
                  :isTeamLoading="isTeamLoading"
                  :isTeamError="isTeamError"
                  @refetchTeam="fetchTeamData"
                  :is-for-edit="isForEdit"
                />
              </v-tabs-window-item>
            </v-tabs-window>
            <div class="tw:p-4 tw:bg-gray-50" v-if="isForEdit && checkPermission(PermissionEnum.UPDATE_TEAMS)">
              <v-btn
                v-if="team.trainingData?.curseLevel !== 'LIFE_GRADUATE'"
                color="primary"
                variant="flat"
                size="large"
                class="tw:w-full tw:py-3 tw:text-lg tw:rounded-xl tw:shadow-md"
                @click="onPromoteTeam"
              >
                🚀 Promover Equipo
              </v-btn>
              <v-btn
                v-else
                disabled
                color="secondary"
                variant="flat"
                size="large"
                class="tw:w-full tw:py-3 tw:text-lg tw:rounded-xl tw:shadow-md"
              >
                El equipo ya se encuentra graduado.
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </VCol>
    </v-row>
  </div>
  <AddMembersTeam :model-value="showAddMembersDialog" @cancel="showAddMembersDialog = false" @save="saveAddedMembers" :team="team" />
</template>

<style scoped></style>
