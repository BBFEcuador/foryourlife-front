import type { Participant } from '@/models/Participants';
import type { User } from '@/models/User';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore(
  'user-store',
  () => {
    const token = ref('');
    const user = ref<Participant>({} as Participant);
    const logout = () => {
      user.value = {} as Participant;
      token.value = '';
    };
    const setToken = (newToken: string) => {
      token.value = newToken;
    };
    const setUser = (newUser: Participant) => {
      user.value = newUser;
    };
    return {
      token,
      user,
      logout,
      setToken,
      setUser
    };
  },
  { persist: true }
);
