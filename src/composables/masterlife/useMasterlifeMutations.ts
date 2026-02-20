import { api } from '@/api/axios';
import type { MasterLife } from '@/models/MasterLife';
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

const availableMasterlife = async (masterLife: { startDate: string; endDate: string }): Promise<MasterLife[]> => {
  const { data } = await api.post('/master-life/available', masterLife);
  return data;
};

const availableMasterlifeMembers = async (masterLife: { startDate: string; endDate: string }): Promise<MasterLife[]> => {
  const { data } = await api.post('/master-life/available', masterLife);
  return data;
};

const useMasterlifeMutations = () => {
  const saveMasterlifeMutations = useMutation({ mutationFn: saveMasterlife });
  const availableMasterlifeMutations = useMutation({ mutationFn: availableMasterlife });
  const availableMasterlifeMembersMutations = useMutation({ mutationFn: availableMasterlifeMembers });
  const changeStatusMutations = useMutation({ mutationFn: changeStatus });
  return {
    saveMasterlifeMutations,
    availableMasterlifeMutations,
    availableMasterlifeMembersMutations,
    changeStatusMutations
  };
};

export default useMasterlifeMutations;
