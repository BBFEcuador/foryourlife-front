import { api } from '@/api/axios';
import type { TrainerActive, Trainers } from '@/models/Trainers';
import { useMutation } from '@tanstack/vue-query';

const saveTrainer = async (trainer: Trainers): Promise<any> => {
  const { data } = await api.post('/trainer', trainer);
  return data;
};

const disableTrainer = async (trainer: Partial<TrainerActive>): Promise<any> => {
  const { data } = await api.put('/trainer/disabled', trainer);
  return data;
};

const availableTrainer = async (trainer: { startDate: string; endDate: string }): Promise<Trainers[]> => {
  const { data } = await api.post('/trainer/available', trainer);
  return data;
};
const useTrainerMutations = () => {
  const saveTrainerMutations = useMutation({ mutationFn: saveTrainer });
  const disableTrainerMutation = useMutation({ mutationFn: disableTrainer });
  const availableTrainerMutation = useMutation({ mutationFn: availableTrainer });
  return {
    saveTrainerMutations,
    disableTrainerMutation,
    availableTrainerMutation
  };
};

export default useTrainerMutations;
