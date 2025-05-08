import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authRoute } from '@/configs'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/',
      name: 'auth',
      children: [
        {
          path: authRoute.register,
          name: authRoute.register,
          component: () => import('../views/auth/register/PageView.vue'),
        },
        {
          path: authRoute.login,
          name: authRoute.login,
          component: () => import('../views/auth/login/PageView.vue'),
        },
        {
          path: authRoute.forgotPassword,
          name: authRoute.forgotPassword,
          component: () => import('../views/auth/forgot-password/PageView.vue'),
        },
        {
          path: `${authRoute.resetPassword}/:token`,
          name: authRoute.resetPassword,
          component: () => import('../views/auth/reset-password/PageView.vue'),
        },
      ],
    },
  ],
})

export default router
