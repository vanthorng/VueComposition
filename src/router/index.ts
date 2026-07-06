import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/12', // Redirect home to the current lesson
    },
    {
      path: '/lesson/12',
      name: 'lesson12',
      component: () => import('../lessons/Lesson12.vue'),
    },
  ],
})

export default router
