import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainRoutes from './MainRoutes';
import { PublicRoutes, RegisterRoutes } from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import AdminRoutes from './AdminRoutes';
import TrainerRoutes from './TrainerRoutes';
import { trainerStore } from '@/stores/trainerStore.ts';

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
  },
  MainRoutes,
  PublicRoutes,
  RegisterRoutes,
  ...AdminRoutes,
  ...TrainerRoutes
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

interface User {
  // Define the properties and their types for the user data here
  // For example:
  id: number;
  name: string;
}

// Assuming you have a type/interface for your authentication store
interface AuthStore {
  user: User | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}
