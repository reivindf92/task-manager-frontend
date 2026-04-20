import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../components/LoginView.vue'
import TasksView from '../components/TasksView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/tasks', component: TasksView },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../components/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/tasks'
  }
})
export default router
