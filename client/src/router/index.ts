import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authRoute, userRoute, productRoute, cartRoute, paymentRoute } from '@/configs'

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
    {
      path: '/user/',
      name: 'user',
      children: [
        {
          path: userRoute.profile,
          name: userRoute.profile,
          component: () => import('../views/user/profile/PageView.vue'),
        },
      ],
    },
    {
      path: '/products/',
      name: 'products',
      children: [
        {
          path: ':id',
          name: productRoute.productDetail,
          component: () => import('../views/product/detail/PageView.vue'),
        },
      ],
    },
    {
      path: '/cart/',
      name: cartRoute.cart,
      component: () => import('../views/cart/PageView.vue'),
    },
    {
      path: '/payment/',
      name: paymentRoute.payment,
      component: () => import('../views/payment/PageView.vue'),
    },
  ],
})

export default router
