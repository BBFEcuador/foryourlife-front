// src/composables/useCalendarEvents.ts
import { ref } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const events = ref<Calendar[]>([]);

const addEvent = async (event: { startDate: string; numberOfFocus: number; campusId: string }) => {
  const data = await api.post('/admin/training/generate', { ...event });
  return data;
};

const updateEvent = async (event: { id: string; startDate: string }) => {
  const { data } = await api.put(`/admin/training/date`, event);
  return data;
};

const useCalendarMutations = () => {
  const addEventMutation = useMutation({ mutationFn: addEvent });
  const updateEventMutation = useMutation({ mutationFn: updateEvent });
  return {
    addEventMutation,
    updateEventMutation
  };
};
export default useCalendarMutations;
