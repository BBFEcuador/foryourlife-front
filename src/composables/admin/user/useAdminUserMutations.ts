import { api } from '@/api/axios';
import type { Admin } from '@/models/Admin';
import { useMutation } from '@tanstack/vue-query';

const saveAdmin = async (user: Partial<Admin>): Promise<any> => {
  const { data } = await api.post('/admin', user);
  return data;
};

const useAdminUserMutations = () => {
  const saveAdminMutation = useMutation({ mutationFn: saveAdmin });
  return {
    saveAdminMutation
  };
};

export default useAdminUserMutations;
