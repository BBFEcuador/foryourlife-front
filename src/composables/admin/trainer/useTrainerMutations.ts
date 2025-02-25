import { api } from '@/api/axios';
import type { TrainerActive, Trainers } from '@/models/Trainers';
import { useMutation } from '@tanstack/vue-query';

const saveTrainer = async (trainer: Trainers): Promise<any> => {
  const { data } = await api.post('/trainer', trainer);
  return data;
};

const disableTrainer = async (trainer: Partial<TrainerActive>): Promise<any> => {
  const {data} = await api.put('/trainer/disabled', trainer);
  return data;
}
const useTrainerMutations = () => {
  const saveTrainerMutations = useMutation({ mutationFn: saveTrainer });
  const disableTrainerMutation = useMutation({ mutationFn: disableTrainer });
  return {
    saveTrainerMutations,
    disableTrainerMutation,
  };
};

export default useTrainerMutations;
