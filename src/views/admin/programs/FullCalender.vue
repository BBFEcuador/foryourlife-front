<script setup lang="ts">
import { ref, onMounted, computed, watch, watchEffect } from 'vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import type { CalendarOptions, EventInput } from '@fullcalendar/core';
import LocaleEs from '@fullcalendar/core/locales/es-us';
import type { Calendar } from '@/models/Calendar';
import FullCalendar from '@fullcalendar/vue3';
import useCalendarMutations from '@/composables/admin/calendar/useCalendarEvents';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import { Icon } from '@iconify/vue';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import moment from 'moment';
import 'moment/dist/locale/es.js';
import { useDate } from 'vuetify';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import useCampus from '@/composables/admin/useCampus';
import InputSection from '@/components/forms/InputSection.vue';
import type { TrainingData } from '@/models/Training';
import type { Team } from '@/models/Participants';
import ViewTeam from '../team/ViewTeam.vue';

const { updateEventMutation, addEventMutation } = useCalendarMutations();

const { trainingsData, startDate, endDate, refetch, perPage, isLoading } = useCalendar(true);
const { campus } = useCampus();
const viewModalShow = ref(false);
const addModalShow = ref(false);
const currentEvent = ref<Calendar>({} as Calendar);
const team = ref<Team>();
const dialog = ref(false);

const updatedDate = ref({
  startDate: new Date(),
  numberOfFocus: 1,
  campusId: null,
  firstFocus: null
});

const handleDateSelect = (selectInfo: any) => {
  addModalShow.value = true;
  currentEvent.value = {
    id: Date.now().toString(),
    title: 'Nuevo Evento',
    start: selectInfo.startStr,
    end: selectInfo.endStr,
    allDay: selectInfo.allDay,
    embedded: {} as TrainingData
  };
};

// Formatear fechas
const adapter = useDate();
const formatDate = (date: string | Date) => {
  return adapter.format(date, 'YYYY-MM-DD HH:mm');
};

const handleEventClick = (clickInfo: any) => {
  const isUpdateOrView = trainingsData.value.content.find((x) => x.id == clickInfo.event.id);
  if (isUpdateOrView?.embedded.originalTeam) {
    team.value = isUpdateOrView.embedded.originalTeam;
    dialog.value = true;
  } else {
    viewModalShow.value = true;
    currentEvent.value = clickInfo.event;
    selectedDate.value = new Date(clickInfo.event.start);
  }
};
const isModalOpen = ref(false);

const a: CalendarOptions = {};

const isRefetchingManually = ref(false);

const handleDatesSet = async (arg: { start: Date; end: Date }) => {
  perPage.value = 20;
  startDate.value = arg.start.toISOString().split('T')[0];
  endDate.value = arg.end.toISOString().split('T')[0];

  await refetch();
};

const calendarOption = computed(() => {
  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'customButton'
    },
    locale: LocaleEs,
    editable: true,
    selectable: true,
    events: trainingsData.value.content,
    eventClick: handleEventClick,
    select: handleDateSelect,
    datesSet: handleDatesSet,
    eventStartEditable: false,
    eventDurationEditable: false,
    customButtons: {
      customButton: {
        text: 'Agregar nuevos entrenamienos',
        click: () => {
          isModalOpen.value = true;
        }
      }
    }
  };
});

const updateEvent = async () => {
  if (currentEvent.value) {
    updateEventMutation.mutateAsync({
      id: currentEvent.value.id,
      startDate: moment(selectedDate.value).format('YYYY-MM-DD')
    });
  }
};

watch(updateEventMutation.isSuccess, () => {
  if (updateEventMutation.isSuccess.value) {
    refetch();
    showSuccessToast('Fecha actualizada');
    selectedDate.value = new Date();
    viewModalShow.value = false;
  }
});

watch(updateEventMutation.isError, () => {
  if (updateEventMutation.isError.value) {
    const error = updateEventMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(addEventMutation.isSuccess, () => {
  if (addEventMutation.isSuccess.value) {
    refetch();
    showSuccessToast('Clases Añadidas con éxito');
    isModalOpen.value = false;
  }
});

watch(addEventMutation.isError, () => {
  if (addEventMutation.isError.value) {
    const error = addEventMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

const selectedDate = ref(new Date());
const formattedEndDate = computed(() => {
  return currentEvent.value.end ? moment(currentEvent.value.end).format('LL') : 'Sin fecha';
});

const onAddCourses = async () => {
  addEventMutation.mutate({ ...updatedDate.value, startDate: moment(updatedDate.value.startDate).format('YYYY-MM-DD') });
};
</script>

<template>
  <div v-if="!isLoading" class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar rounded-md" :options="calendarOption">
        <template v-slot:eventContent="arg">
          <div class="text-subtitle-1 pa-1 text-truncate">{{ arg.event.title }}</div>
        </template>
      </FullCalendar>
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
            <h4 class="text-h4 mb-2 mt-3">Fecha Finalización</h4>
            {{ formattedEndDate }}
            <v-card-actions>
              <VSpacer />
              <v-btn color="primary" @click="updateEvent" class="mr-2">
                <Icon icon="mdi-pencil" left />
                Actualizar
              </v-btn>
              <v-btn color="error" @click="viewModalShow = false">
                <Icon icon="mdi-close" left />
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isModalOpen" max-width="500">
        <v-card>
          <v-card-title class="d-flex align-center">
            <Icon icon="mdi-calendar" class="mr-2" color="primary" />
            <span>Crear Nuevo Evento</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <InputSection label="Número de cursos">
              <VNumberInput placeholder="##" :min="1" v-model="updatedDate.numberOfFocus" variant="outlined"></VNumberInput>
            </InputSection>
            <InputSection label="Fecha de inicio">
              <VDateInput placeholder="" v-model="updatedDate.startDate" variant="outlined"></VDateInput>
            </InputSection>
            <InputSection label="Sede">
              <VSelect
                placeholder="Seleccione las sedes del usuario"
                :items="campus"
                item-title="city"
                item-value="id"
                clearable
                v-model="updatedDate.campusId"
              />
            </InputSection>
            <InputSection label="Primer focus">
              <VNumberInput
                variant="outlined"
                placeholder="Seleccione las sedes del usuario"
                :items="campus"
                item-title="city"
                item-value="id"
                :min="1"
                clearable
                v-model="updatedDate.firstFocus"
              />
            </InputSection>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="isModalOpen = false">
              <Icon icon="mdi-close" left />
              Cancelar</v-btn
            >
            <v-btn color="primary" @click="onAddCourses">
              <Icon icon="mdi-pencil" left />
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
        <v-card color="containerBg">
          <v-toolbar>
            <v-btn icon @click="dialog = false">
              <Icon icon="material-symbols-light:cancel-outline-rounded" />
            </v-btn>
          </v-toolbar>
          <div class="px-8">
            <ViewTeam :team="team" :is-for-edit="false" :is-team-error="false" :is-team-loading="false" v-if="team" />
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
