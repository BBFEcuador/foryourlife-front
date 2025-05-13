<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parsePhoneNumberFromString, AsYouType, getExampleNumber, getCountries } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
  modelValue: string;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'country-change', value: string): void;
}>();

// Get available countries with examples from libphonenumber-js
const availableCountries = getCountries();

// Country names in Spanish
const countryNames: Record<string, string> = {
  'US': 'Estados Unidos',
  'MX': 'México',
  'AR': 'Argentina',
  'BR': 'Brasil',
  'CL': 'Chile',
  'CO': 'Colombia',
  'VE': 'Venezuela',
  'ES': 'España',
  'DE': 'Alemania',
  'FR': 'Francia',
  'GB': 'Reino Unido',
  'IT': 'Italia',
  'PT': 'Portugal',
  'JP': 'Japón',
  'CN': 'China',
  'IN': 'India',
  'RU': 'Rusia',
  'AU': 'Australia',
  'NZ': 'Nueva Zelanda',
  'ZA': 'Sudáfrica',
  'EC': 'Ecuador',
  // Add more country names as needed
};

// Country flag images (using ISO 3166-1 alpha-2 codes)
const getCountryFlagUrl = (countryCode: string) => {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

// Create a list of country options with names, flags and example numbers
const countryOptions = computed(() => {
  return availableCountries
    .map(countryCode => {
      const exampleNumber = getExampleNumber(countryCode, examples);
      return {
        code: countryCode,
        dialCode: exampleNumber ? `+${exampleNumber.countryCallingCode}` : '',
        country: countryNames[countryCode] || countryCode,
        flagUrl: getCountryFlagUrl(countryCode),
        example: exampleNumber ? exampleNumber.formatNational() : '',
        // Store the calling code separately for autodetection
        callingCode: exampleNumber ? exampleNumber.countryCallingCode : ''
      };
    })
    .filter(country => country.dialCode && country.example) // Filter out countries without examples
    .sort((a, b) => {
      // Ecuador first, then alphabetically by country name
      if (a.code === 'EC') return -1;
      if (b.code === 'EC') return 1;
      return a.country.localeCompare(b.country);
    });
});

// Map of calling codes to country codes for autodetection
const callingCodeMap = computed(() => {
  const map: Record<string, string> = {};
  countryOptions.value.forEach(country => {
    if (country.callingCode) {
      map[country.callingCode] = country.code;
    }
  });
  return map;
});

// Set default country to Ecuador (EC) or first available
const selectedCountry = ref('EC' as CountryCode);

// Phone number input
const phoneInput = ref('');

// Filtered countries for autocomplete
const filteredCountries = ref(countryOptions.value);

// Search term for country filter
const countrySearch = ref('');

// Dialog open state
const dialogOpen = ref(false);

// Get the currently selected country's dial code
const selectedCountryDialCode = computed(() => {
  const country = countryOptions.value.find(c => c.code === selectedCountry.value);
  return country ? country.dialCode : '';
});

// Get the currently selected country's flag URL
const selectedCountryFlagUrl = computed(() => {
  const country = countryOptions.value.find(c => c.code === selectedCountry.value);
  return country ? country.flagUrl : '';
});

// Get example phone number for selected country
const phoneExample = computed(() => {
  const country = countryOptions.value.find(c => c.code === selectedCountry.value);
  return country ? country.example : '';
});

// Format phone number as user types and auto-detect country
const updateFormattedPhone = (value: string) => {
  if (!value) {
    phoneInput.value = '';
    emit('update:modelValue', '');
    return;
  }
  
  // Check if the input starts with + and try to auto-detect country
  if (value.startsWith('+')) {
    // Extract the country calling code
    const match = value.match(/^\+(\d+)/);
    if (match && match[1]) {
      // Try to find the longest matching calling code
      let longestMatch = '';
      for (const callingCode in callingCodeMap.value) {
        if (match[1].startsWith(callingCode) && callingCode.length > longestMatch.length) {
          longestMatch = callingCode;
        }
      }
      
      // If we found a match, update the selected country
      if (longestMatch && callingCodeMap.value[longestMatch]) {
        selectedCountry.value = callingCodeMap.value[longestMatch] as CountryCode;
        emit('country-change', selectedCountry.value);
      }
    }
  }
  
  const formatter = new AsYouType(selectedCountry.value as CountryCode);
  const formatted = formatter.input(value);
  phoneInput.value = formatted;
  
  // Emit the full international format
  const phoneNumber = parsePhoneNumberFromString(formatted, selectedCountry.value as CountryCode);
  if (phoneNumber) {
    emit('update:modelValue', phoneNumber.format('E.164'));
  } else {
    emit('update:modelValue', `${selectedCountryDialCode.value}${formatted}`);
  }
};

// Filter countries based on search term
const filterCountries = (searchTerm: string) => {
  if (!searchTerm) {
    filteredCountries.value = countryOptions.value;
    return;
  }
  
  const term = searchTerm.toLowerCase();
  filteredCountries.value = countryOptions.value.filter(country => 
    country.country.toLowerCase().includes(term) || 
    country.dialCode.includes(term)
  );
};

// Select a country
const selectCountry = (country: typeof countryOptions.value[0]) => {
  selectedCountry.value = country.code as CountryCode;
  countrySearch.value = '';
  dialogOpen.value = false;
  emit('country-change', country.code);
  
  // Update the phone number with the new country code
  if (phoneInput.value) {
    updateFormattedPhone(phoneInput.value);
  }
};

// Open country selection dialog
const openCountryDialog = () => {
  dialogOpen.value = true;
  filteredCountries.value = countryOptions.value;
};

// Watch for changes in the search term
watch(countrySearch, (newValue) => {
  filterCountries(newValue);
});

// Initialize from model value if provided
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== phoneInput.value) {
    // Try to parse the phone number to get country and national number
    try {
      const phoneNumber = parsePhoneNumberFromString(newValue);
      if (phoneNumber) {
        selectedCountry.value = phoneNumber.country as CountryCode || 'EC' as CountryCode;
        phoneInput.value = phoneNumber.formatNational();
      }
    } catch (e) {
      // If parsing fails, just use the value as is
      phoneInput.value = newValue.replace(selectedCountryDialCode.value, '');
    }
  }
}, { immediate: true });
</script>

