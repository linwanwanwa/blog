import { createRouter, createWebHistory } from 'vue-router'
// 首页是入口，静态引入：慢网下省掉一次"加载主包 → 再请求首页 chunk"的串行往返
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/GameView.vue')
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    component: () => import('../views/GuestbookView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/changsha',
    name: 'Changsha',
    component: () => import('../views/ChangshaView.vue')
  },
  {
    path: '/steady-haven',
    name: 'SteadyHaven',
    component: () => import('../views/SteadyHavenView.vue')
  },
  {
    path: '/dev-setup',
    name: 'DevSetup',
    component: () => import('../views/DevSetupView.vue')
  },
  {
    path: '/focus-tips',
    name: 'FocusTips',
    component: () => import('../views/FocusTipsView.vue')
  },
  {
    path: '/wuhan-food',
    name: 'WuhanFood',
    component: () => import('../views/WuhanFoodView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/blog/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
