import { api } from '@/api/axios';
import type { CallTraining } from '@/models/CallsTraining';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch, type Ref } from 'vue';

const fetchCallsByTraining = async (id: string): Promise<CallTraining[]> => {
  const { data } = await api.get('/call/training/' + id);
  return data;
};

const useCallsByTraining = (trainingId: Ref<string>) => {
  const selectedCallTraining = ref<CallTraining | null>(null);

  const query = useQuery({
    queryKey: ['calls-by-training', trainingId], 
    queryFn: () => fetchCallsByTraining(trainingId.value),
    enabled: () => !!trainingId.value,
    refetchOnWindowFocus: false,
  });

  watch(query.data, (data) => {
    selectedCallTraining.value = data?.[0] ?? null;
  });

  return {
    selectedCallTraining,
    calls: query.data,
    refetchCalls: query.refetch,
    isLoading: query.isFetching,
    isError: query.isError,
  };
};

export default useCallsByTraining;
