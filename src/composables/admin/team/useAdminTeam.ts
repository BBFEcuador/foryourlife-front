import { api } from '@/api/axios';
import type { Team } from '@/models/Participants';
import type { TeamLifePromotionRequest, TeamYourPromotionRequest } from '@/models/Team';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const team = ref<Team>({} as Team);
const promotionYourRequest = ref<TeamYourPromotionRequest>({} as TeamYourPromotionRequest);
const promotionLifeRequest = ref<TeamLifePromotionRequest>({} as TeamLifePromotionRequest);
const fetchTeam = async (id: string): Promise<Team> => {
  const { data } = await api.get(`/teams/` + id);
  return data;
};

const useAdminTeam = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id)
  });
  watch(data, () => {
    if (data.value) {
      team.value = JSON.parse(JSON.stringify(data.value));
      promotionYourRequest.value = {
        id: team.value.id,
        staffs: team.value.staffs,
        trainer: team.value.trainer.id,
        users: team.value.users
      };
      promotionLifeRequest.value = {
        id: team.value.id,
        masterLife: team.value.masterLife,
        trainer: team.value.trainer.id,
        users: team.value.users
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
