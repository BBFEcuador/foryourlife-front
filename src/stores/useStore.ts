import type { User } from '@/models/User';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore(
    'user-store',
    () => {
        const token = ref('');
        const user = ref<User>({} as User);
        const logout = () => {
            user.value = {} as User;
            token.value = '';
        };
        const setToken = (newToken: string) => {
            token.value = newToken;
        };
        const setUser = (newUser: User) => {
            user.value = newUser;
        };
        return {
            token,
            user,
            logout,
            setToken,
            setUser,
        };
    },
    { persist: true }
);
