import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const updateAccountPassword = async (req: { password: string; id: string }): Promise<any> => {
  const { data } = await api.put('/admin/pass', req);
  return data;
};
const passwordReset = async (req: { email: string }): Promise<any> => {
  const { data } = await api.post('/auth/password-reset', req);
  return data;
};

const deleteAccount = async (id: number): Promise<any> => {
  const { data } = await api.delete(`/account/delete/${id}`);
  return data;
};
const companyUnsubscribe = async (id: number): Promise<any> => {
  const { data } = await api.delete(`/users/delete/${id}`);
  return data;
};

const useAccountUserMutation = () => {
  const deleteAccountMutation = useMutation({ mutationFn: deleteAccount });
  const updateAccountPasswordMutation = useMutation({
    mutationFn: updateAccountPassword
  });
  const companyUnsubscribeMutation = useMutation({
    mutationFn: companyUnsubscribe
  });
  const passwordResetMutation = useMutation({
    mutationFn: passwordReset
  });
  return {
    deleteAccountMutation,
    companyUnsubscribeMutation,
    updateAccountPasswordMutation,
    passwordResetMutation
  };
};

export default useAccountUserMutation;
