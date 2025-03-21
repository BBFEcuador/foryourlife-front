import type { User } from '@/models/User';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore(
    'user-store',
    () => {
        const token = ref('');
        const user = ref<User>({} as User);
        const tenantId = ref();
        const logout = () => {
            user.value = {} as User;
            token.value = '';
            tenantId.value = '';
        };
        const setToken = (newToken: string) => {
            token.value = newToken;
        };
        const setUser = (newUser: User) => {
            user.value = newUser;
        };
        const setTenantId = (newTenantId: string) => {
            tenantId.value = newTenantId;
        };
        return {
            token,
            user,
            tenantId,
            logout,
            setToken,
            setUser,
            setTenantId,
        };
    },
    { persist: true }
);
