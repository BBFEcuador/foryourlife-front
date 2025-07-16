import { defineStore } from 'pinia';
import { ref } from 'vue';

export const adminStore = defineStore(
  'admin-store',
  () => {
    const token = ref('');
    const user = ref<any>({} as any);
    const isCashDrawerOpen = ref(false);
    const isCashDrawerLock = ref(false);
    const cashDrawer = ref<any>({} as any);
    const selectCampusId = ref('')
    const isCampusSelected = ref(false)
    const availableCampus = ref([{} as any])

    const logout = () => {
      user.value = {} as any;
      token.value = '';
      isCashDrawerOpen.value = false;
      isCashDrawerLock.value = false;
      cashDrawer.value = {} as any;
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
    const setCashDrawerOpen = (isOpen: boolean) => {
      isCashDrawerOpen.value = isOpen;
    };
    const setCashDrawerLock = (isLock: boolean) => {
      isCashDrawerLock.value = isLock;
    };
    const setCashDrawer = (drawer: any) => {
      cashDrawer.value = drawer;
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
      isCashDrawerOpen,
      cashDrawer,
      selectCampusId,
      isCampusSelected,
      availableCampus,
      isCashDrawerLock,
      logout,
      setToken,
      setAdmin,
      setCashDrawerOpen,
      setCashDrawer,
      setIsCampusSelected,
      setSelectedCampusId,
      setAvailableCampus,
      setCashDrawerLock
    };
  },
  { persist: true }
);
