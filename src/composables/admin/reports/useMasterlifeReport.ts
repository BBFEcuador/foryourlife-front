import { api } from '@/api/axios';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { TrainingMasterLifeDashboard } from '@/models/Training';

const fetchMasterLifeReport = async (id: string): Promise<TrainingMasterLifeDashboard[]> => {
  const { data } = await api.get('/trainer/view/life/' + id);
  return data;
};

const useMasterLifeReport = (id: string) => {
    const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: () => fetchMasterLifeReport(id),
    queryKey: ['master-life-report', id],
    initialData: [],
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading, refetch };
};

export default useMasterLifeReport;
