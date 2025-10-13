import { useQuery } from '@tanstack/vue-query';
import type { Team } from '@/models/Participants.ts';
import { api } from '@/api/axios.ts';
import { trainerApi } from '@/api/trainerAxios.ts';

const fetchTeam = async (id: string): Promise<Team> => {
  const { data } = await trainerApi.get(`/teams/` + id);
  return data;
};

const useTrainerTeam = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id),
    gcTime: 0
  });

  return {
    team: data,
    isTeamError: isError,
    isTeamLoading: isFetching,
    refetchTeam: refetch
  };
};

export default useTrainerTeam;