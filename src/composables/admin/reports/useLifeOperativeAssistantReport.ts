import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardOperativeAssistantLife } from '@/models/OperativeAssistantLife';

const fetchLifeReport = async (id: string): Promise<DashboardOperativeAssistantLife[]> => {
  const { data } = await api.get('/operative-assistant-dashboard/life/' + id);
  return data;
};

const useLifeReport = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchLifeReport(id),
    queryKey: ['life-report', id],
    initialData: [] as DashboardOperativeAssistantLife[],
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useLifeReport;
