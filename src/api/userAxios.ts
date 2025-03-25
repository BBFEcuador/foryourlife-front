import { router } from '@/router';
import { userStore } from '@/stores/useStore';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URI;

export const userApi = axios.create({
  baseURL: baseURL
});

userApi.interceptors.request.use((req) => {
  const { token } = userStore();
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      userStore().logout();
      router.push({ name: 'login-user' });
    }
    return Promise.reject(error);
  }
);
