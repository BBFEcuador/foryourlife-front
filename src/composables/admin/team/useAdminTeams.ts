import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Criteria } from '@/models/Criteria';
import type { Team } from '@/models/Participants';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchTeams = async (): Promise<PageableApiResponse<Team[]>> => {
  const { data } = await api.get('/teams', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const fetchMatch = async (criteria: Criteria): Promise<Team[]> => {
  const { data } = await api.post('/teams/match', criteria);
  return data;
};
const useAdminTeams = () => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryFn: fetchTeams,
    queryKey: ['admin-teams', page, perPage, search],
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<Team[]>
  });
  const criteriaMutations = useMutation({
    mutationFn: fetchMatch
  });

  return {
    teamsData: data,
    data,
    isLoading: isFetching,
    isError,
    criteriaMutations,
    refetchTeams: refetch,
    page,
    perPage,
    search
  };
};

export default useAdminTeams;
