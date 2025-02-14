import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';

const fetchTeams = async (): Promise<any> => {
  const { data } = await api.get('/teams');
  return data;
};

const useAdminTeams = () => {
  const { data, isFetching, isError } = useQuery({ queryFn: fetchTeams, queryKey: ['admin-teams'] });
  return {};
};

export default useAdminTeams;
