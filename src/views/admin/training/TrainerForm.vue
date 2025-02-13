<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import type { Trainers } from '@/models/Trainers';
import useVuelidate from '@vuelidate/core';
import { email, required, numeric } from '@vuelidate/validators';

interface props {
  trainer: Trainers;
  isLoading: boolean;
}

const props = defineProps<props>();
const emits = defineEmits(['onsubmit']);

const rules = {
  name: {
    required
  },
  email: {
    required,
    email
  },
  password: {
    required
  },
  phone: {
    required,
    numeric
  }
};

const validator = useVuelidate(rules, props.trainer);

validator.value.$reset();

const onTrainerSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    emits('onsubmit', props.trainer);
  }
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <InputSection label="Nombre">
        <VTextField
          placeholder="Nombre del entrenador"
          v-model="props.trainer.name"
          :error-messages="validator.name.$errors.map((x) => x.$message.toString())"
        />
      </InputSection>
    </VCol>
    <VCol cols="12">
      <InputSection label="Email">
        <VTextField
          placeholder="Email del entrenador"
          v-model="props.trainer.email"
          :error-messages="validator.email.$errors.map((x) => x.$message.toString())"
        />
      </InputSection>
    </VCol>
    <VCol cols="12">
      <InputSection label="Password">
        <VTextField
          placeholder="Password del entrenador"
          v-model="props.trainer.password"
          :error-messages="validator.password.$errors.map((x) => x.$message.toString())"
        />
      </InputSection>
    </VCol>
    <VCol cols="12">
      <InputSection label="Phone">
        <VTextField
          placeholder="Telefono del entrenador"
          v-model="props.trainer.phone"
          :error-messages="validator.phone.$errors.map((x) => x.$message.toString())"
        />
      </InputSection>
    </VCol>
    <VCol cols="12">
      <div class="w-full justify-end">
        <VBtn color="primary" variant="elevated" @click="onTrainerSubmit" :loading="isLoading"> Guardar </VBtn>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped></style>
