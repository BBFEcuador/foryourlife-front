import { api } from '@/api/axios';
import type { Trainers } from '@/models/Trainers';
import { useMutation } from '@tanstack/vue-query';

const saveTrainer = async (trainer: Trainers): Promise<any> => {
  const { data } = await api.post('/trainer', trainer);
  return data;
};

const useTrainerMutations = () => {
  const saveTrainerMutations = useMutation({ mutationFn: saveTrainer });

  return {
    saveTrainerMutations
  };
};

export default useTrainerMutations;
