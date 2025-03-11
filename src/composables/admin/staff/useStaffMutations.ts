import { api } from '@/api/axios';
import type { StaffWriteModel } from '@/models/Staff';
import { useMutation } from '@tanstack/vue-query';

const saveStaff = async (item: StaffWriteModel): Promise<any> => {
  const { data } = await api.post('/staff/add', item);
  return data;
};

const availableStaff = async (trainer: { startDate: string; endDate: string }): Promise<StaffWriteModel[]> => {
  const { data } = await api.post('/staff/staff-available', trainer);
  return data;
};

const useStaffMutations = () => {
  const saveStaffMutations = useMutation({ mutationFn: saveStaff });
  const availableStaffMutations = useMutation({ mutationFn: availableStaff });
  return {
    saveStaffMutations,
    availableStaffMutations
  };
};

export default useStaffMutations;
