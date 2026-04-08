import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import type { DashboardYour } from '@/models/DashboardYour';

const fetchYourReport = async (id: string): Promise<DashboardYour> => {
  const { data } = await api.get('/trainer/view/your/' + id);
  return data;
};

const useYourReport = (id: string) => {
  const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchYourReport(id),
    queryKey: ['your-report', id],
    initialData: {} as DashboardYour,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useYourReport;
