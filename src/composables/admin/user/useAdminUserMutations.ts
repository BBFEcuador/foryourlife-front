import { api } from '@/api/axios';
import type { Admin, UserActive } from '@/models/Admin';
import { useMutation } from '@tanstack/vue-query';

const saveAdmin = async (user: Partial<Admin>): Promise<any> => {
  const { data } = await api.post('/admin', user);
  return data;
};

const disableAdmin = async (user: Partial<UserActive>): Promise<any> => {
  const { data } = await api.put('/admin/disabled', user);
  return data;
}

const changeRole = async (user: {id:string,roleId:string}): Promise<any> => {
  const { data } = await api.put(`/admin/${user.id}/${user.roleId}`, user);
  return data;
} 

const useAdminUserMutations = () => {
  const saveAdminMutation = useMutation({ mutationFn: saveAdmin });
  const disableAdminMutation = useMutation({ mutationFn: disableAdmin });
  const changeRoleMutation = useMutation({ mutationFn: changeRole });
  return {
    saveAdminMutation,
    disableAdminMutation,
    changeRoleMutation,
  };
};


export default useAdminUserMutations;
