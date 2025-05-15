import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Criteria } from '@/models/Criteria';
import type { Participant } from '@/models/Participants';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchParticipants = async (): Promise<PageableApiResponse<Participant[]>> => {
  const { data } = await api.get('/users', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value
    }
  });
  return data;
};

const fetchMatch = async (criteria: Criteria): Promise<Participant[]> => {
  const { data } = await api.post('/users/match', criteria);
  return data;
};

const useParticipants = () => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: fetchParticipants,
    queryKey: ['participants', page, perPage, search],
    initialData: {
      numberOfElements: 0
    } as PageableApiResponse<Participant[]>
  });
  const criteriaMutations = useMutation({
    mutationFn: fetchMatch
  });

  return {
    participants: data,
    isParticipantsError: isError,
    isParticipantsLoading: isFetching,
    criteriaMutations,
    refetchParticipants: refetch,
    page,
    perPage,
    search
  };
};
export default useParticipants;
