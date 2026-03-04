<script setup lang="ts">
import InputSection from '@/components/forms/InputSection.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useParticipantPaymentMutations from '@/composables/admin/payments/useParticipantPayments';
import useProducts from '@/composables/admin/products/useProducts';
import useTrainings from '@/composables/admin/training/useTrainings';
import useCampus from '@/composables/admin/useCampus';
import useInvitationMutation from '@/composables/invitation/useInvitationMutation';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import type { Participant } from '@/models/Participants';
import type { TrainingData } from '@/models/Training';
import { checkPermission } from '@/service/ability';
import { showErrorToast } from '@/service/sweetAlert';
import { adminStore } from '@/stores/adminStore';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { VNumberInput } from 'vuetify/labs/VNumberInput';

const { isParticipantsError, isParticipantsLoading, participants, criteriaMutations, page, perPage, participantSearch, refetchParticipants } = useParticipants();
const { generateInvitationMutation, generateInvitationWithQuantityMutation } = useInvitationMutation();
const { campusData, isError, isFetching, refetch } = useCampus()
const { resetPasswordMutation, generateContractMutation, changeCampusMutation } = useParticipantMutations();
const showPaymentsDialog = ref(false);
const selectedParticipantId = ref('');

const route = useRoute();
const { payments, isPaymentError, isPaymentLoading, refetchPayment } = useParticipantPaymentMutations(selectedParticipantId);
const router = useRouter();
const adminS = adminStore();
const headers = [
  {
    title: 'Nombre',
    value: 'user.name',
    width: '200',
    class: 'tw:text-nowrap'
  },
  {
    title: 'Equipo',
    value: 'team.name',
    width: '150'
  },
  {
    title: 'Nivel',
    value: 'participantLevel.courseLevel',
    width: '150'
  },
  {
    title: 'Documento',
    value: 'profile.dni',
    width: '100'
  },
  {
    title: 'Entrenamiento Original',
    value: 'originalTraining',
    width: '150'
  },
  {
    title: 'Acciones',
    value: 'actions',
    align: 'center' as const,
    width: '100',
    sortable: false
  }
];

const breadcrumbs = ref([
  {
    title: 'Entrenamiento',
    disabled: false,
    href: '#'
  }
]);

const openCreateInvitation = () => {
  showInvitationForm.value = true;
};

const campusId = ref();
const showInvitationForm = ref(false);
const showInvitation = ref(false);
const showInvitationLot = ref(false);
const quantity = ref(1);
const invitationLink = ref('');
const copied = ref(false);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error('Error al copiar el enlace:', err);
  }
};

