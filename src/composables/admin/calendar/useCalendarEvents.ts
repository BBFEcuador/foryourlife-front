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

const updateEvent = async (event: Calendar) => {
  try {
    const response = await api.put(`/events/${event.id}`, event);
    const index = events.value.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      events.value[index] = response.data;
    }
  } catch (error) {
    console.error('Error updating event:', error);
  }
};

const deleteEvent = async (eventId: number) => {
  try {
    await api.delete(`/events/${eventId}`);
    events.value = events.value.filter((e) => e.id !== eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

const useCalendarMutations = () => {
    const addEventMutation = useMutation({mutationFn: addEvent})
    const updateEventMutation = useMutation({mutationFn: updateEvent })
    const deleteEventMutation = useMutation({mutationFn: deleteEvent})
    return {
        addEventMutation,
        updateEventMutation,
        deleteEventMutation
    };
};
export default useCalendarMutations;
