import { api } from '@/api/axios';
import type { Participant } from '@/models/Participants';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const participants = ref<Participant[]>([]);

const fetchParticipants = async (): Promise<Participant[]> => {
  const { data } = await api.get('/users');
  return data;
};

const useParticipants = () => {
  const { data, isError, isFetching } = useQuery({ queryFn: fetchParticipants, queryKey: ['participants'] });

  watch(data, () => {
    if (data.value) {
      participants.value = data.value;
    }
  });

  return {
    participants,
    isParticipantsError: isError,
    isParticipantsLoading: isFetching
  };
};
export default useParticipants;
