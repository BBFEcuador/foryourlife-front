import { router } from '@/router';
import { adminStore } from '@/stores/adminStore';
import { userStore } from '@/stores/useStore';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URI;

export const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use((req) => {
  const { token } = adminStore();
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      adminStore().logout();
      router.push({ name: 'Admin Login' });
    }
    return Promise.reject(error);
  }
);
