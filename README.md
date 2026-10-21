# Linwan's Blog

个人博客网站，基于 Vue 3 + Vite 构建。

## 技术栈

- Vue 3
- Vue Router
- Vite

## 运行项目

```bash
cd vue-blog
npm install
npm run dev
```

## 部署（GitHub Pages）

线上站点由 **GitHub Actions 自动部署**：推送到 `main` 分支即触发 `.github/workflows/deploy-pages.yml`，自动执行 `npm run build` 并把产物发布到 Pages（`404.html` 由同一次构建复制生成，天然与 `index.html` 一致）。

仓库根目录的 `index.html` + `404.html` + `assets/` 是**本地预览用的构建快照**，不是发布来源；每次改完源码后建议同步一次快照（下面命令），保持仓库里可直接双击预览：

```bash
cd vue-blog
npm run build          # 产物在 vue-blog/dist

cd ..
cp vue-blog/dist/index.html ./index.html
cp vue-blog/dist/index.html ./404.html
rsync -a --delete vue-blog/dist/assets/ ./assets/
```

首次使用需在 GitHub 仓库 Settings → Pages 把 Source 设为 **GitHub Actions**。

> 历史约束（已废弃）：过去靠手工 cp 且要求「404.html 必须与 index.html 同步更新，否则文章页刷新 404」，现在由 workflow 物理保证一致性。

## 项目结构

```
vue-blog/
├── src/
│   ├── components/    # 组件
│   ├── views/         # 页面
│   ├── router/        # 路由（文章路由由 content/posts.js 生成）
│   ├── content/       # posts.js：文章清单唯一事实源（新增文章只改这里 + 建 view）
│   ├── stores/        # 状态管理
│   ├── lib/           # 云服务 SDK 封装
│   └── assets/        # 静态资源
└── public/            # 公共资源
```

## 特性

- 响应式设计
- 深浅色主题切换（根据时间自动切换）
- 毛玻璃效果
- iOS 风格背景
