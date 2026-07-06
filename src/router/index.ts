import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lesson/10', // Redirect home to the current lesson
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
      props: true, // Automatically pass route.params as props to the component!
    },
  ],
})

export default router
