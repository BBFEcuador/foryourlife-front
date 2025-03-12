import { api } from '@/api/axios';
import type { Visionary, VisionaryActive } from '@/models/Visionary';
import { useMutation } from '@tanstack/vue-query';

const saveVisionary = async (item: Visionary): Promise<any> => {
  const { data } = await api.post('/visionary/add', item);
  return data;
};

const changeStatus = async (item: Visionary): Promise<any> => {
  const { data } = await api.put('/visionary/change-status/' + item.id, item);
  return data;
};

const availableVisionary = async (trainer: { startDate: string; endDate: string }): Promise<Visionary[]> => {
  const { data } = await api.post('/visionary/visionaries-available', trainer);
  return data;
};

const useVisionarymutations = () => {
  const saveVisionaryMutations = useMutation({ mutationFn: saveVisionary });
  const availableVisionaryMutations = useMutation({ mutationFn: availableVisionary });
  const changeStatusMutations = useMutation({ mutationFn: changeStatus });
  return {
    saveVisionaryMutations,
    availableVisionaryMutations,
    changeStatusMutations
  };
};

export default useVisionarymutations;
