<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, computed, watch } from 'vue';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { showErrorToast, showSuccessToast } from '@/service/sweetAlert';
import { checkPermission } from '@/service/ability';
import { PermissionEnum } from '@/utils/locales/PermissionEnum';
import useParticipantMutations from '@/composables/admin/participants/useParticipantMutations';
import { toast } from 'vue3-toastify';
import useContactEmergencyParticipant from '@/composables/admin/participants/useContactEmergencyParticipant';
import { useRoute } from 'vue-router';
import type { RequestContactEmergency } from '@/models/ContactEmergencyParticipant';
import useVuelidate from '@vuelidate/core';
import { required, helpers, numeric } from '@vuelidate/validators';
import Swal from 'sweetalert2';
import ParticipantBanner from '@/components/participants/ParticipantBanner.vue';
import useParticipant from '@/composables/admin/participants/useParticipant';

const route = useRoute();
const { updateContactEmergencyMutation, createContactEmergencyMutation, deleteContactMutation } = useParticipantMutations();
const { isParticipantError, isParticipantLoading, participant } = useParticipant(route.params.id.toString());
const { contactEmergency, refetchContactEmergency, isContactEmergencyLoading, isContactEmergencyError } = useContactEmergencyParticipant(
  route.params.id.toString()
);
const search = ref<string>('');
const showContactDialog = ref(false);
const selectedContact = ref<any>(null);
const title = ref<any>(null);

const isLoading = computed(() => isContactEmergencyLoading.value || isParticipantLoading.value);
const isError = computed(() => isContactEmergencyError.value || isParticipantError.value);
const onlyDigits = helpers.withMessage('Solo se permiten números', (v: string) => v === '' || /^\d+$/.test(v));

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Relación', value: 'relationship', sortable: false },
  { title: 'Teléfono', value: 'phone', sortable: false },
  { title: 'Acciones', value: 'actions', sortable: false }
];

const breadcrumbs = ref([
  {
    title: 'Participantes',
    disabled: false,
    href: '/admin/participants'
  }
]);

const reqContact = ref<RequestContactEmergency>({
  name: '',
  relationship: '',
  phone: '',
  userId: ''
} as RequestContactEmergency);

const rules = {
  name: { required: helpers.withMessage('El nombre es obligatorio', required) },
  relationship: { required: helpers.withMessage('La relación es obligatoria', required) },
  phone: {
    required: helpers.withMessage('El teléfono es obligatorio', required),
    onlyDigits,
    numeric,
    len10: helpers.withMessage('El teléfono debe tener 10', (v: string) => v.length === 10)
  }
};

const validator = useVuelidate(rules, reqContact);

const onMedicalSubmit = () => {
  validator.value.$validate();
  if (!validator.value.$error) {
    reqContact.value.userId = route.params.id.toString();
    if (selectedContact.value) {
      updateContactEmergencyMutation.mutate(reqContact.value, {
        onSuccess: () => {
          toast.success('Contacto actualizado exitosamente');
          refetchContactEmergency();
        },
        onError: (error) => {
          const e = error as AxiosError<ErrorApiResponse>;
          showErrorToast(e);
        }
      });
    } else {
      createContactEmergencyMutation.mutate(reqContact.value, {
        onSuccess: () => {
          toast.success('Contacto creado exitosamente');
          refetchContactEmergency();
          validator.value.$reset();
          //setear valores a vacio
          reqContact.value = {
            name: '',
            relationship: '',
            phone: '',
            userId: ''
          } as RequestContactEmergency;
        },
        onError: (error) => {
          const e = error as AxiosError<ErrorApiResponse>;
          showErrorToast(e);
        }
      });
    }
    // showContactDialog.value = false;
  }
};

const onEditContact = (id: string) => {
  selectedContact.value = contactEmergency.value?.find((p: any) => p.id === id) || null;
  showContactDialog.value = true;
  title.value = 'Editar Contacto';
  if (selectedContact.value) {
    reqContact.value = {
      id: selectedContact.value.id,
      name: selectedContact.value.name,
      relationship: selectedContact.value.relationship,
      phone: selectedContact.value.phone,
      userId: selectedContact.value.userId
    };
  }
};

