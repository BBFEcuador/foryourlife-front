import { api } from '@/api/axios';
import type { Participant, ParticipantLevelUpdate, ParticipantUpdate } from '@/models/Participants';
import { useMutation } from '@tanstack/vue-query';

const updateParticipant = async (participants: Partial<ParticipantUpdate>): Promise<any> => {
  const { data } = await api.put(`/users`, participants);
  return data;
};

const setFocus = async (participants: Partial<ParticipantLevelUpdate>): Promise<any> => {
  const { data } = await api.put(`/client-module/update`, { ...participants.modules, userId: participants });
  return data;
};
const useParticipantMutations = () => {
  const updateParticipantMutation = useMutation({ mutationFn: updateParticipant });
  const setCourseLevelMutation = useMutation({ mutationFn: setFocus });
  return {
    updateParticipantMutation,
    setCourseLevelMutation
  };
};

export default useParticipantMutations;
