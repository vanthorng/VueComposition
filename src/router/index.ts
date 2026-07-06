import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

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

// Global Before Navigation Guard
router.beforeEach((to, from) => {
  // If the target route requires authentication and user is logged out:
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect to the info page and pass target path in query
    return { name: 'lesson13', query: { redirectedFrom: to.fullPath } }
  }
})

export default router