<template>
  <div class="phone-list-component">
    <label v-if="label" class="phone-label">
      {{ label }} <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="phone-input-container">
      <!-- Country selector button -->
      <button 
        type="button" 
        class="country-selector-btn"
        @click="openCountryDialog"
      >
        <img 
          :src="selectedCountryFlagUrl" 
          :alt="selectedCountry" 
          class="country-flag-img"
          width="24"
          height="18"
        />
        <span class="country-code">{{ selectedCountryDialCode }}</span>
        <Icon icon="mdi-chevron-down" class="dropdown-icon" />
      </button>
      
      <!-- Phone number input -->
      <input
        type="tel"
        class="phone-number-input"
        :class="{ 'has-error': error }"
        v-model="phoneInput"
        :placeholder="placeholder || phoneExample"
        @input="updateFormattedPhone(phoneInput)"
        @paste="(event) => {
          const text = event.clipboardData?.getData('text') || '';
          updateFormattedPhone(text);
        }"
      />
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <!-- Country selection dialog -->
    <v-dialog v-model="dialogOpen" max-width="400px">
      <v-card>
        <v-card-title class="dialog-title">
          Seleccionar país
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogOpen = false">
            <Icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <!-- Search input -->
          <v-text-field
            v-model="countrySearch"
            prepend-inner-icon="mdi-magnify"
            label="Buscar país o código"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-4"
          ></v-text-field>
          
          <!-- Countries list -->
          <v-list class="country-list">
            <v-list-item
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              :active="country.code === selectedCountry"
              class="country-list-item"
            >
              <template v-slot:prepend>
                <img 
                  :src="country.flagUrl" 
                  :alt="country.code" 
                  class="country-flag-img"
                  width="24"
                  height="18"
                />
              </template>
              <v-list-item-title>{{ country.country }}</v-list-item-title>
              <v-list-item-subtitle>{{ country.dialCode }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.phone-list-component {
  width: 100%;
}

.phone-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.required-mark {
  color: rgb(var(--v-theme-error));
}

.phone-input-container {
  display: flex;
  width: 100%;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 4px;
  overflow: hidden;
}

.country-selector-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border: none;
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  cursor: pointer;
  transition: background-color 0.2s;
}

.country-selector-btn:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
}

.country-flag-img {
  margin-right: 6px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 2px;
  object-fit: cover;
}

.country-code {
  font-size: 0.875rem;
  font-weight: 500;
}

.dropdown-icon {
  margin-left: 4px;
  font-size: 1rem;
  opacity: 0.7;
}

.phone-number-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  font-size: 0.875rem;
  background-color: transparent;
}

.phone-number-input.has-error {
  border-color: rgb(var(--v-theme-error));
}

.error-message {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-error));
}

.dialog-title {
  display: flex;
  align-items: center;
  padding: 16px;
}

.country-list {
  max-height: 300px;
  overflow-y: auto;
}

.country-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.country-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
