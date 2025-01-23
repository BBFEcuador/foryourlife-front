import type { Admin, Role } from '@/models/Admin';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore(
    'user-store',
    () => {
        const token = ref('');
        const tour = ref(true);
        const user = ref<Admin>({} as Admin);
        const role = ref<Role>({} as Role);
        const tenantId = ref();
        const logout = () => {
            user.value = {} as Admin;
            role.value = {} as Role;
            token.value = '';
            tenantId.value = '';
        };
        const setToken = (newToken: string) => {
            token.value = newToken;
        };
        const setUser = (newUser: Admin) => {
            user.value = newUser;
        };
        const setRole = (newRole: Role) => {
            role.value = newRole;
        };
        const setTenantId = (newTenantId: string) => {
            tenantId.value = newTenantId;
        };
        return {
            token,
            user,
            tenantId,
            role,
            tour,
            logout,
            setToken,
            setUser,
            setTenantId,
            setRole,
        };
    },
    { persist: true }
);
