import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/11', // Redirect home to the current lesson
    },
    {
      path: '/lesson/11',
      name: 'lesson11',
      component: () => import('../lessons/Lesson11.vue'),
    },
  ],
})

export default router
