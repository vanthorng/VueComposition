import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/14', // Redirect home to the current lesson
    },
    {
      path: '/lesson/14',
      name: 'lesson14',
      component: () => import('../lessons/Lesson14.vue'),
    },
  ],
})

export default router
