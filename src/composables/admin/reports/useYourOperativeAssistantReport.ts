import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardOperativeAssistantYour } from '@/models/OperativeAssistantYour';

const fetchYourReport = async (id: string): Promise<DashboardOperativeAssistantYour> => {
  const { data } = await api.get('/operative-assistant-dashboard/your/' + id);
  return data;
};

const useYourReport = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchYourReport(id),
    queryKey: ['your-report', id],
    initialData: {} as DashboardOperativeAssistantYour,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useYourReport;
