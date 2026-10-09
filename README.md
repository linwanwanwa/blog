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

仓库根目录的 `index.html` + `assets/` 就是线上产物，由 `vue-blog/dist` 手动同步而来；`vue-blog/dist` 本身已被 `.gitignore` 排除。更新线上站点的步骤：

```bash
cd vue-blog
npm run build          # 产物在 vue-blog/dist

cd ..
cp vue-blog/dist/index.html ./index.html
cp vue-blog/dist/index.html ./404.html   # SPA 深链刷新用，必须与 index.html 同步更新
rsync -a --delete vue-blog/dist/assets/ ./assets/   # 自动清掉上一版的旧文件
git add -A && git commit -m "Update build" && git push
```

注意：`404.html` 必须与 `index.html` 完全一致且同步更新，否则文章页刷新会 404。

## 项目结构

```
vue-blog/
├── src/
│   ├── components/    # 组件
│   ├── views/        # 页面
│   ├── router/       # 路由
│   ├── stores/      # 状态管理
│   └── assets/      # 静态资源
└── public/          # 公共资源
```

## 特性

- 响应式设计
- 深浅色主题切换（根据时间自动切换）
- 毛玻璃效果
- iOS 风格背景
