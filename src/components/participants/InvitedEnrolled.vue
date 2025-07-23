<script setup lang="ts">
import useUserActiveInvitation from '@/composables/participants/invitation/useUserActiveInvitation';
import { router } from '@/router';

const props = defineProps<{
  token: string;
  id: string;
}>();

const { data, isLoading, isError } = useUserActiveInvitation(props.id);

const navigateToInvitation = (userId: string) => {
  window.location.href = `/admin/participants/edit/${userId}`;
};
</script>
<template>
  <v-progress-circular v-if="isLoading" indeterminate color="primary" size="80" width="8"> </v-progress-circular>

  <v-card v-else-if="data && !isError" density="compact" elevation="0">
    <v-card-item>
      <h4 class="text-h4 font-weight-bold">Invito a</h4>
    </v-card-item>
    <v-card-text>
      <v-label @click="navigateToInvitation(user.userId)" v-for="(user, index) in data.users" :key="index">
        <a class="tw:underline mr-1">{{ user.name }}</a>
        el {{ user.enrolledDate }}
      </v-label>
    </v-card-text>
  </v-card>
</template>
