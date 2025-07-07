import { api } from '@/api/axios';
import type { PageableApiResponse } from '@/models/ApiResponse';
import type { Criteria } from '@/models/Criteria';
import type { Participant } from '@/models/Participants';
import { adminStore } from '@/stores/adminStore';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');

const fetchParticipants = async (): Promise<PageableApiResponse<Participant[]>> => {
  const params = {
    page: page.value,
    perPage: perPage.value,
    search: search.value,
    campusId: adminStore().selectCampusId
  }

  const { data } = await api.get('/users', {
    params: params
  });
  return data;
};



const fetchMatch = async (criteria: Criteria): Promise<Participant[]> => {
  const { data } = await api.post('/users/match', criteria);
  return data;
};

const useParticipants = () => {
  const criteriaMutations = useMutation({
    mutationFn: fetchMatch
  });

  const { data, isError, isFetching, refetch } = useQuery({
    queryFn: fetchParticipants,
    queryKey: ['participants', page, perPage, search],
    initialData: {
      numberOfElements: 0
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
    participantSearch: search
  };
};
export default useParticipants;
