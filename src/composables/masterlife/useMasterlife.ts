import { api } from '@/api/axios';
import type { Team } from '@/models/Participants';
import { useQuery } from '@tanstack/vue-query';

const fetchMasterlife = async (): Promise<Team[]> => {
  const { data } = await api.get('/masterlife');
  return data;
};

const useMasterlife = () => {
  const { data, isError, isFetching, refetch } = useQuery({ queryKey: ['admin-masterlife'], queryFn: fetchMasterlife });
  return {
    masterlifeData: data,
    isMasterlifeError: isError,
    isMasterlifeloading: isFetching,
    refetchMasterlife: refetch
  };
};

export default useMasterlife;
