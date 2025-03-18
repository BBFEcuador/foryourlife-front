import { api } from '@/api/axios';
import type { Team } from '@/models/Participants';
import { useMutation } from '@tanstack/vue-query';

const saveMasterlife = async (item: Team): Promise<any> => {
  const { data } = await api.post('/masterlife/add', item);
  return data;
};

const changeStatus = async (item: Team): Promise<any> => {
  const { data } = await api.put('/masterlife/change-status/' + item.id, item);
  return data;
};

const availableMasterlife = async (masterLife: { startDate: string; endDate: string }): Promise<Team[]> => {
  const { data } = await api.post('/masterlife/masterlife-available', masterLife);
  return data;
};

const useMasterlifeMutations = () => {
  const saveMasterlifeMutations = useMutation({ mutationFn: saveMasterlife });
  const availableMasterlifeMutations = useMutation({ mutationFn: availableMasterlife });
  const changeStatusMutations = useMutation({ mutationFn: changeStatus });
  return {
    saveMasterlifeMutations,
    availableMasterlifeMutations,
    changeStatusMutations
  };
};

export default useMasterlifeMutations;
