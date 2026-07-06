import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/17', // Redirect home to the current lesson
    },
    {
      path: '/lesson/17',
      name: 'lesson17',
      component: () => import('../lessons/Lesson17.vue'),
    },
  ],
})

export default router
