export const routes = [
    {
      children: [
        {
          path: '/realtor',
          name: 'realtorLanding',
          component: () => import('@/modules/realtor/views/RealtorLanding.vue'),
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: () => import('@/modules/realtor/views/RealtorSchedule.vue'),
        },
      ],
    },
  ];