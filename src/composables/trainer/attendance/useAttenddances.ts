import type { Attendance } from '@/models/Attendance.ts';
import { api } from '@/api/axios.ts';

const fetchAttendances = async (id: string): Promise<Attendance[]> => {
  const { data } = await api.get('/attendance/training/' + id);
  return data;
};

