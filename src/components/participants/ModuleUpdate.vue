<script setup lang="ts">
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import type { Participant } from '@/models/Participants';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { watch, ref } from 'vue';
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';

interface props {
  participant: Participant;
}
const props = defineProps<props>();
const levels = ['FOCUS', 'YOUR', 'LIFE'];
const selectedLevel = ref(props.participant.participantLevel.courseLevel);
const { setCourseLevelMutation, setParticipantLevelMutation } = useParticipantMutations();
const emit = defineEmits(['update-refetch']);

const checkFocus = (type: 'hasFocus' | 'hasYour' | 'hasLife', value: boolean) => {
  if (value) {
    Swal.fire({
      text: `Recuerda que una vez que actives el curso ${type.toUpperCase()} no podrá desactivarse`,
      title: '¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      cancelButtonText: '¡Lo pensaré!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCourseLevelMutation.mutate({
          id: props.participant.id,
          modules: {
            id: props.participant.modules.id,
            hasFocus: type === 'hasFocus' ? value : props.participant.modules.hasFocus,
            hasYour: type === 'hasYour' ? value : props.participant.modules.hasYour,
            hasLife: type === 'hasLife' ? value : props.participant.modules.hasLife
          }
        });
      } else {
        switch (type) {
          case 'hasFocus':
            props.participant.modules.hasFocus = false;
            break;
          case 'hasYour':
            props.participant.modules.hasYour = false;
            break;
          case 'hasLife':
            props.participant.modules.hasLife = false;
            break;
          default:
            break;
        }
      }
    });
  }
};

const onLevelChange = (value: string) => {
  if (value) {
    Swal.fire({
      text: `¿Estas seguro de cambiar al participante al nivel ${value.toUpperCase()}?`,
      title: 'Confirmación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setParticipantLevelMutation.mutate({
          userId: props.participant.id,
          courseLevel: value
        });
      } else {
        selectedLevel.value = props.participant.participantLevel.courseLevel;
      }
    });
  }
};

watch(setCourseLevelMutation.isError, () => {
  if (setCourseLevelMutation.isError.value) {
    (props.participant.modules.hasFocus = false), (props.participant.modules.hasFocus = false);
    props.participant.modules.hasFocus = false;
  }
});
watch(setCourseLevelMutation.isSuccess, () => {
  if (setCourseLevelMutation.isSuccess.value) {
    toast.success('Curso Activado', {
      autoClose: 3000,
      closeButton: true
    });
  }
});

watch(
  () => setParticipantLevelMutation.error.value,
  (error: any) => {
    if (error) {
      selectedLevel.value = props.participant.participantLevel.courseLevel;
      const message = error?.response?.data?.message || error?.message || 'Ocurrió un error';
      toast.error(message, {
        autoClose: 3000,
        closeButton: true
      });
    }
  }
);

watch(setParticipantLevelMutation.isSuccess, () => {
  if (setParticipantLevelMutation.isSuccess.value) {
    emit('update-refetch');
    toast.success('Nivel Actualizado', {
      autoClose: 3000,
      closeButton: true
    });
  }
});
</script>

<template>
  <v-card class="tw:p-5 mb-2" elevation="0">
    <v-card-item>
      <h4 class="text-h4 mb-2 font-weight-bold">Nivel</h4>
      <v-select
        v-model="selectedLevel"
        :items="levels"
        label="Nivel del participante"
        hide-details
        @update:model-value="onLevelChange"
        :loading="setParticipantLevelMutation.isPending.value"
        :disabled="setParticipantLevelMutation.isPending.value"
      ></v-select>
    </v-card-item>
  </v-card>
  <v-card class="tw:p-5" elevation="0">
    <v-card-item>
      <h4 class="text-h4 mb-2 font-weight-bold">Entrenamientos que posee</h4>
      <v-alert color="warning" variant="tonal" class="mb-4">
        <template v-slot:prepend>
          <Icon icon="mdi-alert-outline" height="40" />
        </template>
        <div>¡Aviso! Una vez actives el curso, no podrás volver a desactivarlo.</div>
      </v-alert>
      <v-card-text>
        <div class="mt-3 tw:flex tw:justify-center tw:items-center tw:gap-1">
          <v-label class="font-weight-medium tw:text-lg">Entrenamiento FOCUS</v-label>
        </div>
        <div class="justify-center d-flex align-center">
          <v-label class="mr-3">NO</v-label>
          <v-switch
            v-model="participant.modules.hasFocus"
            base-color="primary"
            :disabled="participant.modules.hasFocus"
            hide-details
            @update:modelValue="(value: boolean | null) => checkFocus('hasFocus', value ?? false)"
            :false-value="false"
            :true-value="true"
          >
          </v-switch>
          <v-label class="ml-3">SÍ</v-label>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="mt-3 tw:flex tw:justify-center tw:items-center tw:gap-1">
          <v-label class="font-weight-medium tw:text-lg">Entrenamiento YOUR</v-label>
        </div>
        <div class="justify-center d-flex align-center">
          <v-label class="mr-3">NO</v-label>
          <v-switch
            v-model="participant.modules.hasYour"
            base-color="primary"
            :disabled="participant.modules.hasYour === true"
            hide-details
            @update:modelValue="(value: boolean | null) => checkFocus('hasYour', value ?? false)"
            :false-value="false"
            :true-value="true"
          >
          </v-switch>
          <v-label class="ml-3">SÍ</v-label>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="mt-3 tw:flex tw:justify-center tw:items-center tw:gap-1">
          <v-label class="font-weight-medium tw:text-lg">Entrenamiento LIFE</v-label>
        </div>
        <div class="justify-center d-flex align-center">
          <v-label class="mr-3">NO</v-label>
          <v-switch
            v-model="participant.modules.hasLife"
            base-color="primary"
            :disabled="participant.modules.hasLife === true"
            hide-details
            @update:modelValue="(value: boolean | null) => checkFocus('hasLife', value ?? false)"
            :false-value="false"
            :true-value="true"
          >
          </v-switch>
          <v-label class="ml-3">SÍ</v-label>
        </div>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>
