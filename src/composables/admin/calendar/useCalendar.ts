// src/composables/useCalendar.ts
import { ref } from 'vue';
import type { Calendar } from '@/models/Calendar';

// Estado en memoria para los eventos
const events = ref<Calendar[]>([]);

// Función para cargar eventos (simulado)
const loadEvents = async () => {
  return new Promise<Calendar[]>((resolve) => {
    setTimeout(() => {
      resolve(events.value);
    }, 500); // Simula un retraso de 500ms
  });
};

export function useCalendar() {
  return {
    events,
    loadEvents,
  };
}