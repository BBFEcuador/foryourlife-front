import { userApi } from '@/api/userAxios';
import { useMutation } from '@tanstack/vue-query';

const generateInvitationWithQuantityUser = async (req: { id: string; quantity: string }) => {
  const { data } = await userApi.post('/invitation/create-by-user-quantity', req);
  return data;
};

const useUserInvitationMutations = () => {
  const generateInvitationWithQuantityUserMutation = useMutation({ mutationFn: generateInvitationWithQuantityUser });
  return {
    generateInvitationWithQuantityUserMutation
  };
};

export default useUserInvitationMutations;
