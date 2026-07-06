import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/13', // Redirect home to the current lesson
    },
    {
      path: '/lesson/13',
      name: 'lesson13',
      component: () => import('../lessons/Lesson13.vue'),
    },
    {
      path: '/lesson/13/admin',
      name: 'lesson13-admin',
      component: () => import('../lessons/Lesson13.vue'),
      meta: { requiresAuth: true }, // Mark route as requiring auth
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
