import { router } from '@/router';
import { userStore } from '@/stores/useStore';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URI;

export const api = axios.create({
    baseURL: baseURL
});

api.interceptors.request.use((req) => {
    const { token, tenantId } = userStore();
    req.headers.Authorization = `Bearer ${token}`;
    req.headers['X-Tenant'] = `${tenantId}`;
    return req;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            userStore().logout();
            router.push({ name: 'Side Login' });
        }
        return Promise.reject(error);
    }
);
