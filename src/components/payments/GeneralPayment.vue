<script setup lang="ts">
import useDiscounts from '@/composables/admin/discounts/useDiscounts';
import useParticipants from '@/composables/admin/participants/useParticipants';
import useProducts from '@/composables/admin/products/useProducts';
import useCampus from '@/composables/admin/useCampus';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref, computed, watch } from 'vue';

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
const { productsData, productSearch } = useProducts();
const { discountsData, search } = useDiscounts();
const { campus } = useCampus();
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

// Función para buscar clientes
const searchClient = (s: string) => {
  participantSearch.value = s;
};

// Función para buscar productos
const searchProduct = (s: string) => {
  productSearch.value = s;
};

// Función para buscar descuentos
const searchDiscount = (s: string) => {
  search.value = s;
};

// Función para manejar el cambio de participante
const handleParticipantChange = (participant: any) => {
  console.log('Participante seleccionado en GeneralPayment:', participant);
  emit('update:selectedParticipant', participant);
};

// Función para manejar el cambio de producto
const handleProductChange = (product: any) => {
  console.log('Producto seleccionado en GeneralPayment:', product);
  emit('update:selectedProduct', product);
};

// Función para manejar el cambio de descuento
const handleDiscountChange = (discount: any) => {
  console.log('Descuento seleccionado:', discount);
  emit('update:selectedDiscount', discount);
};

// Función para eliminar el descuento seleccionado
const clearDiscount = () => {
  // Primero emitimos el evento para actualizar el componente padre
  emit('update:selectedDiscount', null);

  // Luego establecemos el valor local a null con un pequeño retraso para evitar conflictos
  setTimeout(() => {
    selectedDiscount.value = null;
    console.log('Descuento eliminado');
  }, 50);
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
</script>

<template>
  <div class="general-payment-container">
    <div class="tw:grid tw:grid-cols-2 tw:gap-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold mb-4">Otorgado a</h3>
        <VCombobox
          @update:search="searchClient"
          v-model="selectedParticipant"
          :items="participantsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
          placeholder="Seleccionar cliente"
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
        <h3 class="tw:text-lg tw:font-semibold mb-4">Campus</h3>
        <v-select
          v-model="selectedCampus"
          :items="campus"
          item-title="city"
          item-value="id"
          variant="outlined"
          density="compact"
          placeholder="Seleccionar campus"
          return-object
        ></v-select>
      </div>
    </div>

    <!-- Artículos/Servicios -->
    <div class="tw:grid tw:grid-cols-2 tw:gap-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold mb-4">Artículos/Servicios</h3>
        <VCombobox
          @update:search="searchProduct"
          v-model="selectedProduct"
          :items="productsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
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
        <h4 class="tw:text-lg tw:font-semibold mb-4">Descuento</h4>
        <v-select
          v-model="selectedDiscount"
          :items="discountsList"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
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
    <div v-if="selectedProductDetails" class="tw:border tw:border-gray-200 tw:rounded-md pa-4 mb-3">
      <div class="tw:flex tw:flex-col tw:gap-4">
        <div class="tw:flex tw:justify-between tw:items-start">
          <div>
            <h3 class="tw:font-medium tw:text-lg">{{ selectedProductDetails.name }}</h3>
            <p v-if="selectedProductDetails.description" class="tw:text-sm tw:text-gray-600 tw:mt-1">
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

    <div v-else class="mt-4 tw:border tw:border-gray-200 tw:rounded-md p-4 tw:text-center tw:text-gray-500 py-8 mb-3">
      Seleccione un producto para ver sus detalles
    </div>

    <!-- Datos de facturacion -->
    <div class="tw:grid tw:grid-cols-2 tw:gap-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Nombre Completo</h3>
        <v-text-field
          v-model="fullname"
          variant="outlined"
          placeholder="Jhon Frederick Doe Marshall"
          @update:model-value="emit('update:fullname', fullname)"
        ></v-text-field>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Dirección</h3>
        <v-text-field
          v-model="address"
          variant="outlined"
          placeholder="Av. Principal 123, Quito"
          @update:model-value="emit('update:address', address)"
        ></v-text-field>
      </div>
    </div>

    <div class="tw:grid tw:grid-cols-2 tw:gap-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Cédula/Pasaporte o Ruc</h3>
        <v-text-field
          v-model="document"
          variant="outlined"
          placeholder="17999999990"
          @update:model-value="emit('update:document', document)"
        ></v-text-field>
      </div>
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Teléfono</h3>
        <v-text-field
          v-model="phone"
          variant="outlined"
          placeholder="099 999 9999"
          @update:model-value="emit('update:phone', phone)"
        ></v-text-field>
      </div>
    </div>
    <div class="tw:grid tw:grid-cols-2 tw:gap-6">
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Email</h3>
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
      <h3 class="tw:text-lg tw:font-semibold tw:mb-4">Notas</h3>
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
