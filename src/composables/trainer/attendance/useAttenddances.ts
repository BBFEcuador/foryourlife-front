import { useQuery } from '@tanstack/vue-query';
import type { Attendance } from '@/models/Attendance.ts';
import { api } from '@/api/axios.ts';

const fetchAttendances = async (id: string): Promise<Attendance[]> => {
  const { data } = await api.get('/attendance/training/' + id);
  return data;
};

const useAttendances = (id: string) => {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => fetchAttendances(id),
    gcTime: 0
  });

  return {
    attendance: data,
    isAttendanceError: isError,
    isAttendanceLoading: isFetching,
    refetchAttendance: refetch
  };
};

export default useAttendances;