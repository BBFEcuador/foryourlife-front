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

const getByLvl = async (req:{lvl: string, campusId?: string }): Promise<Participant[]> => {
  const { data } = await api.post(`/users/participants-available/${req.lvl}`, req.campusId?{ campusId: req.campusId } : undefined);
  return data;
};

const promotionMasterLife = async (id: string): Promise<Participant[]> => {
  const { data } = await api.post(`/master-life/masterlife-participant/${id}`);
  return data;
};

const promotionVisionary = async (req: { userId: string; role: string }): Promise<Participant> => {
  const { data } = await api.post(`/visionary/visionary-participant`, req);
  return data;
};

const promotionStaff = async (req: { userId: string; role: string }): Promise<Participant> => {
  const { data } = await api.post(`/staff/staff-participant`, req);
  return data;
};

// cambiar contreaseña
const resetPassword = async (user: {id:string,newPassword:string}): Promise<any> => {
  const { data } = await api.put(`/users/reset-password/${user.id}`, user);
  return data;
};

const useParticipantMutations = () => {
  const updateParticipantMutation = useMutation({ mutationFn: updateParticipant });
  const setCourseLevelMutation = useMutation({ mutationFn: setFocus });
  const getByLvlMutation = useMutation({ mutationFn: getByLvl });
  const promotionMasterLifeMutation = useMutation({ mutationFn: promotionMasterLife });
  const promotionVisionaryMutation = useMutation({ mutationFn: promotionVisionary });
  const promotionStaffMutation = useMutation({ mutationFn: promotionStaff });
  const resetPasswordMutation = useMutation({ mutationFn: resetPassword });
  return {
    updateParticipantMutation,
    setCourseLevelMutation,
    getByLvlMutation,
    promotionMasterLifeMutation,
    promotionVisionaryMutation,
    promotionStaffMutation,
    resetPasswordMutation
  };
};

export default useParticipantMutations;
