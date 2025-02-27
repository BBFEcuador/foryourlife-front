// src/composables/useCalendarEvents.ts
import { ref } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useMutation } from '@tanstack/vue-query';

const events = ref<Calendar[]>([]);

const addEvent = async (event: Calendar) => {
  try {
    const response = await api.post('/events', event);
    events.value.push(response.data);
  } catch (error) {
    console.error('Error adding event:', error);
  }
};

const updateEvent = async (event: { id: string; startDate: string }) => {
  const {data} = await api.put(`/admin/training/date`, event);
  return data
};


const useCalendarMutations = () => {
  const addEventMutation = useMutation({ mutationFn: addEvent });
  const updateEventMutation = useMutation({ mutationFn: updateEvent });
  return {
    addEventMutation,
    updateEventMutation,
  };
};
export default useCalendarMutations;
