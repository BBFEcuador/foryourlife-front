import { api } from '@/api/axios';
import type { Visionary } from '@/models/Visionary';
import { useMutation } from '@tanstack/vue-query';

const saveVisionary = async (item: Visionary): Promise<any> => {
  const { data } = await api.post('/visionary/add', item);
  return data;
};

const availableVisionary = async (trainer: { startDate: string; endDate: string }): Promise<Visionary[]> => {
  const { data } = await api.post('/staff/staff-available', trainer);
  return data;
};

const useVisionarymutations = () => {
  const saveVisionaryMutations = useMutation({ mutationFn: saveVisionary });
  const availableVisionaryMutations = useMutation({ mutationFn: availableVisionary });
  return {
    saveVisionaryMutations,
    availableVisionaryMutations
  };
};
export default useVisionarymutations;
