import { api } from '@/api/axios';
import type { MasterLife } from '@/models/MasterLife';
import { useMutation } from '@tanstack/vue-query';

const saveStaff = async (item: MasterLife): Promise<any> => {
  const { data } = await api.post('/master-life/add', item);
  return data;
};

const availableStaff = async (trainer: { startDate: string; endDate: string }): Promise<MasterLife[]> => {
  const { data } = await api.post('/master-life/available', trainer);
  return data;
};

const changeStatus = async (item: MasterLife): Promise<any> => {
  const { data } = await api.put('/master-life/change-status/' + item.id, item);
  return data;
};

const useMasterLifeMutations = () => {
  const saveMasterLifeMutations = useMutation({ mutationFn: saveStaff });
  const availableMasterLifeMutations = useMutation({ mutationFn: availableStaff });
  const changeStatusMutations = useMutation({ mutationFn: changeStatus });
  return {
    saveMasterLifeMutations,
    availableMasterLifeMutations,
    changeStatusMutations
  };
};

export default useMasterLifeMutations;
