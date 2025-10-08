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

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const auth: AuthStore = useAuthStore();

  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  // User not logged in and trying to access a restricted page
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath; // Save the intended page
    next('/login');
  } else if (auth.user && to.path === '/login') {
    // User logged in and trying to access the login page
    next({
      query: {
        ...to.query,
        redirect: auth.returnUrl !== '/login' ? to.fullPath : undefined
      }
    });
  } else {
    // All other scenarios, either public page or authorized access
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.fullPath.startsWith('/trainer')) {
    const store = trainerStore()
    if (store.trainer && store.token){
      console.log("Trainer authenticated");
      next()
    }else{
      console.log("Trainer señor toa .. guano toa");
      next({name: 'trainer-login' })
    }
  }
  next();
});
