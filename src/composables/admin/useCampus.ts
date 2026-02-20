import { api } from '@/api/axios';
import type { Campus } from '@/models/Campus';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const campus = ref<Campus[]>([]);

const fetchCampus = async (): Promise<Campus[]> => {
  const { data } = await api.get('/campus');
  return data;
};

const useCampus = () => {
  const { data, isFetching, isError, refetch } = useQuery({ queryKey: ['Campus'], queryFn: fetchCampus, initialData: [] });
  watch(data, () => {
    if (data.value) {
      campus.value = [...data.value];
    }
  });
  return {
    campus,
    isFetching,
    isError,
    refetch,
    campusData: data
  };
};

export default useCampus;
