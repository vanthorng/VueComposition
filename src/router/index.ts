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
      path: '/lesson/1',
      name: 'lesson1',
      component: () => import('../lessons/Lesson01.vue'),
    },
    {
      path: '/lesson/2',
      name: 'lesson2',
      component: () => import('../lessons/Lesson02.vue'),
    },
    {
      path: '/lesson/3',
      name: 'lesson3',
      component: () => import('../lessons/Lesson03.vue'),
    },
    {
      path: '/lesson/4',
      name: 'lesson4',
      component: () => import('../lessons/Lesson04.vue'),
    },
    {
      path: '/lesson/5',
      name: 'lesson5',
      component: () => import('../lessons/Lesson05.vue'),
    },
    {
      path: '/lesson/6',
      name: 'lesson6',
      component: () => import('../lessons/Lesson06.vue'),
    },
    {
      path: '/lesson/7',
      name: 'lesson7',
      component: () => import('../lessons/Lesson07.vue'),
    },
    {
      path: '/lesson/8',
      name: 'lesson8',
      component: () => import('../lessons/Lesson08.vue'),
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
    {
      path: '/lesson/10',
      name: 'lesson10',
      component: () => import('../lessons/Lesson10.vue'),
    },
    {
      path: '/lesson/10/profile/:userId',
      name: 'lesson10-profile',
      component: () => import('../lessons/Lesson10.vue'),
      props: true,
    },
    {
      path: '/lesson/11',
      name: 'lesson11',
      component: () => import('../lessons/Lesson11.vue'),
    },
    {
      path: '/lesson/12',
      name: 'lesson12',
      component: () => import('../lessons/Lesson12.vue'),
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
