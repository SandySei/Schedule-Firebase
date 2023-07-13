export const routes = [
    {
      children: [
        {
            path: '/customer',
            name: 'customerLanding',
            component: () => import('@/modules/customer/views/CustomerLanding.vue'),
          },
          {
            path: '/booking',
            name: 'booking',
            component: () => import('@/modules/customer/views/CustomerBooking.vue'),
          },
      ],
    },
  ];