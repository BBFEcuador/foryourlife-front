import { api } from '@/api/axios';
import type { Admin } from '@/models/Admin';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const users = ref<Admin[]>([]);

const fetchUsers = async (): Promise<Admin[]> => {
  const { data } = await api.get('/admin');
  return data;
};

const useAdminUsers = () => {
  const { data, isFetching, isError } = useQuery({ queryFn: fetchUsers, queryKey: ['admin-users'] });

  watch(data, () => {
    if (data.value) {
      users.value = JSON.parse(JSON.stringify(data.value));
    }
  });
  return {
    users,
    isError,
    isFetching
  };
};

export default useAdminUsers;
