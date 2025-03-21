import { defineStore } from "pinia";
import { ref } from "vue";

export const adminStore = defineStore(
  "admin-store",
  () => {
    const token = ref("");
    const user = ref<any>({} as any);
    const logout = () => {
      user.value = {} as any;
      token.value = "";
    };
    const setToken = (newToken: string) => {
      token.value = newToken;
    };
    const setAdmin = (newUser: any) => {
        user.value = newUser;
    };
    return {
      token,
      logout,
      setToken,
      setAdmin,
    };
  },
  { persist: true }
);
