import { api } from '@/api/axios';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardFocus } from '@/models/DashboardFocus';

const fetchFocusReport = async (id: string): Promise<DashboardFocus> => {
  const { data } = await api.get('/trainer/view/focus/' + id);
  return data;
};

const useFocusReport = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchFocusReport(id),
    queryKey: ['focus-report', id],
    initialData: {} as DashboardFocus,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useFocusReport;
