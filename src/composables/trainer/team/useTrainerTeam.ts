import { useQuery } from '@tanstack/vue-query';
import type { Team } from '@/models/Participants.ts';
import { trainerApi } from '@/api/trainerAxios.ts';

const fetchTeam = async (id: string): Promise<Team[]> => {
  const { data } = await trainerApi.get(`/teams/trainer/` + id);
  return data;
};

const useTrainerTeams = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id),
    gcTime: 0
  });

  return {
    teams: data,
    isTeamError: isError,
    isTeamLoading: isFetching,
    refetchTeam: refetch
  };
};

export default useTrainerTeams;