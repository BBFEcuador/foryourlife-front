import { api } from '@/api/axios';
import type { Participant, ParticipantLevelUpdate, ParticipantUpdate } from '@/models/Participants';
import { useMutation } from '@tanstack/vue-query';

const updateParticipant = async (participants: Partial<ParticipantUpdate>): Promise<any> => {
  const { data } = await api.put(`/participants/update/${participants.id}`, participants);
  return data;
};

const setFocus = async (participants: Partial<ParticipantLevelUpdate>): Promise<any> => {
    const { data } = await api.put(`/participants/setLevel/${participants.id}`, {
        modules: participants.modules,
    } )
    return data;
}
const useParticipantMutations = () => {
  const updateParticipantMutation = useMutation({ mutationFn: updateParticipant });
  const setCourseLevelMutation =useMutation({ mutationFn: setFocus});
  return {
    updateParticipantMutation,
    setCourseLevelMutation,
  };
};

export default useParticipantMutations;
