<script setup lang="ts">
import { PaymentStatusMeta, StatementStatusMeta, AttendanceStatusMeta } from '@/models/Statements';
import { Icon } from '@iconify/vue';
import { toast } from 'vue3-toastify';
import { ref, watch, toRef } from 'vue';
import type { StatementStatus } from '@/models/Statements';
import type { AxiosError } from 'axios';
import useStatements from '@/composables/admin/statements/useStatements';
import StatementCommentForm from './StatementCommentForm.vue';
import UiParentCard from '../shared/UiParentCard.vue';
import useCommentStatementMutations from '@/composables/admin/statements/useCommentStatementMutations';

const props = defineProps<{
  trainingId: string;
  nameTraining: string;
}>();

const trainingId = toRef(props, 'trainingId');
const { isStatementError, statementsData, refetchStatement, isStatementLoading, page, perPage, search } = useStatements(trainingId);
const { saveCommentStatementMutations } = useCommentStatementMutations();
const debouncedSearch = ref('');
const showCommentForm = ref(false);
const selectStatementId = ref<string>('');
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const headers = [
  { title: 'Staff', value: 'staffName', sortable: true },
  { title: 'Participante', value: 'participantName', sortable: true },
  { title: 'Equipo Enrolador', value: 'enrollmentTeam', sortable: true },
  { title: 'Gafete', value: 'nickname', sortable: true },
  { title: 'Enrolador', value: 'enrollerName', sortable: true },
  { title: 'Asistencia', value: 'attendanceStatus', sortable: true },
  { title: 'YOUR', value: 'yourPaymentStatus', sortable: true },
  { title: 'LIFE', value: 'lifePaymentStatus', sortable: true },
  { title: 'Declaración', value: 'statement.status', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: true }
];

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (data.page) {
    if (data.page != page.value - 1) {
      page.value = data.page - 1;
    }
  }
  if (data.page) {
    if (data.itemsPerPage != perPage.value) {
      if (data.itemsPerPage == -1) {
        perPage.value = statementsData.value.totalElements;
      } else {
        perPage.value = data.itemsPerPage;
      }
    }
  }
};

const onCommentStatement = (statementId: string) => {
  selectStatementId.value = statementId;
  showCommentForm.value = true;
};

const onCommentSubmit = async (payload: any) => {
  const req = {
    id: selectStatementId.value,
    commentRequest: payload
  };
  saveCommentStatementMutations.mutate(req, {
    onSuccess: () => {
      showCommentForm.value = false;
      refetchStatement();
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Error al procesar el commentario');
    }
  });
};
const truncateComment = (text: string, maxLength = 30) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

watch(debouncedSearch, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    search.value = val;
  }, 400);
});
</script>

