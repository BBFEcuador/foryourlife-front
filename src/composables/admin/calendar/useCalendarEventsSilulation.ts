// src/composables/useCalendarEvents.ts
import { ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import type { Calendar } from '@/models/Calendar';

// Simulación de eventos iniciales
// src/composables/useCalendarEvents.ts
const initialEvents: Calendar[] = [
    {
      id: '1', // Cambia esto a string
      title: 'Evento 1',
      start: '2023-10-10T10:00:00',
      end: '2023-10-10T12:00:00',
      allDay: false,
    },
    {
      id: '2', // Cambia esto a string
      title: 'Evento 2',
      start: '2023-10-15T14:00:00',
      end: '2023-10-15T16:00:00',
      allDay: false,
    },
  ];

// Estado en memoria para los eventos
const events = ref<Calendar[]>(initialEvents);

// Función para simular el GET de eventos
const fetchEvents = async (): Promise<Calendar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialEvents); // Devuelve los eventos estáticos después de un retraso simulado
    }, 500); // Simula un retraso de 500ms
  });
};

const updateEventDate = async (payload: {
    eventId: string; // Cambia esto a string
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

// Composable para manejar eventos
export const useCalendarEvents = () => {
  // Mutación para actualizar la fecha de un evento
  const updateEventDateMutation = useMutation({
    mutationFn: updateEventDate,
  });

  return {
    events, // Expone los eventos para que el componente los use
    fetchEvents, // Función para cargar eventos
    updateEventDateMutation, // Mutación para actualizar la fecha de un evento
  };
};