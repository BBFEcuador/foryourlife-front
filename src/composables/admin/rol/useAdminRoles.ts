import { api } from '@/api/axios';
import type { Role } from '@/models/Admin';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const roles = ref<Role[]>([]);

const fetchRoles = async (): Promise<Role[]> => {
  const { data } = await api.get('/admin-role');
  return data;
};

const useAdminRoles = () => {
  const { data, isError, isFetching } = useQuery({ queryFn: fetchRoles, queryKey: ['admin-roles'] });

  watch(data, () => {
    if (data.value) {
      roles.value = data.value;
    }
  });

  return {
    roles,
    isRolesError: isError,
    isRolesLoading: isFetching
  };
};

export default useAdminRoles;
