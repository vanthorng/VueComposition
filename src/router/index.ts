import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/15', // Redirect home to the current lesson
    },
    {
      path: '/lesson/15',
      name: 'lesson15',
      component: () => import('../lessons/Lesson15.vue'),
    },
  ],
})

export default router
