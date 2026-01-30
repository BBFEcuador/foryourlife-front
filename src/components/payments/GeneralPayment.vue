<script setup lang="ts">
import useDiscounts from '@/composables/admin/discounts/useDiscounts';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAvailableProducts from '@/composables/admin/products/useAvailableProducts';
import type { Campus } from '@/models/Campus';
import type { Participant } from '@/models/Participants';
import { router } from '@/router';
import type { Validation } from '@vuelidate/core';
import Swal from 'sweetalert2';
import { ref, computed, watch } from 'vue';

interface props {
  v$: Validation<{ fullname: string; document: string; phone: string; email: string; address: string }>;
}

const { v$ } = defineProps<props>();

const emit = defineEmits([
  'update:modelValue',
  'update:selected-participant',
  'update:selected-product',
  'update:notes',
  'update:fullname',
  'update:address',
  'update:document',
  'update:phone',
  'update:email',
  'update:selected-discount',
  'update:selected-campus',
  'update:type'
]);

const { participants, participantSearch } = useParticipants();
const { productsData, productSearch } = useAvailableProducts();
const { discountsData } = useDiscounts();

const selectedParticipant = ref<Participant | null>(null);
const selectedProduct = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref<Campus | null>(null);
const notes = ref('');
const fullname = ref('');
const address = ref('');
const document = ref('');
const phone = ref('');
const email = ref('');
const type = ref('N');

function formatPhone(phoneStr: string | undefined): string {
  if (!phoneStr) return '';
  const match = phoneStr.match(/\+593(\d+)/);
  return match ? '0' + match[1] : phoneStr;
}

function assignParticipantFields(participant: Participant | null) {
  fullname.value = participant?.user?.name || '';
  address.value = participant?.profile?.address || '';
  document.value = participant?.profile?.dni || '';
  phone.value = formatPhone(participant?.phone);
  email.value = participant?.email || '';
}

watch(selectedParticipant, (newVal, oldVal) => {
  v$.$reset();
  assignParticipantFields(newVal);
  emit('update:selected-participant', newVal);
  emit('update:fullname', fullname.value);
  emit('update:address', address.value);
  emit('update:document', document.value);
  emit('update:phone', phone.value);
  emit('update:email', email.value);
  selectedCampus.value = newVal?.campus || null;
  emit('update:selected-campus', selectedCampus.value);

  if (
    newVal !== oldVal &&
    (fullname.value !== '' || address.value !== '' || document.value !== '' || phone.value !== '' || email.value !== '')
  ) {
    v$.fullname.$touch();
    v$.address.$touch();
    v$.document.$touch();
    v$.phone.$touch();
    v$.email.$touch();
  }
});

watch(selectedProduct, (newVal) => {
  emit('update:selected-product', newVal);
});

watch(notes, (newVal) => {
  emit('update:notes', newVal);
});

watch(type, (newVal) => {
  emit('update:type', newVal);
});

watch(selectedDiscount, (newVal) => {
  emit('update:selected-discount', newVal);
});

watch(selectedCampus, (newVal) => {
  emit('update:selected-campus', newVal);
});

const participantsList = computed(() => participants?.value?.content || []);
const productsList = computed(() => productsData?.value?.content || []);
const discountsList = computed(() => discountsData?.value?.content || []);

const selectedProductDetails = computed(() => {
  if (!selectedProduct.value) return null;
  const product = selectedProduct.value as any;
  return {
    id: product.id,
    name: product.name,
    code: product.code,
    price: product.basePrice || 0,
    currency: product.currency || 'USD',
    description: product.description,
    programs: product.programs
  };
});

const searchClient = (s: string) => {
  participantSearch.value = s;
};

const handleParticipantChange = (participant: any) => {
  selectedParticipant.value = participant;
};

const handleProductChange = (product: any) => {
  if (product?.programs?.length === 0) {
    Swal.fire({
      text: `Este producto no cuenta con programas asignados`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ca87f',
      cancelButtonColor: '#ff6464',
      confirmButtonText: 'Configurar Productos',
      cancelButtonText: 'Volver'
    }).then(async (params) => {
      if (params.isConfirmed) {
        router.push({ name: 'products-admin' });
      }
    });
    selectedProduct.value = null;
  } else {
    selectedProduct.value = product;
  }
};

const handleDiscountChange = (discount: any) => {
  selectedDiscount.value = discount;
};

const resetTextFields = () => {
  fullname.value = '';
  address.value = '';
  document.value = '';
  phone.value = '';
  email.value = '';
  notes.value = '';
  selectedParticipant.value = null;
  selectedProduct.value = null;
  selectedDiscount.value = null;
  selectedCampus.value = null;
  v$.$reset();
};

