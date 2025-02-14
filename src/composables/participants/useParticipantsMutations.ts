import { api } from '@/api/axios';
import type { Participant } from '@/models/Participants';
import { useMutation } from '@tanstack/vue-query';

const saveParticipants = async (participant: Partial<Participant>): Promise<any> => {
  const { data } = await api.post('/auth/save', participant);
  return data;
};

const useParticipantsMutations = () => {
  const saveParticipantsMutation = useMutation({ mutationFn: saveParticipants });
  return {
    saveParticipantsMutation
  };
};

export default useParticipantsMutations;
