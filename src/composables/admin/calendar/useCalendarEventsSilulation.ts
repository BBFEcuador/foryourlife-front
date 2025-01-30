// src/composables/useCalendarEvents.ts
import { api } from '@/api/axios';
import type { Calendar } from '@/models/Calendar';
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';

const addEvent = async (event: Calendar): Promise<any> => {
  const { data } = await api.post('/events', event);
  return data;
};

const updateEvent = async (event: Calendar): Promise<any> => {
  const { data } = await api.put(`/events/${event.id}`, event);
  return data;
};

const initialEvents: Calendar[] = [
  {
    id: 1,
    title: 'Evento 1',
    start: '2025-01-01T10:00:00',
    end: '2025-01-01T12:00:00',
    allDay: false
  },
  {
    id: 2,
    title: 'Evento 2',
    start: '2025-01-15T14:00:00',
    end: '2025-01-14T16:00:00',
    allDay: false
  }
];

//simulao
const events = ref<Calendar[]>(initialEvents);

const fetchEvents = async (): Promise<Calendar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialEvents);
    }, 500);
  });
};
// src/composables/useCalendarEvents.ts
const updateEventDate = async (payload: {
    eventId: number;
    newStart: string;
    newEnd: string;
  }): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { eventId, newStart, newEnd } = payload;
        const eventIndex = events.value.findIndex((e) => e.id === eventId);
        if (eventIndex !== -1) {
          // Actualiza las fechas del evento
          events.value[eventIndex].start = newStart;
          events.value[eventIndex].end = newEnd;
        }
        resolve();
      }, 500); // Simula un retraso de 500ms
    });
  };
const useCalendarMutations = () => {
  const addEventMutation = useMutation({ mutationFn: addEvent });
  const updateEventMutation = useMutation({ mutationFn: updateEvent });
  const fetchEventMutation = useMutation({ mutationFn: fetchEvents });
  const updateEventDateMutation = useMutation({ mutationFn: updateEventDate });
  return {
    addEventMutation,
    updateEventMutation,
    fetchEventMutation,
    updateEventDateMutation,
  };
};

export default useCalendarMutations;
