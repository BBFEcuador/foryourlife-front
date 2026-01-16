<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import type {Trainers} from '@/models/Trainers';
import {Icon} from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import {email, required, numeric} from '@vuelidate/validators';

interface props {
  trainer: Trainers;
  isLoading: boolean;
}

const props = defineProps<props>();
const emits = defineEmits(['onsubmit', 'cancel']);

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
    <VCol cols="12" v-if="!props.trainer?.id">
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
      <div class="w-full justify-end tw:flex tw:gap-2">
        <VBtn color="error" variant="elevated" @click="emits('cancel')">
          <Icon icon="mdi:close" class="mr-1"/>
          Cancelar
        </VBtn>
        <VBtn color="primary" variant="elevated" @click="onTrainerSubmit" :loading="isLoading">
          <Icon icon="material-symbols:save" class="mr-1"/>
          Guardar
        </VBtn>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped></style>
