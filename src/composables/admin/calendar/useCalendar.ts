import { ref, watch } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';

const fetchCalendar = async (): Promise<Calendar[]> => {
  const { data } = await api.get('/admin/training/calendar-event');
  return data;
};

const useCalendar = () => {
  const { data, isFetching, isError, refetch } = useQuery({ queryFn: fetchCalendar, queryKey: ['trainings-calendar'] });
  return {
    data,
    refetch,
    isFetching,
    isError
  };
};

export default useCalendar;
