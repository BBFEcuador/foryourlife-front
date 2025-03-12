import { api } from '@/api/axios';
import type { TrainingData } from '@/models/Training';
import { useMutation } from '@tanstack/vue-query';

const fetchByLvl = async (lvl: string): Promise<TrainingData[]> => {
  const { data } = await api.post('/admin/training/filter/' + lvl);
  return data;
};

const useTrainingsMutation = () => {
  const availableTrainingMutations = useMutation({ mutationFn: fetchByLvl });
  return {
    availableTrainingMutations
  };
};

export default useTrainingsMutation;
