import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const generateInvitation = async (req: { userId: string; campusId: string }) => {
  const { data } = await api.post('/invitation/create-by-admin', null, {
    params: {
      userId: req.userId,
      campusId: req.campusId
    }
  });
  return data;
};

const generateInvitationWithQuantity = async (req: { id: string; quantity: string, campusId : string }) => {
  const { data } = await api.post('/invitation/create-by-admin-quantity', req);
  return data;
};

const generateInvitationWithQuantityUser = async (req: { id: string; quantity: string , campusId: string}) => {
  const { data } = await api.post('/invitation/create-by-user-quantity', req);
  return data;
};

const useInvitation = () => {
  const generateInvitationMutation = useMutation({ mutationFn: generateInvitation });
  const generateInvitationWithQuantityMutation = useMutation({ mutationFn: generateInvitationWithQuantity });
  const generateInvitationWithQuantityUserMutation = useMutation({ mutationFn: generateInvitationWithQuantityUser });
  return {
    generateInvitationMutation,
    generateInvitationWithQuantityMutation,
    generateInvitationWithQuantityUserMutation
  };
};

export default useInvitation;
