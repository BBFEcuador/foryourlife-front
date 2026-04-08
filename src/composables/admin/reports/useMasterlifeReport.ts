import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardLife } from '@/models/DashboardLife';

const fetchMasterLifeReport = async (id: string): Promise<DashboardLife[]> => {
  const { data } = await api.get('/trainer/view/life/' + id);
  return data;
};

const useMasterLifeReport = (id: string) => {
    const { data, error, isError, isFetching, refetch } = useQuery({
    queryFn: () => fetchMasterLifeReport(id),
    queryKey: ['master-life-report', id],
    initialData: [],
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, refetch };
};

export default useMasterLifeReport;
