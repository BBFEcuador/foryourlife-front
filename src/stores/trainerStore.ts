import { defineStore } from 'pinia';
import { ref } from 'vue';

export const trainerStore = defineStore(
  'trainer-store',    
  () => {
    const token = ref('');
    const trainer = ref<any>({} as any);
    const selectCampusId = ref('')
    const isCampusSelected = ref(false)
    const availableCampus = ref([{} as any])

    const logout = () => {
      trainer.value = {} as any;
      token.value = '';
      selectCampusId.value = ''
      isCampusSelected.value = false
      availableCampus.value = []
    };
    const setToken = (newToken: string) => {
      token.value = newToken;
    };
    const setTrainer = (newTrainer: any) => {
      trainer.value = newTrainer;
    };
    const setSelectedCampusId = (id: string) => {
      selectCampusId.value = id
    }
    const setIsCampusSelected = (bool: boolean) => {
      isCampusSelected.value = bool
    }

    const setAvailableCampus = (campus: any[]) => {
      availableCampus.value = campus
    }
    return {
      token,
      trainer,
      selectCampusId,
      isCampusSelected,
      availableCampus,
      logout,
      setToken,
      setAdmin: setTrainer,
      setIsCampusSelected,
      setSelectedCampusId,
      setAvailableCampus,
    };
  },
  { persist: true }
);
