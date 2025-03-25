<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Calendar } from '@/models/Calendar';
import useCalendarMutations from '@/composables/admin/calendar/useCalendarEvents';
import useCalendar from '@/composables/admin/calendar/useCalendar';
import { Icon } from '@iconify/vue';
import { VDateInput } from "vuetify/labs/VDateInput";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import moment from "moment";
import "moment/dist/locale/es.js";
import { useDate } from 'vuetify';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import useCampus from '@/composables/admin/useCampus';
import InputSection from '@/components/forms/InputSection.vue';

const { updateEventMutation, addEventMutation } = useCalendarMutations();
const { data, isFetching, isError, refetch } = useCalendar();
const { campus } = useCampus();

const viewDialog = ref(false);
const addDialog = ref(false);
const currentEvent = ref<Calendar>({} as Calendar);
const selectedDate = ref(new Date());
const search = ref('');

const updatedDate = ref({
  startDate: new Date(),
  numberOfFocus: 1,
  campusId: null,
  firstFocus: null
});

// Table headers
const headers = [
  { title: 'Título', value: 'title'},
  { title: 'Fecha Inicio', value: 'start'},
  { title: 'Fecha Fin', value: 'end'},
  { title: 'Acciones', value: 'actions' }
];

// Format dates for table display
const adapter = useDate();
const formatDate = (date: string | Date) => {
  return moment(date).format('LL');
};



const handleViewEvent = (item: Calendar) => {
  currentEvent.value = item;
  selectedDate.value = new Date(item.start);
  viewDialog.value = true;
};

const handleAddEvent = () => {
  addDialog.value = true;
};

const updateEvent = async () => {
  if (currentEvent.value) {
    updateEventMutation.mutateAsync({
      id: currentEvent.value.id,
      startDate: moment(selectedDate.value).format("YYYY-MM-DD")
    });
  }
};

const onAddCourses = async () => {
  addEventMutation.mutate({
    ...updatedDate.value,
    startDate: moment(updatedDate.value.startDate).format("YYYY-MM-DD")
  });
};

// Watch mutations
watch(updateEventMutation.isSuccess, () => {
  if (updateEventMutation.isSuccess.value) {
    refetch();
    showSuccessToast('Fecha actualizada');
    selectedDate.value = new Date();
    viewDialog.value = false;
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
    addDialog.value = false;
  }
});

watch(addEventMutation.isError, () => {
  if (addEventMutation.isError.value) {
    const error = addEventMutation.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});
</script> 

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <div class="text-h5">Calendario de Programas</div>
        <v-btn color="primary" @click="handleAddEvent">
          <Icon icon="mdi-plus"></Icon>
          Agregar nuevos cursos
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          variant="outlined"
          density="comfortable"
          class="mb-4"
        />

        <v-data-table
          :headers="headers"
          :items="data"
          :search="search"
          :loading="isFetching"
          hover
        >
          <template v-slot:item.start="{ item }">
            {{  formatDate(item.start) }}
          </template>
          
          <template v-slot:item.end="{ item }">
            {{ formatDate(item.end) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              color="primary"
              size="small"
              @click="handleViewEvent(item)"
            >
              <Icon icon="mdi-pencil" />
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- View/Edit Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <Icon icon="mdi-calendar" class="mr-2" color="primary" />
          <span>{{ currentEvent.title }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h4 class="text-h6 mb-2 mt-3">Fecha de inicio</h4>
          <VDateInput v-model="selectedDate" variant="outlined"></VDateInput>
          <h4 class="text-h6 mb-2 mt-3">Fecha Finalización</h4>
          {{ formatDate(currentEvent.end) }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="updateEvent" :loading="updateEventMutation.isPending.value">
            <Icon icon="mdi-content-save" class="mr-2" />
            Actualizar
          </v-btn>
          <v-btn color="error" @click="viewDialog = false">
            <Icon icon="mdi-close" class="mr-2" />
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <Icon icon="mdi-calendar-plus" class="mr-2" color="primary" />
          <span>Crear Nuevo Evento</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <InputSection label="Número de cursos">
            <VNumberInput
              placeholder="##"
              :min="1"
              v-model="updatedDate.numberOfFocus"
              variant="outlined"
            ></VNumberInput>
          </InputSection>
          <InputSection label="Fecha de inicio">
            <VDateInput
              v-model="updatedDate.startDate"
              variant="outlined"
            ></VDateInput>
          </InputSection>
          <InputSection label="Sede">
            <v-select
              placeholder="Seleccione las sedes del usuario"
              :items="campus"
              item-title="city"
              item-value="id"
              v-model="updatedDate.campusId"
              variant="outlined"
            ></v-select>
          </InputSection>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="onAddCourses" :loading="addEventMutation.isPending.value">
            <Icon icon="mdi-content-save" class="mr-2" />
            Guardar
          </v-btn>
          <v-btn color="error" @click="addDialog = false">
            <Icon icon="mdi-close" class="mr-2" />
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
