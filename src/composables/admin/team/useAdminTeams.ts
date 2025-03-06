import { api } from '@/api/axios';
import type { Criteria } from '@/models/Criteria';
import type { Team } from '@/models/Participants';
import type { TeamWriteModel } from '@/models/Team';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const teams = ref<Team[]>([]);
const fetchTeams = async (): Promise<Team[]> => {
  const { data } = await api.get('/teams');
  return data;
};

const fetchMatch = async (criteria: Criteria): Promise<Team[]> => {
  const { data } = await api.post('/teams/match', criteria);
  return data;
};
const useAdminTeams = () => {
  const { data, isFetching, isError, refetch } = useQuery({ queryFn: fetchTeams, queryKey: ['admin-teams'] });
  const criteriaMutations = useMutation({
    mutationFn: fetchMatch,
    onSuccess(data, variables, context) {
      teams.value = data;
    }
  });

  watch(data, () => {
    if (data.value) {
      teams.value = data.value;
    }
  });
  return {
    teamsData: teams,
    data,
    isLoading: isFetching,
    isError,
    criteriaMutations,
    refetchTeams: refetch
  };
};

export default useAdminTeams;
