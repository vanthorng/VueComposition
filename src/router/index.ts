import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/16', // Redirect home to the current lesson
    },
    {
      path: '/lesson/16',
      name: 'lesson16',
      component: () => import('../lessons/Lesson16.vue'),
    },
  ],
})

export default router
