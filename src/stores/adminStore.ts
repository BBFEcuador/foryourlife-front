import { defineStore } from 'pinia';
import { ref } from 'vue';

export const adminStore = defineStore(
  'admin-store',
  () => {
    const token = ref('');
    const user = ref<any>({} as any);
    const isCashDrawerOpen = ref(false);
    const cashDrawer = ref<any>({} as any);
    const logout = () => {
      user.value = {} as any;
      token.value = '';
      isCashDrawerOpen.value = false;
      cashDrawer.value = {} as any;
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
    return {
      token,
      user,
      isCashDrawerOpen,
      cashDrawer,
      logout,
      setToken,
      setAdmin,
      setCashDrawerOpen,
      setCashDrawer
    };
  },
  { persist: true }
);
