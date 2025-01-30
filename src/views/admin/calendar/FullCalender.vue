<!-- <script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import useCalendarMutations from '@/composables/admin/calendar/useCalendarEventsSilulation';
import type { Calendar } from '@/models/Calendar';

// Composable para manejar mutaciones de eventos
const { addEventMutation, updateEventMutation, fetchEventMutation, updateEventDateMutation } = useCalendarMutations();

// Estado del componente
const updateModalShow = ref(false);
const AddModal = ref(false);
const currentEvent = ref<Calendar | null>(null);

// Configuración de FullCalendar


// Maneja la selección de una fecha para agregar un evento
const handleDateSelect = (selectInfo: any) => {
  AddModal.value = true;
  currentEvent.value = {
    id: Date.now(), // Genera un ID temporal
    title: 'Nuevo Evento',
    start: selectInfo.startStr,
    end: selectInfo.endStr,
    allDay: selectInfo.allDay,
  };
};

// Maneja el clic en un evento existente para editarlo
const handleEventClick = (clickInfo: any) => {
  updateModalShow.value = true;
  currentEvent.value = clickInfo.event;
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  events: [], 
  select: handleDateSelect,
  eventClick: handleEventClick,
};
const saveEvent = async () => {
  if (currentEvent.value) {
    await addEventMutation.mutateAsync(currentEvent.value);
    AddModal.value = false;
  }
};


const updateEvent = async () => {
  if (currentEvent.value) {
    await updateEventMutation.mutateAsync(currentEvent.value);
    updateModalShow.value = false;
  }
};
</script> -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import useCalendarEvents from '@/composables/admin/calendar/useCalendarEventsSilulation';
import type { Calendar } from '@/models/Calendar';

// Composable para manejar eventos
const { fetchEventMutation, updateEventDateMutation } = useCalendarEvents();

// Estado del componente
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  events: events.value, // Usa los eventos cargados dinámicamente
};

// Cargar eventos al montar el componente
onMounted(async () => {
  const loadedEvents = await fetchEvents();
  events.value = loadedEvents;
});

// Función para actualizar la fecha del primer evento
const updateFirstEventDate = async () => {
  if (events.value.length > 0) {
    const firstEvent = events.value[0];
    await updateEventDateMutation.mutateAsync({
      eventId: firstEvent.id,
      newStart: '2023-10-20T10:00:00',
      newEnd: '2023-10-20T12:00:00',
    });
    console.log('Fecha del primer evento actualizada:', firstEvent);
  }
};
</script>
<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <!-- Calendario -->
      <FullCalendar class="demo-app-calendar rounded-md" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <div class="text-subtitle-1 pa-1 text-truncate">{{ arg.event.title }}</div>
        </template>
      </FullCalendar>

      <!-- Botón para actualizar la fecha de un evento -->
      <v-btn
        color="primary"
        @click="updateFirstEventDate"
        :loading="updateEventDateMutation.isPending.value"
      >
        Actualizar Fecha del Primer Evento
      </v-btn>
    </div>
  </div>
</template>

