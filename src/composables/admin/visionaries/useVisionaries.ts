import { api } from '@/api/axios';
import type { Visionary } from '@/models/Visionary';
import { useQuery } from '@tanstack/vue-query';

const fetchVisionaries = async (): Promise<Visionary[]> => {
  const { data } = await api.get('/visionary');
  return data;
};

const useVisionaries = () => {
  const { data, isError, isFetching, refetch } = useQuery({ queryKey: ['admin-visonaries'], queryFn: fetchVisionaries });
  return {
    visionariesData: data,
    isVisionariesError: isError,
    isVisionariesloading: isFetching,
    refetchVisionaries: refetch
  };
};

export default useVisionaries;
