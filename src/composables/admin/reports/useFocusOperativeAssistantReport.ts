import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardOperativeAssistantFocus } from '@/models/OperativeAssistantFocus';

const fetchFocusReport = async (id: string): Promise<DashboardOperativeAssistantFocus> => {
  const { data } = await api.get('/operative-assistant-dashboard/focus/' + id);
  return data;
};

const useFocusReport = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchFocusReport(id),
    queryKey: ['focus-report', id],
    initialData: {} as DashboardOperativeAssistantFocus,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useFocusReport;
