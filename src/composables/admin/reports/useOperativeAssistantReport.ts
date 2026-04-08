import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed, type Ref, type ComputedRef } from 'vue';
import type { DashboardOperativeAssistant } from '@/models/DashboardOperativeAssistant';

const fetchOperativeAssistantReport = async (id: string): Promise<DashboardOperativeAssistant> => {
  const { data } = await api.get('/operative-assistant-dashboard/' + id);
  return data;
};

const useOperativeAssistantReport = (id: Ref<string> | ComputedRef<string>) => {
  const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => {
      if (!id.value) return Promise.resolve(null); // evitar llamada vacía
      return fetchOperativeAssistantReport(id.value);
    },
    queryKey: ['operative-assistant-report', id],
    initialData: {} as DashboardOperativeAssistant | null,
    enabled: computed(() => !!id.value)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useOperativeAssistantReport;
