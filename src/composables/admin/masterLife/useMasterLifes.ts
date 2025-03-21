import { useQuery } from '@tanstack/vue-query';
import { api } from '@/api/axios';
import type { MasterLife } from '@/models/MasterLife';

const fetch = async (): Promise<MasterLife[]> => {
  const { data } = await api.get('/master-life');
  return data;
};

const useMasterLifes = () => {
  const { data, isError, isFetching, refetch } = useQuery({ queryFn: fetch, queryKey: ['master-lifes'], initialData: [] });

  return { masterLifeData: data, isMasterLifeError: isError, isMasterLifeLoading: isFetching, refetchMasterLife: refetch };
};

export default useMasterLifes;
