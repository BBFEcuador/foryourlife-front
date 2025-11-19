import { api } from '@/api/axios';
import type { Participant, Team } from '@/models/Participants';
import type { TeamLifePromotionRequest, TeamYourPromotionRequest } from '@/models/Team';
import type { User } from '@/models/User';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const team = ref<Team>({} as Team);
const fetchOrganizationChart = async (id: string)=> {
  const { data } = await api.get(`/organization/training/` + id);
  return data;
};

const useOrganizationalChartByTraining = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['trainingId', id],
    queryFn: () => fetchOrganizationChart(id),
    gcTime: 0
  });
  return {
    data: data,
    isError: isError,
    isLoading: isFetching,
    refetchOrgChart: refetch,
  };
};

export default useOrganizationalChartByTraining;