const handleGenerateInvitation = () => {
  const userId = adminS.user.id;
  if (!campusId.value) {
    return;
  }
  generateInvitationMutation.mutate(
    { userId: userId, campusId: campusId.value },
    {
      onSuccess: (data) => {
        invitationLink.value = `${window.location.origin}/register/${data}`;
        showInvitationForm.value = false;
        showInvitation.value = true;
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
};

const handleGenerateInvitationLot = () => {
  if (!campusId.value) {
    return;
  }
  const userId = adminS.user.id;
  generateInvitationWithQuantityMutation.mutate(
    { id: userId, quantity: quantity.value.toString(), campusId: campusId.value },
    {
      onSuccess: (data) => {
        invitationLink.value = `${window.location.origin}/register/${data}`;
        showInvitationLot.value = false;
        showInvitation.value = true;
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
};

const editParticipant = (item: string) => {
  router.push({ name: 'participants-admin-edit', params: { id: item } });
};

const medicalRecord = (item: string) => {
  router.push({ name: 'participants-admin-medical', params: { id: item } });
};

const contactEmergency = (item: string) => {
  router.push({ name: 'participants-admin-contact-emergency', params: { id: item } });
};

const showChangeCampus = ref(false)
const selectedCampus = ref()
const changeCampus = (item: Participant) => {
  selectedParticipant.value = item;
  showChangeCampus.value = true;
};

const viewPayments = (id: string) => {
  selectedParticipantId.value = id;
  showPaymentsDialog.value = true;
};

const onParticiapntChangeCampus = () => {
  changeCampusMutation.mutate(
    { userId: selectedParticipant.value?.id || '', campusId: selectedCampus.value },
    {
      onSuccess: () => {
        toast.success('Sede cambiada correctamente');
        showChangeCampus.value = false;
        refetchParticipants()
      },
      onError: (error) => {
        const er = error as AxiosError<ErrorApiResponse>;
        showErrorToast(er);
      }
    }
  );
}

const getLevelColor = (level: string) => {
  const colors = {
    INIT: 'primary',
    FOCUS: 'secondary',
    YOUR: 'info',
    LIFE: 'success',
    LIFE_1: 'warning',
    LIFE_2: 'error',
    LIFE_3: 'darkprimary',
    MASTER_LIFE: 'background',
    LIFE_GRADUATE: 'background',
  };
  const l = level as keyof typeof colors;
  return colors[l] || 'gray';
};

const getLevelIcon = (level: string) => {
  const icons = {
    INIT: 'tabler:circle-number-1',
    FOCUS: 'tabler:circle-number-2',
    YOUR: 'tabler:circle-number-3',
    LIFE: 'tabler:circle-number-4',
    LIFE_1: 'tabler:circle-number-5',
    LIFE_2: 'tabler:circle-number-6',
    LIFE_3: 'tabler:circle-number-7',
    MASTER_LIFE: 'eos-icons:master-outlined',
    LIFE_GRADUATE: 'fluent:hat-graduation-sparkle-16-regular'
  };
  const l = level as keyof typeof icons;
  return icons[l] || 'mdi:help-circle';
};

const loadItems = (data: { page: number; itemsPerPage: number; sortBy: string; groupBy: string; search: string }) => {
  if (!isParticipantsLoading.value) {
    if (data.page) {
      if (data.page != page.value - 1) {
        page.value = data.page - 1;
      }
    }

    if (data.page) {
      if (data.itemsPerPage != perPage.value) {
        if (data.itemsPerPage == -1) {
          perPage.value = participants.value.totalElements;
        } else {
          perPage.value = data.itemsPerPage;
        }
      }
    }
  }
};

const showResetPasswordDialog = ref(false);
const selectedParticipant = ref<Participant | null>(null);
const newPassword = ref('');
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const resetPassword = () => {
  if (!selectedParticipant.value) {
    return;
  }

  if (!newPassword.value) {
    toast.error('La nueva contraseña no puede estar vacía');
    return;
  }

  const userId = selectedParticipant.value.id;
  const password = newPassword.value;

  resetPasswordMutation.mutate(
    { id: userId, newPassword: password },
    {
      onSuccess: () => {
        toast.success('La contraseña se ha reseteado');
      },
      onError: (error) => {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || 'Error al resetear la contraseña');
      }
    }
  );

  // Después de resetear la contraseña, cerrar el diálogo y limpiar los campos
  showResetPasswordDialog.value = false;
  selectedParticipant.value = null;
  newPassword.value = '';
};

// limpiar campos dialog constraseña
watch(showResetPasswordDialog, (newVal) => {
  if (!newVal) {
    selectedParticipant.value = null;
    newPassword.value = '';
  }
});

const generateContracts = async () => {
  if (!selectedParticipant.value) return;
  if (selectedProduct.value?.id == null || selectedProduct.value?.id == '') {
    toast.error('Seleccione un producto para generar el contrato');
    return;
  }

  if (selectedTraining.value?.id == null || selectedTraining.value?.id == '') {
    toast.error('Seleccione un entrenamiento para generar el contrato');
    return;
  }

  const request = {
    participantId: selectedParticipant.value.id,
    productId: selectedProduct.value?.id || '',
    trainingId: selectedTraining.value?.id || ''
  };
  try {
    const data = await generateContractMutation.mutateAsync(request);
    const blob = new Blob([new Uint8Array(data)], {
      type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contrato_${new Date().toLocaleDateString('es-EC').replace(/\//g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Contrato generado exitosamente');
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || 'Error al generar contrato');
  } finally {
  }
};

const showContractDialog = ref(false);

const { productsData, isProductsLoading, productSearch, refetchProducts } = useProducts();
const selectedProduct = ref<any>(null);
const handleProductChange = (product: any | null) => {
  selectedProduct.value = product;
};
const searchProduct = (s: string) => {
  productSearch.value = s;
};

const selectedTraining = ref<TrainingData | null>(null);
const trainingId = ref('');
const { trainings, debouncedSearch } = useTrainings();

const handleTrainingChange = (training: TrainingData) => {
  selectedTraining.value = training;
  trainingId.value = training?.id ?? '';
};

const searchTraining = (s: string) => {
  debouncedSearch.value = s;
};

watch(showContractDialog, (newVal) => {
  if (!newVal) {
    selectedParticipant.value = null;
    selectedProduct.value = null;
    selectedTraining.value = null;
  }
});
</script>

<template>
  <BaseBreadcrumb :title="'Participantes'" :breadcrumbs="breadcrumbs" class="tw:mb-6"> </BaseBreadcrumb>
  <div v-if="checkPermission(PermissionEnum.SEE_PARTICIPANTS)">
    <VRow v-auto-animate>
      <VCol cols="12">
        <VCard variant="outlined" elevation="0" class="bg-surface" rounded="lg">
          <v-card-text>
            <VDataTableServer :items="participants.content" :headers="headers" :search="participantSearch"
              :loading="isParticipantsLoading" :loading-text="'Cargando participantes...'"
              :no-data-text="'No se encontraron participantes'" hover class="tw:rounded-xl elevation-0" v-motion
              :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="200"
              :items-length="participants.totalElements" :items-per-page="10" :page="page + 1"
              @update:options="loadItems">
              <template #top>
                <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion
                  :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="250">
                  <div class="tw:flex-1 tw:max-w-md tw:relative">
                    <VTextField v-model="participantSearch" placeholder="Buscar participantes..." variant="outlined"
                      density="comfortable" hide-details class="tw:rounded-lg tw:bg-white/80 backdrop-blur-sm"
                      bg-color="white">
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full">
                          </div>
                        </div>
                      </template>
                      <template #append v-if="participantSearch">
                        <VBtn icon variant="text" size="small" @click="participantSearch = ''"
                          class="tw:text-gray-400 hover:tw:text-error tw:transition-colors">
                          <Icon icon="mdi:close" height="18" />
                        </VBtn>
                      </template>
                    </VTextField>
                  </div>
                  <VSpacer />
                  <VBtn v-if="checkPermission(PermissionEnum.CREATE_PARTICIPANTS)" variant="elevated" color="primary"
                    class="mr-2" @click="openCreateInvitation" :loading="generateInvitationMutation.isPending.value">
                    <Icon icon="weui:add-friends-filled" class="mr-2" height="20" />
                    Invitar Participante
                  </VBtn>
                  <VBtn v-if="checkPermission(PermissionEnum.CREATE_PARTICIPANTS)" variant="elevated" color="primary"
                    @click="showInvitationLot = true" :loading="generateInvitationMutation.isPending.value">
                    <Icon icon="weui:add-friends-filled" class="mr-2" height="20" />
                    Invitar lote
                  </VBtn>
                </v-toolbar>
              </template>
              <template #item.user.name="{ item }">
                <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap">
                  <div
                    class="tw:bg-gray-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                    <Icon icon="mdi:account" class="tw:text-gray-600" />
                  </div>
                  <div
                    class="tw:absolute tw:inset-0 tw:bg-primary tw:blur-lg tw:rounded-full group-hover:tw:opacity-10 tw:transition-opacity">
                  </div>
                  <div>
                    <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{
                      item.user.name }}</span>
                  </div>
                </div>
                {{ item.user.email }}
              </template>

              <template #item.user.email="{ item }">
                <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                  <Icon icon="mdi:email" />
                  <span>{{ item.user.email }}</span>
                </div>
              </template>

              <template #item.team.name="{ item }">
                <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                  <v-chip color="primary">
                    <Icon icon="mdi:account-group" class="mr-2" />
                    <span>{{ item?.team?.name ?? 'No Asignado' }}</span>
                  </v-chip>
                </div>
              </template>

              <template #item.participantLevel.courseLevel="{ item }">
                <div class="tw:text-nowrap tw:flex tw:flex-col tw:gap-1">
                  <VChip :color="item.participantLevel.courseLevel === 'LIFE_GRADUATE' ? undefined : getLevelColor(item.participantLevel.courseLevel)
                    " variant="flat"
                    class="!tw:font-medium tw:min-w-[120px] !tw:justify-center tw:transition-all group-hover:tw:shadow-md group-hover:tw:scale-105"
                    :class="{ 'animated-gradient': item.participantLevel.courseLevel === 'LIFE_GRADUATE' }"
                    size="small">
                    <div class="tw:relative">
                      <Icon :icon="getLevelIcon(item.participantLevel.courseLevel)" height="20"
                        class="mr-2 tw:transition-transform group-hover:tw:scale-110" />
                    </div>
                    <div v-if="item.participantLevel.courseLevel === 'LIFE_GRADUATE'">GRADUADO</div>
                    <div v-else>{{ item.participantLevel.courseLevel }}</div>
                  </VChip>
                  <p class="tw:font-semibold">{{ item.campus.city }}</p>
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-nowrap">
                  <v-menu location="end" transition="slide-y-transition" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <!-- <v-btn color="primary" v-bind="props"> Dropdown </v-btn> -->
                      <VBtn v-if="checkPermission(PermissionEnum.UPDATE_PARTICIPANTS)" v-bind="props" icon
                        variant="text" color="primary" height="40"
                        class="!tw:bg-blue-50 tw:rounded-lg !tw:shadow-sm hover:!tw:bg-blue-100" v-tooltip="'Acciones'">
                        <Icon icon="mdi:dots-vertical" />
                      </VBtn>
                    </template>

                    <v-list>
                      <v-list-item class="point">
                        <v-list-item-title @click="editParticipant(item.id)">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="mdi:pencil" height="20" color="primary" />
                            Editar Participante
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="point">
                        <v-list-item-title @click="
                          showResetPasswordDialog = true;
                        selectedParticipant = item;
                        ">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="mdi:lock-reset" height="20" /> Resetear contraseña
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="point">
                        <v-list-item-title class="point" @click="medicalRecord(item.id)">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="mdi:hospital-building" height="20" color="primary" />
                            Récord médico
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="point">
                        <v-list-item-title @click="contactEmergency(item.id)">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="mdi:phone-alert" height="20" color="primary" />
                            Contactos de emergencia
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="point">
                        <v-list-item-title @click="changeCampus(item)">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="solar:buildings-2-bold" height="20" color="primary" />
                            Cambiar sede
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="point">
                        <v-list-item-title @click="viewPayments(item.id)">
                          <div class="d-flex tw:gap-1">
                            <Icon icon="streamline-ultimate:money-bag-dollar" height="20" color="primary" />
                            Ver cobros
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>

              <template #loading>
                <VProgressLinear color="primary" indeterminate class="tw:rounded-t-xl" />
              </template>

              <template #no-data>
                <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                  <Icon icon="mdi:account-search" height="48" class="tw:mb-4" />
                  <p class="tw:text-lg">No se encontraron participantes</p>
                  <p class="tw:text-sm tw:mt-1">Intenta con otros términos de búsqueda</p>
                </div>
              </template>
            </VDataTableServer>
          </v-card-text>
        </VCard>
      </VCol>
    </VRow>

    <VDialog v-model="showInvitationForm" width="500">
      <VCard class="tw:rounded-xl">
        <VCardTitle class="tw:p-6 tw:pb-0">
          <h3 class="tw:text-xl tw:font-medium">Invitar Participante</h3>
        </VCardTitle>
        <VCardText class="tw:p-6">
          <InputSection label="Campus">
            <VSelect placeholder="Elija el campus" v-model="campusId" :items="adminS.availableCampus" item-title="city"
              item-value="id"></VSelect>
          </InputSection>
        </VCardText>
        <VCardActions class="tw:flex tw:justify-end">
          <VBtn color="primary" variant="elevated" @click="handleGenerateInvitation" class="!tw:font-normal"> Invitar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showInvitation" width="500">
      <VCard class="tw:rounded-xl">
        <VCardTitle class="tw:p-6 tw:pb-0">
          <h3 class="tw:text-xl tw:font-medium">Invitar Participante</h3>
        </VCardTitle>
        <VCardText class="tw:p-6">
          <VTextField v-model="invitationLink" readonly variant="outlined" density="comfortable" hide-details
            class="tw:mb-2">
            <template #append>
              <VBtn color="primary" variant="elevated" @click="copyLink" class="!tw:font-normal">
                {{ copied ? 'Copiado!' : 'Copiar enlace' }}
              </VBtn>
            </template>
          </VTextField>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog v-model="showInvitationLot" width="500">
      <UiParentCard title="Generar invitaciones">
        <InputSection label="Usos">
          <VNumberInput variant="outlined" placeholder="cantidad de usos para este token" v-model="quantity" :min="1" />
        </InputSection>
        <InputSection label="Campus">
          <VSelect placeholder="Elija el campus" v-model="campusId" :items="adminS.availableCampus" item-title="city"
            item-value="id"></VSelect>
        </InputSection>
        <div class="tw:flex tw:justify-end">
          <VBtn color="primary" @click="handleGenerateInvitationLot"
            :loading="generateInvitationWithQuantityMutation.isPending.value">Generar
          </VBtn>
        </div>
      </UiParentCard>
    </VDialog>

    <VDialog v-model="showResetPasswordDialog" width="500">
      <VCard class="tw:rounded-xl">
        <VCardTitle class="tw:p-6 tw:pb-0">
          <h3 class="tw:text-xl tw:font-medium">Resetear Contraseña</h3>
        </VCardTitle>
        <v-divider class="mb-4"></v-divider>
        <VCardText class="tw:p-6">
          <!-- <p>¿Estás seguro de que deseas resetear la contraseña de este participante?</p> -->
          <VTextField v-model="newPassword" label="Nueva Contraseña" :type="showPassword ? 'text' : 'password'"
            variant="outlined" density="comfortable" hide-details class="tw:mt-4">
            <template #append-inner>
              <Icon :icon="!showPassword ? 'weui:eyes-on-outlined' : 'weui:eyes-off-outlined'" height="18"
                class="cursor-pointer" @click="togglePasswordVisibility" />
            </template>
          </VTextField>
        </VCardText>
        <VCardActions class="tw:flex tw:justify-end">
          <VBtn color="primary" variant="elevated" @click="resetPassword" class="!tw:font-normal"> Resetear </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showContractDialog" width="500">
      <VCard class="tw:rounded-xl">
        <VCardTitle class="tw:p-6 tw:pb-0">
          <h3 class="tw:text-xl tw:font-medium">Contrato Participante</h3>
        </VCardTitle>
        <v-divider class="mb-4"></v-divider>
        <VCardText class="tw:p-6">
          <!-- <p>¿Estás seguro de que deseas resetear la contraseña de este participante?</p> -->
          <!-- <label class="mb-2">Listado de Productos</label> -->
          <VCombobox v-model="selectedProduct" :items="productsData.content" item-title="name" item-value="id"
            variant="outlined"
            :placeholder="productsData.totalElements > 0 ? 'Seleccionar Producto' : 'No hay productos disponibles'"
            return-object @update:search="searchProduct" @update:model-value="handleProductChange" hide-details
            class="tw:bg-white mb-4" label="Producto">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="32">
                    <span class="tw:text-white">{{ item.raw.name?.charAt(0) || 'C' }}</span>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </VCombobox>

          <VCombobox v-model="selectedTraining" :items="trainings" item-title="name" item-value="id" variant="outlined"
            :placeholder="trainings.length > 0 ? 'Seleccionar Entrenamiento' : 'No hay entrenamientos disponibles'"
            return-object @update:search="searchTraining" @update:model-value="handleTrainingChange"
            label="Entrenamiento">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="32">
                    <span class="tw:text-white">{{ item.raw.name?.charAt(0) || 'C' }}</span>
                  </v-avatar>
                </template>
                <v-list-item-subtitle>{{ item.raw?.courseLevelDisplay }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </VCombobox>
        </VCardText>
        <VCardActions class="tw:flex tw:justify-end">
          <VBtn color="primary" variant="elevated" @click="generateContracts" class="!tw:font-normal"
            :loading="generateContractMutation.isPending.value">
            Generar Contrato
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VDialog max-width="600" v-model="showChangeCampus">
      <UiParentCard title="Cambiar de sede">
        <VRow>
          <VCol cols="12">
            <p>Estás a punto de cambiar la sede del participante
              <strong>{{ selectedParticipant?.user.name }}</strong> de
              <strong>{{ selectedParticipant?.campus.city }}</strong>.
            </p>
          </VCol>
          <VCol cols="12">
            <InputSection label="Seleccionar sede">
              <VSelect v-model="selectedCampus" :items="campusData.filter(x => x.id != selectedParticipant?.campus.id)"
                item-title="city" item-value="id" placeholder="Elija el campus" :loading="isFetching">
                <template #append>
                  <VBtn icon variant="text" @click="refetch" :loading="isFetching">
                    <Icon icon="mdi:refresh" height="18" />
                  </VBtn>
                </template>
              </VSelect>
            </InputSection>
          </VCol>
          <VCol cols="12">
            <VBtn :disabled="!selectedCampus" color="primary" @click="onParticiapntChangeCampus"
              :loading="changeCampusMutation.isPending.value">
              Cambiar
            </VBtn>
          </VCol>
        </VRow>
      </UiParentCard>
    </VDialog>

    <v-dialog v-model="showPaymentsDialog" max-width="900">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Historial de Cobros</span>
          <v-btn icon="mdi-close" variant="text" @click="showPaymentsDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="isPaymentLoading" class="d-flex justify-center my-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="isPaymentError" class="text-error text-center my-4">
            Error al cargar los cobros.
          </div>
          <div v-else-if="payments && payments.length === 0" class="text-center my-4">
            No hay cobros registrados para este participante.
          </div>
          <v-table v-else>
            <thead>
              <tr>
                <th class="text-left">Fecha</th>
                <th class="text-left">Concepto</th>
                <th class="text-left">Monto Total</th>
                <th class="text-left">Saldo Restante</th>
                <th class="text-left">Estado</th>
                <th class="text-left">Historial Pagos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in payments" :key="payment.id">
                <td>{{ new Date(payment.createdAt).toLocaleDateString() }}</td>
                <td>
                  <div v-for="prod in payment.products" :key="prod.id">
                    {{ prod.name }}
                  </div>
                </td>
                <td>${{ payment.total }}</td>
                <td>${{ payment.remainingBalance }}</td>
                <td>
                  <v-chip
                    :color="payment.status === 'PAID' ? 'success' : payment.status === 'PARTIAL' ? 'warning' : 'error'"
                    size="small">
                    {{ payment.status === 'PAID' ? 'Pagado' : payment.status === 'PARTIAL' ? 'Parcial' : 'Pendiente' }}
                  </v-chip>
                </td>
                <td>
                  <div v-if="payment.paymentshistory && payment.paymentshistory.length > 0">
                    <div v-for="(hist, index) in payment.paymentshistory" :key="index" class="text-caption mb-1">
                      {{ new Date(hist.date).toLocaleDateString() }} - ${{ hist.amount }} ({{ hist.paymentMethod?.type
                      }})
                    </div>
                  </div>
                  <span v-else class="text-caption text-grey">Sin abonos</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showPaymentsDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <v-alert title="Acceso denegado" variant="outlined" border="top" elevation="2" type="warning">
      <template #prepend>
        <Icon color="warning" icon="mdi-alert" height="30" />
      </template>
      No tienes permiso para ver esta sección.
    </v-alert>
  </div>
</template>

<style scoped>
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

.animated-gradient {
  background: linear-gradient(-45deg, #ffa63d, #ff3d77, #338aff, #3cf0c5);
  background-size: 600%;
  animation: anime 12s linear infinite;
  color: rgba(255, 255, 255, 90%) !important;
}

@keyframes anime {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.point {
  cursor: pointer !important;
}

.point:hover {
  background-color: #e6e2eb !important;
  transition: background-color 0.2s ease-in-out !important;
}
</style>
