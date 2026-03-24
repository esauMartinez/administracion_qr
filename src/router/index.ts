import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:guia',
      name: 'timbres',
      component: () => import('@/pages/HomePage.vue'),
    },
  ],
})

export default router
