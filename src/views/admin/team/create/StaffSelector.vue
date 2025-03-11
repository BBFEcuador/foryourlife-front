<script setup lang="ts">
import StafList from '@/components/staff/stafList.vue';
import useStaffMutations from '@/composables/admin/staff/useStaffMutations';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';
import { showErrorToast } from '@/service/sweetAlert';
import type { AxiosError } from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

interface props {
  team: TeamWriteModel;
}

const props = defineProps<props>();
const emit = defineEmits(['back', 'next']);
const { availableStaffMutations } = useStaffMutations();

const staff = ref<StaffWriteModel[]>([]);
onBeforeMount(() => {
  availableStaffMutations.mutate({
    endDate: props.team.trainingObj.endDate,
    startDate: props.team.trainingObj.startDate
  });
});
watch(availableStaffMutations.isError, () => {
  if (availableStaffMutations.isError.value) {
    const error = availableStaffMutations.error.value as AxiosError<ErrorApiResponse>;
    showErrorToast(error);
  }
});

watch(availableStaffMutations.isSuccess, () => {
  if (availableStaffMutations.isSuccess.value) {
    const response = availableStaffMutations.data.value;
    if (response) {
      staff.value = response;
    }
  }
});
</script>
<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center mb-4">
      <Icon icon="mdi-account-tie" size="28" class="mr-2" color="primary" />
      <h4 class="text-h4">Selecciona el Staff</h4>
    </div>
    <div v-if="team.staffs.length > 0" class="mb-4">
      <div class="text-subtitle-1 mb-2">Staff Seleccionado:</div>
      <v-chip-group>
        <v-chip v-for="staff in team.staffs" :key="staff.user.id" color="primary" variant="outlined" class="mr-2">
          {{ staff.user?.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <StafList :team="team" :staff="staff" :is-visionariesloading="availableStaffMutations.isPending.value" />
    <v-card-actions class="mt-6">
      <v-btn variant="outlined" @click="emit('back')">
        <Icon icon="mdi-arrow-left" />
        Atrás
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="emit('next')" :disabled="team.staffs.length === 0">
        <Icon icon="mdi-arrow-right" />
        Siguiente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
