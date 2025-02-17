import { api } from '@/api/axios';
import type { Training } from '@/models/Team';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const trainings = ref<Training[]>([]);

const fetchTraining = async (): Promise<Training[]> => {
  const { data } = await api.get('/admin/training');
  return data;
};

const useTrainings = () => {
  const { data, isFetching, isError } = useQuery({ queryFn: fetchTraining, queryKey: ['admins-trainings'] });

  watch(data, () => {
    if (data.value) {
      trainings.value = data.value;
    }
  });

  return {
    trainings,
    isTrainingsLoading: isFetching,
    isTrainingError: isError
  };
};

export default useTrainings;
