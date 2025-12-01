import { trainerApi } from '@/api/trainerAxios.ts';
import { userStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/vue-query';
import { computed} from 'vue';
import type { DashboardFocus } from '@/models/DashboardFocus';

const fetchFocusDashboard = async (id: string): Promise<DashboardFocus> => {
  const { data } = await trainerApi.get('/trainer/view/focus/' + id);
  return data;
};

const useFocusDashboard = (id: string) => {
    const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    queryFn: () => fetchFocusDashboard(id),
    queryKey: ['focus-dashboard', id],
    initialData: {} as DashboardFocus,
    enabled: computed(() => !!id)
  });

  return { data, error, isError, isLoading: isFetching, isPending, refetch };
};

export default useFocusDashboard;
