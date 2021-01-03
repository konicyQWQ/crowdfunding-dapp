import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/myself',
    name: 'myself',
    component: () => import('../views/Myself.vue')
  },
  {
    path: '/funding/:id',
    name: 'funding',
    component: () => import('../views/Funding.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