const onCreateContact = () => {
  selectedContact.value = null;
  title.value = 'Agregar Contacto';
  reqContact.value = {
    name: '',
    relationship: '',
    phone: '',
    userId: ''
  } as RequestContactEmergency;
  showContactDialog.value = true;
};

const onDeleteContact = async (id: string) => {
  const result = await Swal.fire({
    title: '¿Eliminar contacto de emergencia?',
    text: `¿Está seguro que desea eliminar a ${contactEmergency.value?.find((p: any) => p.id === id)?.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    deleteContactMutation.mutate(id, {
      onError(e) {
        const error = e as AxiosError<ErrorApiResponse>;
        showErrorToast(error);
      },
      onSuccess(_, v) {
        refetchContactEmergency();
        showSuccessToast('Contacto eliminado exitosamente');
      }
    });
  }
};

// setear validatros al cerrar el dialog
watch(
  showContactDialog,
  (val) => {
    console.log('Dialog closed:', val);
    if (!val) {
      validator.value.$reset();
    }
  },
  { immediate: false }
);

const isSaving = computed(() => {
  return updateContactEmergencyMutation.isPending.value || createContactEmergencyMutation.isPending.value;
});
</script>

<template>
  <BaseBreadcrumb :title="'Contactos'" :breadcrumbs="breadcrumbs" class="tw:mb-6"> </BaseBreadcrumb>
  <div v-if="checkPermission(PermissionEnum.SEE_PARTICIPANTS)">
    <v-col class="tw:grid tw:place-content-center tw:h-96" cols="12" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" size="80" width="8">
        <template #default="slotProps"></template>
      </v-progress-circular>
    </v-col>
    <v-col cols="12" v-else-if="isError">
      <v-card elevation="0" rounded="xl">
        <v-card-text>
          <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
            <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
            <p class="tw:text-lg text-center">Error al cargar el record médico</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <div v-else>
      <ParticipantBanner :participant="participant" />
      <VRow v-auto-animate dense class="mt-5">
        <VCol cols="12">
          <VCard elevation="0" class="bg-surface" rounded="lg">
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="contactEmergency"
                class="modern-table tw:rounded-xl tw:border tw:border-gray-200 tw:overflow-hidden"
                :search="search"
                hover
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
                      v-model="search"
                      placeholder="Buscar Contactos..."
                      variant="outlined"
                      density="compact"
                      class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
                      clearable
                      hide-details
                    >
                      <template #prepend-inner>
                        <div class="tw:relative">
                          <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                          <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                        </div>
                      </template>
                    </VTextField>
                    <v-spacer></v-spacer>
                    <VBtn
                      v-if="checkPermission(PermissionEnum.CREATE_PARTICIPANTS)"
                      variant="elevated"
                      color="primary"
                      class="mr-2"
                      @click="onCreateContact"
                    >
                      <Icon icon="weui:add-friends-filled" class="mr-2" height="20" />
                      Agregar Contacto
                    </VBtn>
                  </v-toolbar>
                </template>

                <template v-slot:item.name="{ item }">
                  <div class="tw:flex tw:items-center tw:gap-3 tw:text-nowrap">
                    <div class="tw:bg-indigo-100 tw:rounded-full tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                      <Icon icon="mdi:account" class="tw:text-gray-600" />
                    </div>
                    <div>
                      <span class="tw:font-medium tw:text-gray-800 group-hover:tw:text-primary tw:transition-colors">{{ item.name }}</span>
                    </div>
                  </div>
                </template>
                <template v-slot:item.relationship="{ item }">
                  <div class="tw:flex tw:items-center tw:gap-2 tw:text-nowrap">
                    <div class="tw:p-2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                      <Icon icon="mdi:family-tree" class="tw:text-gray-600" height="15" />
                    </div>
                    <div>
                      <span>{{ item.relationship }}</span>
                    </div>
                  </div>
                </template>

                <template v-slot:item.phone="{ item }">
                  <v-btn variant="tonal" color="primary" rounded="xl" v-tooltip="'Llamar'" :href="`tel:${item.phone}`">
                    <Icon icon="mdi-phone" />
                    <span class="tw:text-nowrap ml-2">{{ item.phone }}</span>
                  </v-btn>
                </template>

                <template v-slot:no-data>
                  <div class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:text-gray-500">
                    <Icon icon="mdi-alert-circle-outline" height="48" class="tw:mb-4" />
                    <p class="tw:text-lg text-center">No se encontraron contactos de emergencia.</p>
                  </div>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="text-center tw:gap-3 tw:flex tw:justify-center">
                    <VBtn
                      icon
                      class="!tw:bg-blue-50 tw:rounded-xl !tw:shadow-sm hover:!tw:bg-blue-100 tw:transition-all group"
                      variant="text"
                      color="secondary"
                      @click="onEditContact(item.id)"
                      v-tooltip="'Editar'"
                    >
                      <div class="tw:relative">
                        <Icon icon="mdi:pencil" height="22" class="tw:transition-transform group-hover:tw:scale-110" />
                        <div
                          class="tw:absolute tw:inset-0 bg-secondary tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"
                        ></div>
                      </div>
                    </VBtn>
                    <v-btn icon variant="text" color="error" @click="onDeleteContact(item.id)" v-tooltip="'Eliminar'">
                      <div class="tw:relative">
                        <Icon icon="mdi:trash" height="22" class="tw:transition-transform group-hover:tw:scale-110" />
                        <div
                          class="tw:absolute tw:inset-0 bg-error tw:blur-lg tw:rounded-full group-hover:tw:opacity-20 tw:transition-opacity"
                        ></div>
                      </div>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </VCard>
        </VCol>
      </VRow>
    </div>
    <VDialog v-model="showContactDialog" width="500" persistent>
      <VCard class="tw:rounded-xl">
        <VCardTitle class="d-flex flex-shrink-0 align-center text-white bg-primary">
          <Icon icon="mdi:phone" class="mr-2" />
          <span class="text-h6 text-white">{{ title }}</span>
          <v-spacer />
          <v-btn icon variant="text" @click="showContactDialog = false">
            <Icon icon="mdi:close" class="" width="24" />
          </v-btn>
        </VCardTitle>
        <v-divider class="mb-4"></v-divider>
        <VCardText class="tw:p-6">
          <v-row>
            <v-col cols="12">
              <VTextField
                v-model="reqContact.name"
                label="Nombre"
                variant="outlined"
                density="comfortable"
                class="tw:mt-4"
                :error-messages="validator.name.$errors.map((x: any) => x.$message.toString())"
              >
              </VTextField>
            </v-col>
            <v-col cols="12">
              <VTextField
                v-model="reqContact.relationship"
                label="Relación"
                variant="outlined"
                density="comfortable"
                class="tw:mt-4"
                :error-messages="validator.relationship.$errors.map((x: any) => x.$message.toString())"
              >
              </VTextField>
            </v-col>
            <v-col cols="12">
              <VTextField
                v-model="reqContact.phone"
                label="Teléfono"
                variant="outlined"
                density="comfortable"
                class="tw:mt-4"
                placeholder="099 999 9999"
                :maxlength="10"
                inputmode="numeric"
                pattern="\d*"
                :error-messages="validator.phone.$errors.map((x: any) => x.$message.toString())"
                @update:model-value="
                  ($event) => {
                    const digits = ($event ?? '').replace(/\D/g, '').slice(0, 10);
                    if (digits !== reqContact.phone) {
                      reqContact.phone = digits;
                    }
                    validator.phone.$touch();
                  }
                "
              >
              </VTextField>
            </v-col>
          </v-row>
        </VCardText>
        <VCardActions class="tw:flex tw:justify-end">
          <VBtn
            variant="text"
            color="error"
            @click="showContactDialog = false"
            :disabled="isSaving"
            class="!tw:font-normal tw:rounded-lg tw:min-w-[120px]"
          >
            <Icon icon="mdi:close" class="tw:mr-2" />
            Cancelar
          </VBtn>
          <VBtn color="primary" variant="elevated" @click="onMedicalSubmit" class="!tw:font-normal" :loading="isSaving"
            ><Icon icon="mdi-content-save" height="20" class="mr-1" /> Guardar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
