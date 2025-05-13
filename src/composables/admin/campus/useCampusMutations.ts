import { api } from '@/api/axios';
import type { Campus } from '@/models/Campus';
import { useMutation } from '@tanstack/vue-query';

const saveCampus = async (campus: Campus): Promise<any> => {
  const { data } = await api.post('/campus/save', campus);
  return data;
};

const useCampusMutations = () => {
  const saveCampusMutations = useMutation({ mutationFn: saveCampus });
  return {
    saveCampusMutations
  };
};

export default useCampusMutations;