<template>
  <v-data-table-server
    :headers="headers"
    :search="debouncedSearch"
    :items="statementsData.content"
    :loading="isStatementLoading"
    :items-length="statementsData.totalElements"
    :items-per-page="10"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar
        class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50"
        flat
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="250"
      >
        
        
        <VTextField
          v-model="debouncedSearch"
          placeholder="Buscar..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
          bg-color="white"
        >
          <template #prepend-inner>
            <div class="tw:relative">
              <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
              <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
            </div>
          </template>
          <template #append v-if="debouncedSearch">
            <VBtn
              icon
              variant="text"
              size="small"
              @click="debouncedSearch = ''"
              class="tw:text-gray-400 hover:tw:text-error tw:transition-colors"
            >
              <Icon icon="mdi:close" height="18" />
            </VBtn>
          </template>
        </VTextField>
        <v-spacer></v-spacer>
        <div class="d-flex tw:items-center">
          <Icon icon="mdi-teach" class="mr-2" height="20"/>
          <div class="tw:font-semibold">{{ nameTraining }}</div>
        </div>
      </v-toolbar>
    </template>

    <template #item.staffName="{ item }">
      <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap group">
        <div class="tw:bg-amber-50 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi:account-tie" class="tw:text-amber-600" />
        </div>
        <div>
          <span class="tw:font-semibold text-high-emphasis">{{ item.staffName }}</span>
        </div>
      </div>
    </template>

    <template #item.participantName="{ item }">
      <div class="tw:flex tw:items-center tw:gap-2">
        <span class="tw:font-semibold tw:text-gray-800">{{ item.participantName }}</span>
      </div>
    </template>

    <template #item.enrollmentTeam="{ item }">
      <div v-if="item.enrollmentTeam" class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap group">
        <Icon icon="mdi:account-group" class="tw:text-primary tw:transition-transform group-hover:tw:scale-110" height="20" />
        <div>
          <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{ item.enrollmentTeam }}</span>
        </div>
      </div>
      <div v-else>
        <span class="tw:text-gray-500 italic">Sin equipo</span>
      </div>
    </template>

    <template #item.nickname="{ item }">
      <v-chip size="small" variant="outlined" color="grey-darken-1" class="font-weight-medium">
        <Icon icon="mdi-card-account-details" class="mr-1" height="15" />
        {{ item.nickname || 'sin_alias' }}
      </v-chip>
    </template>

    <template #item.enrollerName="{ item }">
      <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap group">
        <div class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
          <Icon icon="mdi:account" class="tw:text-gray-600" />
        </div>
        <div>
          <span class="tw:font-semibold text-high-emphasis">{{ item.enrollerName }}</span>
        </div>
      </div>
    </template>

    <template #item.attendanceStatus="{ item }">
      <div class="text-center">
        <v-chip
          v-if="item.attendanceStatus"
          :color="AttendanceStatusMeta[item.attendanceStatus]?.color || 'grey'"
          variant="flat"
          size="small"
          class="tw:capitalize tw:font-semibold"
        >
          <Icon :icon="AttendanceStatusMeta[item.attendanceStatus]?.icon" class="mr-1" height="15" />
          {{ AttendanceStatusMeta[item.attendanceStatus]?.label || 'Desconocido' }}
        </v-chip>
        <span v-else class="tw:text-gray-500 italic"> - </span>
      </div>
    </template>
    <template #item.statement.status="{ item }">
      <div class="tw:flex tw:flex-col tw:items-center tw:gap-1">
        <v-chip
          :color="StatementStatusMeta[item.statement.status as StatementStatus]?.color"
          variant="tonal"
          size="small"
          class="tw:capitalize tw:font-semibold"
        >
          <Icon :icon="StatementStatusMeta[item.statement.status as StatementStatus]?.icon" class="mr-1" height="15" />
          {{ StatementStatusMeta[item.statement.status as StatementStatus]?.label }}
        </v-chip>
        <v-tooltip v-if="item.statement?.comment" location="bottom" max-width="300">
          <template #activator="{ props }">
            <div
              v-bind="props"
              class="tw:flex tw:items-center tw:gap-1 tw:text-xs tw:text-gray-500 tw:cursor-pointer hover:tw:text-primary tw:transition-colors mt-2"
            >
              <Icon icon="mdi:comment-text-outline" height="14" />

              <span class="tw:max-w-[120px] tw:truncate">
                {{ truncateComment(item.statement.comment, 20) }}
              </span>
            </div>
          </template>
          <div class="tw:max-w-xs tw:text-sm tw:leading-relaxed">
            {{ item.statement.comment }}
          </div>
        </v-tooltip>
      </div>
    </template>
    <template #item.yourPaymentStatus="{ item }">
      <div class="text-center">
        <v-chip
          :color="PaymentStatusMeta[item.yourPaymentStatus]?.color || 'grey'"
          variant="tonal"
          size="small"
          class="tw:capitalize tw:font-semibold"
        >
          <Icon :icon="PaymentStatusMeta[item.yourPaymentStatus]?.icon" class="mr-1" height="15" />
          {{ PaymentStatusMeta[item.yourPaymentStatus]?.label }}
        </v-chip>
      </div>
    </template>
    <template #item.lifePaymentStatus="{ item }">
      <div class="text-center">
        <v-chip
          :color="PaymentStatusMeta[item.lifePaymentStatus]?.color || 'grey'"
          variant="tonal"
          size="small"
          class="tw:capitalize tw:font-semibold"
        >
          <Icon :icon="PaymentStatusMeta[item.lifePaymentStatus]?.icon" class="mr-1" height="15" />
          {{ PaymentStatusMeta[item.lifePaymentStatus]?.label }}
        </v-chip>
      </div>
    </template>
    <template #item.actions="{ item }">
      <VBtn
        icon
        variant="text"
        color="primary"
        height="38"
        class="!tw:bg-red-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-red-100 tw:transition-all group"
        v-tooltip="'Agregar Comentario'"
        @click="onCommentStatement(item.statement.id)"
        v-if="item.statement.status !== 'CONFIRMED' "
      >
        <div class="tw:relative">
          <Icon icon="mdi:comment" class="tw:transition-transform group-hover:tw:scale-110" />
          <div
            class="tw:absolute tw:inset-0 tw:bg-purple-500 tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"
          ></div>
        </div>
      </VBtn>
    </template>

    <template #loading>
      <v-progress-linear color="primary" indeterminate class="tw:rounded-t-xl"></v-progress-linear>
    </template>
    <template #no-data>
      <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
        <Icon icon="mdi:clipboard-text" height="48" class="tw:mb-4" />
        <p class="tw:text-lg">No se encontraron declaraciones</p>
        <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
      </div>
    </template>
  </v-data-table-server>
  <VDialog v-model="showCommentForm" max-width="500" transition="dialog-bottom-transition" persistent>
    <UiParentCard title="Agregar Comentario" class="!tw:rounded-xl !tw:shadow-xl !tw:border !tw:border-gray-100">
      <template #prepend>
        <Icon icon="mdi:dumbbell-edit" class="tw:text-gray-600" />
      </template>
      <template #action>
        <v-btn elevation="0" variant="plain" icon @click="showCommentForm = false" class="tw:rounded-md"> <Icon icon="mdi:close" /> </v-btn>
      </template>
      <StatementCommentForm
        :isLoading="saveCommentStatementMutations.isPending.value"
        @onsubmit="onCommentSubmit"
        @cancel="showCommentForm = false"
      />
    </UiParentCard>
  </VDialog>
</template>

<style scoped>
.tw\:capitalize {
  text-transform: capitalize !important;
}
.tw\:font-semibold {
  --tw-font-weight: var(--tw-font-weight-semibold) !important /* 600 */;
  font-weight: var(--tw-font-weight-semibold) !important /* 600 */;
}
.v-data-table :deep(th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(td) {
  color: #334155 !important;
  font-size: 0.875rem !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table-footer) {
  background-color: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 1rem 1.5rem !important;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
}

.v-data-table :deep(.v-data-table-header__wrapper) {
  border-bottom: 1px solid #e2e8f0 !important;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-spacing: 0 0.25rem !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr:hover) {
  background-color: #f8fafc !important;
}

.v-data-table :deep(.v-data-table__wrapper tbody tr) {
  transition: all 0.2s ease-in-out !important;
}
</style>
