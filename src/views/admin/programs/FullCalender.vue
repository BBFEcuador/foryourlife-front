<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarOptions, EventInput } from '@fullcalendar/core';
import LocaleEs from '@fullcalendar/core/locales/es-us';
import type { Calendar } from '@/models/Calendar';
import FullCalendar from '@fullcalendar/vue3';
import useCalendarMutations from '@/composables/admin/calendar/useCalendarEvents';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import { Icon } from '@iconify/vue';
import { VDateInput } from "vuetify/labs/VDateInput";
import moment from "moment";

const { updateEventMutation } = useCalendarMutations();

const { data, isFetching, isError, refetch } = useCalendar();

const updateModalShow = ref(false);
const viewModalShow = ref(false);
const deleteModal = ref(false);
const addModalShow = ref(false);
const currentEvent = ref<Calendar>({} as Calendar);
const updatedDate = ref(new Date())

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
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';

// Formatear fechas
const adapter = useDate();
const formatDate = (date: string | Date) => {
  return adapter.format(date, 'YYYY-MM-DD HH:mm');
};

const handleEventClick = (clickInfo: any) => {
  viewModalShow.value = true;
  currentEvent.value = clickInfo.event;
};

const a: CalendarOptions = {

}

const calendarOption = ref(
  {
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
    events: computed(() => data.value),
    eventClick: handleEventClick,
    select: handleDateSelect,
  }
);


const updateEvent = async () => {
  if (currentEvent.value) {
    updateEventMutation.mutateAsync(
      {
        id: currentEvent.value.id,
        startDate: moment(selectedDate.value).format("YYYY-MM-DD")
      });
  }
};

watch(updateEventMutation.isSuccess, () => {
  if (updateEventMutation.isSuccess.value) {
    refetch()
    showSuccessToast('Fecha actualizada');
    selectedDate.value = new Date()
    viewModalShow.value = false;
  }
});

watch(updateEventMutation.isError, () => {
  if (updateEventMutation.isError.value) {
    const error = updateEventMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error)
  }
});

const selectedDate = ref(new Date());

</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar rounded-md" :options="calendarOption">
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
        <h4 class="text-h4 mb-2 mt-3">Fecha de inicio</h4>
        <VDateInput v-model="selectedDate" outlined></VDateInput>
        <v-card-actions>
          <VSpacer />
          <v-btn color="primary" @click="updateEvent" class="mr-2">
            <Icon icon="mdi-pencil" left />
            Actualizar
          </v-btn>
          <v-btn color="error" @click="viewModalShow = false">
            <Icon icon="" left />
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>