// 文章清单：全站唯一事实源。
// 新增一篇文章只需要在这里加一条 + 建对应的 .vue 文件，
// 首页列表与路由表都从这里生成，不会再出现「首页有条目但点进去 404」
// 或「文章存在但首页看不到」。
//
// 字段说明：
//   slug      — 路由路径，同时也是点赞功能 post_likes.post_slug 的键，改动会让历史点赞数对不上
//   name      — 路由 name
//   title     — 首页 Blog 列表显示的标题
//   date      — 发布/更新日期，与文章页头部的日期保持一致
//   view      — 懒加载的组件工厂

export const posts = [
  {
    slug: 'config2mcp',
    name: 'Config2Mcp',
    title: 'config2mcp：一份 YAML，把任意命令行变成 Agent 工具',
    date: '2026-10-22',
    view: () => import('../views/Config2McpView.vue')
  },
  {
    slug: 'eating',
    name: 'Eating',
    title: '《吃了么》：水果茶点单原生微信小程序',
    date: '2026-10-22',
    view: () => import('../views/EatingView.vue')
  },
  {
    slug: 'steady-haven',
    name: 'SteadyHaven',
    title: 'SteadyHaven 稳港 — 极简饮食记录 iOS App',
    date: '2024-04-15',
    view: () => import('../views/SteadyHavenView.vue')
  },
  {
    slug: 'focus-tips',
    name: 'FocusTips',
    title: '程序员保持专注的 10 个技巧',
    date: '2024-03-01',
    view: () => import('../views/FocusTipsView.vue')
  },
  {
    slug: 'dev-setup',
    name: 'DevSetup',
    title: '我的开发环境配置',
    date: '2024-02-15',
    view: () => import('../views/DevSetupView.vue')
  },
  {
    slug: 'wuhan-food',
    name: 'WuhanFood',
    title: '武汉周末美食之旅',
    date: '2024-01-20',
    view: () => import('../views/WuhanFoodView.vue')
  },
  {
    slug: 'changsha',
    name: 'Changsha',
    title: '长沙两天行程规划',
    date: '2024-01-01',
    view: () => import('../views/ChangshaView.vue')
  }
]

// 首页 Blog 列表用的形态（BlogSection 直接消费）
export const blogPosts = posts.map((p, i) => ({
  id: i + 1,
  title: p.title,
  date: p.date,
  link: `/${p.slug}`
}))

// 路由表用的形态（router/index.js 直接展开）
export const postRoutes = posts.map((p) => ({
  path: `/${p.slug}`,
  name: p.name,
  component: p.view
}))

// 中文日期形态，给文章页头部用，避免正文里再写死一份日期
export const postDateCN = (slug) => {
  const p = posts.find((x) => x.slug === slug)
  if (!p) return ''
  const [y, m, d] = p.date.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

// ISO 日期形态，给用 <time> 标签的文章页（如 SteadyHaven）
export const postDate = (slug) => posts.find((x) => x.slug === slug)?.date || ''
