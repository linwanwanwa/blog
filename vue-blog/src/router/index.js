import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/GameView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/blog/changsha',
    name: 'Changsha',
    component: () => import('../views/ChangshaView.vue')
  },
  {
    path: '/blog/forgive',
    name: 'Forgive',
    component: () => import('../views/ForgiveView.vue')
  },
  {
    path: '/blog/dev-setup',
    name: 'DevSetup',
    component: () => import('../views/DevSetupView.vue')
  },
  {
    path: '/blog/focus-tips',
    name: 'FocusTips',
    component: () => import('../views/FocusTipsView.vue')
  },
  {
    path: '/blog/wuhan-food',
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
