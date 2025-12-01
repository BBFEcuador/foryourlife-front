import { api } from '@/api/axios';
import type { CallTraining } from '@/models/CallsTraining';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch, type Ref } from 'vue';

const fetchCallsByTraining = async (id: string): Promise<CallTraining[]> => {
  const { data } = await api.get('/call/training/' + id);
  return data;
};

const useCallsByTraining = (trainingId: Ref<string>) => {
  const callsByTraining = ref<CallTraining[]>([]);

  const query = useQuery({
    queryKey: ['calls-by-training', trainingId],
    queryFn: () => fetchCallsByTraining(trainingId.value),
    enabled: false, // ❗ No dispares hasta que yo lo diga
  });

  watch(query.data, () => {
    if (query.data.value) {
      callsByTraining.value = query.data.value;
    }
  });

  return {
    callsByTraining,
    fetchCallsByTraining: query.refetch, // ✔ AHORA ES UNA FUNCIÓN
    isLoading: query.isFetching,
    isError: query.isError,
  };
};

export default useCallsByTraining;