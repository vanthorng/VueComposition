import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/9', // Redirect home to the current lesson
    },
    {
      path: '/lesson/9',
      name: 'lesson9',
      component: () => import('../lessons/Lesson09.vue'),
    },
    // Dynamic parameter route for Lesson 09 demonstration
    {
      path: '/lesson/9/user/:username',
      name: 'lesson9-user',
      component: () => import('../lessons/Lesson09.vue'), // Render the same view to inspect route params
    },
  ],
})

export default router
