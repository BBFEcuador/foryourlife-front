import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Criteria } from '@/models/Criteria';
import type { Participant } from '@/models/Participants';
import { adminStore } from '@/stores/adminStore';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const useParticipants = () => {
  const page = ref(0);
  const perPage = ref(10);
  const search = ref('');
  const debouncedSearch = ref('');

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  watch(debouncedSearch, (val) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      search.value = val;
    }, 400);
  });

  const fetchParticipants = async (): Promise<PageableApiResponse<Participant[]>> => {
    const params = {
      page: page.value,
      perPage: perPage.value,
      search: search.value,
      campusId: adminStore().selectCampusId
    };

    const { data } = await api.get('/users', { params });
    return data;
  };

  const fetchMatch = async (criteria: Criteria): Promise<Participant[]> => {
    const { data } = await api.post('/users/match', criteria);
    return data;
  };

  const criteriaMutations = useMutation({
    mutationFn: fetchMatch
  });

  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: fetchParticipants,
    queryKey: ['participants', page, perPage, search],
    initialData: {
      totalElements: 0
    } as PageableApiResponse<Participant[]>
  });

  return {
    participants: data,
    isParticipantsError: isError,
    isParticipantsLoading: isFetching,
    criteriaMutations,
    refetchParticipants: refetch,
    page,
    perPage,
    participantSearch: debouncedSearch
  };
};

export default useParticipants;
