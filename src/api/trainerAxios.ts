import { router } from '@/router';
import { userStore } from '@/stores/useStore';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URI;

export const trainerApi = axios.create({
  baseURL: baseURL
});

trainerApi.interceptors.request.use((req) => {
  const { token } = userStore();
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

trainerApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      userStore().logout();
      router.push({ name: 'Trainer Login' });
    }
    return Promise.reject(error);
  }
);
