import { api } from '@/api/axios';
import type { Promises } from '../../../models/Promises';
import { useQuery } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

const fetchPromises = async (trainingId: String): Promise<Promises[]> => {
  const { data } = await api.get('/promises/training/' + trainingId);
  return data;
};

const usePromises = (id: MaybeRefOrGetter<string | undefined | null>) => {
  const trainingId = computed(() => toValue(id));

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['promises', trainingId],
    queryFn: () => fetchPromises(trainingId.value!),
    gcTime: 0,
    initialData: [],
    enabled: computed(() => !!trainingId.value)
  });

  return {
    promises: data,
    isPromisesError: isError,
    isPromisesLoading: isFetching,
    refetchPromises: refetch
  };
};

export default usePromises;
