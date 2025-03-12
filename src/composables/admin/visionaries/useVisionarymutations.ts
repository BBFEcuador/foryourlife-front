import { api } from '@/api/axios';
import type { Visionary, VisionaryActive } from '@/models/Visionary';
import { useMutation } from '@tanstack/vue-query';

const saveVisionary = async (item: Visionary): Promise<any> => {
  const { data } = await api.post('/visionary/add', item);
  return data;
};

const availableVisionary = async (trainer: { startDate: string; endDate: string }): Promise<Visionary[]> => {
  const { data } = await api.post('/visionary/visionaries-available', trainer);
  return data;
};

const disableAdmin = async (user: Partial<VisionaryActive>): Promise<any> => {
  const { data } = await api.put('/visionary/disabled', user);
  return data;
}

const useVisionarymutations = () => {
  const saveVisionaryMutations = useMutation({ mutationFn: saveVisionary });
  const availableVisionaryMutations = useMutation({ mutationFn: availableVisionary });
  const disableVisionaryMutations = useMutation({ mutationFn: disableAdmin });

  return {
    saveVisionaryMutations,
    availableVisionaryMutations,
    disableVisionaryMutations
  };
};

export default useVisionarymutations;
