import { api } from '@/api/axios';
import type { Admin } from '@/models/Admin';
import type { PageableApiResponse } from '@/models/ApiResponse';
import { useQuery } from '@tanstack/vue-query';
import { useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';

const page = ref(0);
const perPage = ref(10);
const search = ref('');
const debouncedSearch = ref('');

const updateDebouncedSearch = useDebounceFn((value: string) => {
  debouncedSearch.value = value;
  page.value = 0;
}, 600);

const fetchUsers = async (): Promise<PageableApiResponse<Admin[]>> => {
  const { data } = await api.get('/admin', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: debouncedSearch.value || undefined
    }
  });
  return data;
};

const useAdminUsers = () => {
  const { data, isFetching, isError, refetch } = useQuery({
    queryFn: fetchUsers, queryKey: ['admin-users', page, perPage, debouncedSearch], initialData: {
      numberOfElements: 0,
    } as PageableApiResponse<Admin[]>
  });

  // Función para actualizar la búsqueda
  const setSearch = (value: string) => {
    search.value = value;
    updateDebouncedSearch(value);
  };

  return {
    users: data,
    page,
    perPage,
    search,
    isError,
    isFetching,
    setSearch,
    refetchUsers: refetch,
  };
};

export default useAdminUsers;
