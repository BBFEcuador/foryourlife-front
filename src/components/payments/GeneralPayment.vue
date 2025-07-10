<script setup lang="ts">
import useDiscounts from '@/composables/admin/discounts/useDiscounts';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useAvailableProducts from '@/composables/admin/products/useAvailableProducts';
import useCampus from '@/composables/admin/useCampus';
import { router } from '@/router';
import Swal from 'sweetalert2';
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:modelValue',
  'update:selectedParticipant',
  'update:selectedProduct',
  'update:notes',
  'update:fullname',
  'update:address',
  'update:document',
  'update:phone',
  'update:email',
  'update:selectedDiscount',
  'update:selectedCampus'
]);

// Definimos interfaces para los tipos
interface CartItem {
  id: string | number;
  name: string;
  code: string;
  price: number;
  currency: string;
  description?: string;
  programs?: Array<{
    id: string;
    name: string;
    courseLevel: string;
  }>;
}

// Obtenemos los participantes y productos del composable
const { participants, participantSearch } = useParticipants();
const { productsData, productSearch } = useAvailableProducts();
const { discountsData, search } = useDiscounts();
const selectedParticipant = ref(null);
const selectedProduct = ref(null);
const selectedDiscount = ref(null);
const selectedCampus = ref(null);
const notes = ref('');
const fullname = ref('');
const address = ref('');
const document = ref('');
const phone = ref('');
const email = ref('');

// Observamos cambios en los valores seleccionados para emitir eventos
watch(selectedParticipant, (newVal) => {
  emit('update:selectedParticipant', newVal);
});

watch(selectedProduct, (newVal) => {
  emit('update:selectedProduct', newVal);
});

watch(notes, (newVal) => {
  emit('update:notes', newVal);
});
watch(fullname, (newVal) => {
  emit('update:fullname', newVal);
});
watch(address, (newVal) => {
  emit('update:address', newVal);
});
watch(document, (newVal) => {
  emit('update:document', newVal);
});
watch(phone, (newVal) => {
  emit('update:phone', newVal);
});
watch(email, (newVal) => {
  emit('update:email', newVal);
});

watch(selectedDiscount, (newVal) => {
  emit('update:selectedDiscount', newVal);
});

watch(selectedCampus, (newVal) => {
  emit('update:selectedCampus', newVal);
});

// Accedemos a los datos de los participantes
const participantsList = computed(() => {
  return participants?.value?.content || [];
});

// Accedemos a los datos de los productos
const productsList = computed(() => {
  return productsData?.value?.content || [];
});

// Accedemos a los datos de los descuentos
const discountsList = computed(() => {
  return discountsData?.value?.content || [];
});

const searchClient = (s: string) => {
  participantSearch.value = s;
};

const searchProduct = (s: string) => {
  productSearch.value = s;
};

const searchDiscount = (s: string) => {
  search.value = s;
};

const handleParticipantChange = (participant: any) => {
  selectedCampus.value = participant.campus;
  emit('update:selectedParticipant', participant);
};

const handleProductChange = (product: any) => {
  if (product.programs.length === 0) {
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
    emit('update:selectedProduct', product);
  }
};

const handleDiscountChange = (discount: any) => {
  emit('update:selectedDiscount', discount);
};

// Observamos cambios en el producto seleccionado
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
};

defineExpose({ resetTextFields });
</script>

<template>
  <div>
    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Otorgado a</h3>
        <VCombobox
          @update:search="searchClient"
          v-model="selectedParticipant"
          :items="participantsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          :placeholder="participantsList.length > 0 ? 'Seleccionar cliente' : 'No hay clientes disponibles'"
          return-object
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
          @update:search="searchProduct"
          v-model="selectedProduct"
          :items="productsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          placeholder="Buscar producto"
          return-object
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

    <!-- Datos de facturacion -->
    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Nombre Completo</h3>
        <v-text-field
          v-model="fullname"
          variant="outlined"
          placeholder="Jhon Frederick Doe Marshall"
          @update:model-value="emit('update:fullname', fullname)"
        ></v-text-field>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Dirección</h3>
        <v-text-field
          v-model="address"
          variant="outlined"
          placeholder="Av. Principal 123, Quito"
          @update:model-value="emit('update:address', address)"
        ></v-text-field>
      </div>
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:gap-x-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Cédula/Pasaporte o Ruc</h3>
        <v-text-field
          v-model="document"
          variant="outlined"
          placeholder="17999999990"
          @update:model-value="emit('update:document', document)"
        ></v-text-field>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold pb-2">Teléfono</h3>
        <v-text-field
          v-model="phone"
          variant="outlined"
          placeholder="099 999 9999"
          @update:model-value="emit('update:phone', phone)"
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
          @update:model-value="emit('update:email', email)"
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
