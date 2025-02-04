import { api } from '@/api/axios';
import type { Criteria } from '@/models/Criteria';
import type { Participant } from '@/models/Participants';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const participants = ref<Participant[]>([]);

const fetchParticipants = async (): Promise<Participant[]> => {
  const { data } = await api.get('/users');
  return data;
};

const fetchMatch = async (criteria: Criteria): Promise<Participant[]> => {
  const { data } = await api.post('/users/match', criteria);
  return data;
};

const useParticipants = () => {
  const { data, isError, isFetching, refetch } = useQuery({ queryFn: fetchParticipants, queryKey: ['participants'] });
  const criteriaMutations = useMutation({
    mutationFn: fetchMatch,
    onSuccess(data, variables, context) {
      participants.value = data;
    }
  });

  watch(data, () => {
    if (data.value) {
      participants.value = data.value;
    }
  });

  return {
    participants,
    isParticipantsError: isError,
    isParticipantsLoading: isFetching,
    criteriaMutations,
    data,
    refetchParticipants: refetch
  };
};
export default useParticipants;
