import { api } from '@/api/axios';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardFinancial } from '@/models/DashboardFinancial';

const fetchFinancialReport = async (id: string): Promise<DashboardFinancial> => {
  const { data } = await api.get('/financial-administrator-dashboard/' + id);
  return data;
};

const useFinancialReport = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchFinancialReport(id),
    queryKey: ['financial-report', id],
    initialData: {} as DashboardFinancial,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useFinancialReport;
