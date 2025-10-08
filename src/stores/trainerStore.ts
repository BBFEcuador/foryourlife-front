import { defineStore } from 'pinia';
import { ref } from 'vue';

export const trainerStore = defineStore(
  'trainer-store',    
  () => {
    const token = ref('');
    const user = ref<any>({} as any);
    const selectCampusId = ref('')
    const isCampusSelected = ref(false)
    const availableCampus = ref([{} as any])

    const logout = () => {
      user.value = {} as any;
      token.value = '';
      selectCampusId.value = ''
      isCampusSelected.value = false
      availableCampus.value = []
    };
    const setToken = (newToken: string) => {
      token.value = newToken;
    };
    const setAdmin = (newUser: any) => {
      user.value = newUser;
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
      user,
      selectCampusId,
      isCampusSelected,
      availableCampus,
      logout,
      setToken,
      setAdmin,
      setIsCampusSelected,
      setSelectedCampusId,
      setAvailableCampus,
    };
  },
  { persist: true }
);
