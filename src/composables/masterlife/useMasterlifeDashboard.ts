import { trainerApi } from '@/api/trainerAxios.ts';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { TrainingMasterLifeDashboard } from '@/models/Training';

const fetchMasterLifeDashboard = async (id: string): Promise<TrainingMasterLifeDashboard[]> => {
  const { data } = await trainerApi.get('/trainer/view/life/' + id);
  return data;
};

const useMasterLifeDashboard = (id: string) => {
    const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: () => fetchMasterLifeDashboard(id),
    queryKey: ['master-life-dashboard', id],
    initialData: [],
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading, refetch };
};

export default useMasterLifeDashboard;
