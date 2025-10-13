import { router } from '@/router';
import { userStore } from '@/stores/useStore';
import axios from 'axios';
import { trainerStore } from '@/stores/trainerStore.ts';

const baseURL = import.meta.env.VITE_API_URI;

export const trainerApi = axios.create({
  baseURL: baseURL
});

trainerApi.interceptors.request.use((req) => {
  const store = trainerStore();
  req.headers.Authorization = `Bearer ${store.token}`;
  return req;
});

trainerApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      userStore().logout();
      router.push({ name: 'trainer-login' });
    }
    return Promise.reject(error);
  }
);
