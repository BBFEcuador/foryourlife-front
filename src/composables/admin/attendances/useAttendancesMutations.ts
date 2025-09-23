import { api } from '@/api/axios';
import type { UpdateDayAttendanceRequest } from '@/models/Attendance';
import { useMutation } from '@tanstack/vue-query';

const updateDayAttendance = async (req: UpdateDayAttendanceRequest) => {
  const { data } = await api.post('/attendance', req);
  return data;
};

const closeAttendance = async (id: string) => {
  const { data } = await api.post('/attendance/close-attendance/' + id);
  return data;
};

const useAttendancesMutations = () => {
  const useUpdateDayAttendanceMutation = useMutation({ mutationFn: updateDayAttendance });
  const useCloseAttendanceMutation = useMutation({ mutationFn: closeAttendance });
  return { useUpdateDayAttendanceMutation, useCloseAttendanceMutation };
};

export default useAttendancesMutations;
