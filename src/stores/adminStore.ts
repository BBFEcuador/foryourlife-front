import { defineStore } from 'pinia';
import { ref } from 'vue';

export const adminStore = defineStore(
  'admin-store',
  () => {
    const token = ref('');
    const user = ref<any>({} as any);
    const isCashDrawerOpen = ref(false);
    const cashDrawer = ref<any>({} as any);
    const selectCampusId = ref('')
    const isCampusSelected = ref(false)

    const logout = () => {
      user.value = {} as any;
      token.value = '';
      isCashDrawerOpen.value = false;
      cashDrawer.value = {} as any;
      selectCampusId.value = ''
      isCampusSelected.value = false
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
    const setCashDrawer = (drawer: any) => {
      cashDrawer.value = drawer;
    };
    const setSelectedCampusId = (id: string) => {
      selectCampusId.value = id
    }
    const setIsCampusSelected = (bool: boolean) => {
      isCampusSelected.value = bool
    }
    return {
      token,
      user,
      isCashDrawerOpen,
      cashDrawer,
      selectCampusId,
      isCampusSelected,
      logout,
      setToken,
      setAdmin,
      setCashDrawerOpen,
      setCashDrawer,
      setIsCampusSelected,
      setSelectedCampusId
    };
  },
  { persist: true }
);
