const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'pregled_opreme',
        component: () => import('pages/PregledOpremePage.vue')
      },
      {
        path: 'unos_opreme',
        component: () => import('pages/UnosOpremePage.vue')
      },
      {
        path: 'servis_opreme',
        component: () => import('pages/ServisOpremePage.vue')
      },
      {
        path: 'status_opreme',
        component: () => import('pages/StatusOpremePage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
