import { trainerApi } from '@/api/trainerAxios.ts';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardYour } from '@/models/DashboardYour';

const fetchYourDashboard = async (id: string): Promise<DashboardYour> => {
  const { data } = await trainerApi.get('/trainer/view/your/' + id);
  return data;
};

const useYourDashboard = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchYourDashboard(id),
    queryKey: ['your-dashboard', id],
    initialData: {} as DashboardYour,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useYourDashboard;
