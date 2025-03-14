import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const generateInvitation = async (req: { userId: string }) => {
  const { data } = await api.post('/invitation/create-by-admin/' + req.userId);
  return data;
};

const generateInvitationWithQuantity = async (req: { id: string; quantity: string }) => {
  const { data } = await api.post('/invitation/create-by-admin-quantity', req);
  return data;
};

const useInvitation = () => {
  const generateInvitationMutation = useMutation({ mutationFn: generateInvitation });
  const generateInvitationWithQuantityMutation = useMutation({ mutationFn: generateInvitationWithQuantity });
  return {
    generateInvitationMutation,
    generateInvitationWithQuantityMutation
  };
};

export default useInvitation;
