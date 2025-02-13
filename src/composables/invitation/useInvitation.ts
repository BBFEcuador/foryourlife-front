import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const generateInvitation = async (req: { userId: string; token: string }) => {
  const { data } = await api.post('/api/invitation/create-by-admin/' + req.userId);
  return data;
};

const useInvitation = () => {
  const generateInvitationMutation = useMutation({ mutationFn: generateInvitation });
  return {
    generateInvitationMutation
  };
};

export default useInvitation;
