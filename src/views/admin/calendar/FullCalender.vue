<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';
import LocaleEs from '@fullcalendar/core/locales/es-us';
import type { Calendar } from '@/models/Calendar';
import FullCalendar from '@fullcalendar/vue3';
import useCalendarMutations from '@/composables/admin/calendar/useCalendarEvents';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import { Icon } from '@iconify/vue';

const { deleteEventMutation, updateEventMutation } = useCalendarMutations();

const { calendar, isFetching, isError } = useCalendar();

const updateModalShow = ref(false);
const viewModalShow = ref(false);
const deleteModal = ref(false);
const addModalShow = ref(false);
const currentEvent = ref<Calendar>({} as Calendar);

const handleDateSelect = (selectInfo: any) => {
  addModalShow.value = true;
  currentEvent.value = {
    id: Date.now().toString(),
    title: 'Nuevo Evento',
    start: selectInfo.startStr,
    end: selectInfo.endStr,
    allDay: selectInfo.allDay,
  };
};

import { useDate } from 'vuetify';

// Formatear fechas
const adapter = useDate();
const formatDate = (date: string | Date) => {
  return adapter.format(date, 'YYYY-MM-DD HH:mm');
};

const handleEventClick = (clickInfo: any) => {
  viewModalShow.value = true;
  currentEvent.value = clickInfo.event;
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  locale: LocaleEs,
  editable: true,
  selectable: true,
  events: calendar.value as EventInput[],
  eventClick: handleEventClick,
  select: handleDateSelect,
};

const updateEvent = async () => {
  if (currentEvent.value) {
    await updateEventMutation.mutateAsync(currentEvent.value);
    updateModalShow.value = false;
  }
};

const deleteEvent = async () => {
  if (currentEvent.value) {
    await deleteEventMutation.mutateAsync(currentEvent.value.id);
    updateModalShow.value = false;
  }
};
const selectedDate = ref<string>('');

</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar rounded-md" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <div class="text-subtitle-1 pa-1 text-truncate">{{ arg.event.title }}</div>
        </template>
      </FullCalendar>
    </div>
  </div>

  <v-dialog v-model="viewModalShow" max-width="600px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <Icon icon="mdi-calendar" class="mr-2" color="primary" />
        <span>{{ currentEvent.title }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row class="my-3">
          <v-col cols="12" sm="6">
            <v-label class="font-weight-bold mb-4">Fecha de inicio:</v-label>
            <v-text-field v-model="selectedDate" type="date" label="Selecciona una fecha" outlined>{{ formatDate(currentEvent.start) }}</v-text-field>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-btn color="primary" @click="updateEvent" class="mr-2">
            <Icon icon="mdi-pencil" left />
            Actualizar
          </v-btn>
          <v-btn color="error" @click="deleteEvent">
            <Icon icon="mdi-delete" left />
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>