defineExpose({ resetTextFields });
</script>
<template>
  <div>
    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Otorgado a</h3>
        <VCombobox
          v-model="selectedParticipant"
          :items="participantsList"
          item-title="user.name"
          item-value="id"
          variant="outlined"
          :placeholder="participantsList.length > 0 ? 'Seleccionar cliente' : 'No hay clientes disponibles'"
          return-object
          @update:search="searchClient"
          @update:model-value="handleParticipantChange"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-avatar color="primary" size="32">
                  <span class="tw:text-white">{{ item.raw?.name?.charAt(0) || 'C' }}</span>
                </v-avatar>
              </template>
              <v-list-item-subtitle>{{ item.raw?.email }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </VCombobox>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Campus</h3>
        <v-select
          v-model="selectedCampus"
          item-title="city"
          item-value="id"
          variant="outlined"
          placeholder="Seleccione un cliente"
          return-object
          disabled
        ></v-select>
      </div>
    </div>

    <!-- Artículos/Servicios -->
    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Artículos/Servicios</h3>
        <VCombobox
          v-model="selectedProduct"
          :items="productsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          placeholder="Buscar producto"
          return-object
          @update:search="productSearch = $event"
          @update:model-value="handleProductChange"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>
                {{ item.raw?.basePrice ? `$${item.raw.basePrice} ${item.raw.currency || 'USD'}` : 'Sinprecio' }} -
                {{ item.raw?.code || 'Sin código' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="item.raw?.description" class="text-caption">
                {{ item.raw.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </VCombobox>
      </div>
      <div>
        <h4 class="tw:text-lg tw:font-semibold pb-2">Descuento</h4>
        <v-select
          v-model="selectedDiscount"
          :items="discountsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          placeholder="Seleccionar descuento"
          return-object
          clearable
          @update:model-value="handleDiscountChange"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-title class="tw:flex tw:items-center tw:gap-2">
                <span
                  >{{ item.raw?.discountValue }}
                  {{ item.raw?.discountType === 'P' ? '%' : item.raw?.discountType === 'E' ? '$' : '' }}</span
                >
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </div>
    </div>
    <div v-if="selectedProductDetails" class="tw:border tw:border-gray-200 tw:rounded-md pa-3 mb-2">
      <div class="tw:flex tw:flex-col tw:gap-4">
        <div class="tw:flex tw:justify-between tw:items-start">
          <div>
            <h3 class="tw:font-medium tw:text-lg">{{ selectedProductDetails.name }}</h3>
            <p v-if="selectedProductDetails.description" class="tw:text-sm tw:text-gray-600">
              Descripción: {{ selectedProductDetails.description }}
            </p>
          </div>
          <div class="tw:text-right">
            <div class="tw:text-lg tw:font-bold">${{ selectedProductDetails.price }} {{ selectedProductDetails.currency }}</div>
            <div class="tw:text-sm tw:text-gray-500">Código: {{ selectedProductDetails.code }}</div>
          </div>
        </div>

        <div v-if="selectedProductDetails.programs && selectedProductDetails.programs.length > 0" class="mt-2">
          <div class="tw:text-sm tw:font-medium mb-1">Programas incluidos:</div>
          <div class="tw:flex tw:flex-wrap tw:gap-2">
            <v-chip v-for="prog in selectedProductDetails.programs" :key="prog.id" size="small" color="primary" variant="outlined">
              {{ prog.courseLevel }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="tw:border tw:border-gray-200 tw:rounded-md p-4 tw:text-center tw:text-gray-500 py-8 mb-2">
      Seleccione un producto para ver sus detalles
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div class="d-flex tw:justify-center">
        <v-btn-toggle v-model="type" class="mt-6" variant="tonal" color="success" mandatory divided>
          <v-btn value="N">
            <span>Natural</span>
          </v-btn>
          <v-btn value="J">
            <span>Juridica</span>
          </v-btn>
        </v-btn-toggle>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">{{ type === 'N' ? 'Nombre Completo' : 'Razón Social' }}</h3>
        <v-text-field
          v-model="fullname"
          variant="outlined"
          :placeholder="type === 'N' ? 'Jhon Frederick Doe Marshall' : 'Empresa S.A.'"
          :error-messages="v$.fullname.$errors.map((e) => e.$message.toString())"
          @update:model-value="
            ($event) => {
              v$.fullname.$touch();
              emit('update:fullname', $event);
            }
          "
        ></v-text-field>
      </div>
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Cédula o RUC</h3>
        <v-text-field
          v-model="document"
          variant="outlined"
          placeholder="1799999999 / 001"
          :maxlength="13"
          inputmode="numeric"
          pattern="\d*"
          :error-messages="v$.document.$errors.map((e) => String(e.$message))"
          @update:model-value="
            ($event) => {
              const digits = ($event ?? '').replace(/\D/g, '').slice(0, 13);
              if (digits !== document) {
                document = digits;
              }
              v$.document.$touch();
              emit('update:document', $event);
            }
          "
        />
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Teléfono</h3>
        <v-text-field
          v-model="phone"
          variant="outlined"
          placeholder="099 999 9999"
          :maxlength="10"
          inputmode="numeric"
          pattern="\d*"
          :error-messages="v$.phone.$errors.map((e) => String(e.$message))"
          @update:model-value="
            ($event) => {
              const digits = ($event ?? '').replace(/\D/g, '').slice(0, 10);
              if (digits !== phone) {
                phone = digits;
              }
              v$.phone.$touch();
              emit('update:phone', $event);
            }
          "
        ></v-text-field>
      </div>
    </div>
    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Email</h3>
        <v-text-field
          v-model="email"
          variant="outlined"
          placeholder="jhondoe@contoso.com"
          :error-messages="v$.email.$errors.map((e) => String(e.$message))"
          @update:model-value="
            ($event) => {
              v$.email.$touch();
              emit('update:email', $event);
            }
          "
        ></v-text-field>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Dirección</h3>
        <v-text-field
          v-model="address"
          variant="outlined"
          placeholder="Av. Principal 123, Quito"
          :error-messages="v$.address.$errors.map((e) => String(e.$message))"
          @update:model-value="
            ($event) => {
              v$.address.$touch();
              emit('update:address', $event);
            }
          "
        ></v-text-field>
      </div>
    </div>

    <!-- Notas -->
    <div>
      <h3 class="tw:text-lg tw:font-semibold pb-2">Notas</h3>
      <v-textarea
        v-model="notes"
        variant="outlined"
        placeholder="Añadir notas o términos de pago (opcional)"
        rows="4"
        hint="Incluya instrucciones de pago o información adicional para el cliente"
        @update:model-value="emit('update:notes', notes)"
      ></v-textarea>
    </div>
  </div>
</template>

<style scoped>
.section-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
