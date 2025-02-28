import { api } from '@/api/axios';
import type { TrainingData } from '@/models/Training';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const trainings = ref<TrainingData[]>([]);

const fetchTraining = async (): Promise<TrainingData[]> => {
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
