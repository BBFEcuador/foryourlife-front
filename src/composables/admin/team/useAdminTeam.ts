import { api } from '@/api/axios';
import type { MasterLife } from '@/models/MasterLife';
import type { Participant, Team } from '@/models/Participants';
import type { TeamLifePromotionRequest, TeamYourPromotionRequest } from '@/models/team';
import type { User } from '@/models/User';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const team = ref<Team>({} as Team);
const promotionYourRequest = ref<TeamYourPromotionRequest>({} as TeamYourPromotionRequest);
const promotionLifeRequest = ref<TeamLifePromotionRequest>({
  users: [] as Participant[],
  masterLife: [] as MasterLife[]
} as TeamLifePromotionRequest);
const fetchTeam = async (id: string): Promise<Team> => {
  const { data } = await api.get(`/teams/` + id);
  return data;
};

const useAdminTeam = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id),
    gcTime: 0
  });
  watch(data, () => {
    if (data.value) {
      team.value = JSON.parse(JSON.stringify(data.value));
      promotionYourRequest.value = {
        id: team.value.id,
        staffs: team.value.staffs,
        trainer: team.value.trainer.id,
        users: [] as Participant[]
      };
      promotionLifeRequest.value = {
        id: team.value.id,
        masterLife: team.value.masterLife as unknown as MasterLife[],
        trainer: team.value.trainer.id,
        users: [] as Participant[],
        name:
          team.value.training?.nextLevel?.courseLevel == 'LIFE'
            ? `${team.value.training?.nextLevel.courseLevel}-${team.value.training.number}`
            : team.value.name
      };
    }
  });

  return {
    team,
    isTeamError: isError,
    isTeamLoading: isFetching,
    refetchTeam: refetch,
    promotionLifeRequest,
    promotionYourRequest
  };
};

export default useAdminTeam;
