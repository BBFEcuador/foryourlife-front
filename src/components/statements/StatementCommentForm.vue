<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import type { StatementCommentRequest, StatementStatus } from '@/models/Statements';
import { StatementStatusMeta } from '@/models/Statements';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { computed, ref } from 'vue';

interface props {
  isLoading: boolean;
}

const props = defineProps<props>();
const emits = defineEmits(['onsubmit', 'cancel']);

const commentRequest = ref<StatementCommentRequest>({
  comment: '',
  status: '' as StatementStatus
});

const rules = {
  status: {
    required: helpers.withMessage('El estado es requerido', required)
  }
};

const validator = useVuelidate(rules, commentRequest);

validator.value.$reset();

const onCommentSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    emits('onsubmit', commentRequest.value);
  }
};

const statusItems = computed(() =>
  Object.entries(StatementStatusMeta).map(([value, meta]) => ({
    value,
    title: meta.label
  }))
);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <InputSection label="Estado">
        <VSelect
          placeholder="Estado de Declaración"
          v-model="commentRequest.status"
          :error-messages="validator.status.$errors.map((x) => x.$message.toString())"
          :items="statusItems"
          variant="outlined"
          density="compact"
        />
      </InputSection>
    </VCol>
    <VCol cols="12">
      <InputSection label="">
        <label>Comentario <span class="tw:text-sm tw:italic">(Opcional)</span></label>
        <VTextarea placeholder="Comentario para el estado de la declaración" v-model="commentRequest.comment" />
      </InputSection>
    </VCol>

    <VCol cols="12">
      <div class="w-full justify-end tw:flex tw:gap-2">
        <VBtn color="error" variant="elevated" @click="emits('cancel')">
          <Icon icon="mdi:close" class="mr-1" />
          Cancelar
        </VBtn>
        <VBtn color="primary" variant="elevated" @click="onCommentSubmit" :loading="isLoading">
          <Icon icon="material-symbols:save" class="mr-1" />
          Guardar
        </VBtn>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped></style>
