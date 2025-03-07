import { api } from '@/api/axios';
import type { TrainingData } from '@/models/Training';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const trainings = ref<TrainingData[]>([]);
const lvl = ref('FOCUS');

const fetchByLvl = async (): Promise<TrainingData[]> => {
  const { data } = await api.get('/admin/training/filter/' + lvl.value);
  return data;
};

const useTrainingsByLvl = () => {
  const { data, isFetching, isError } = useQuery({ queryKey: ['trainings-by-lvl', lvl], queryFn: fetchByLvl });
  watch(data, () => {
    if (data.value) {
      trainings.value = data.value;
    }
  });

  return {
    trainings,
    isTrainingsLoading: isFetching,
    isTrainingsError: isError,
    lvl
  };
};

export default useTrainingsByLvl;
