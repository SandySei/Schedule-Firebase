// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/customer',
        name: 'customerLanding',
        component: () => import('@/modules/customer/CustomerLanding.vue'),
      },
      {
        path: '/booking',
        name: 'booking',
        component: () => import('@/modules/customer/CustomerBooking.vue'),
      },
      {
        path: '/realtor',
        name: 'realtorLanding',
        component: () => import('@/modules/realtor/RealtorLanding.vue'),
      },
      {
        path: '/schedule',
        name: 'schedule',
        component: () => import('@/modules/realtor/RealtorSchedule.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
