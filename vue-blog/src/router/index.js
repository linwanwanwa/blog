import { createRouter, createWebHistory } from 'vue-router'
// 首页是入口，静态引入：慢网下省掉一次"加载主包 → 再请求首页 chunk"的串行往返
import HomeView from '../views/HomeView.vue'
// 文章路由由 src/content/posts.js 这份唯一清单生成，不再逐篇手写
import { postRoutes } from '../content/posts'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  ...postRoutes,
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
