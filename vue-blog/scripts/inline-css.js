// 构建后处理：把 dist 里唯一的 CSS 文件内联进 index.html
// 目的：慢网（GitHub Pages 国内动辄几秒一个往返）下消除一次渲染阻塞请求
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const findFile = (dir, name) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      const hit = findFile(full, name)
      if (hit) return hit
    } else if (entry === name) {
      return full
    }
  }
  return null
}

const dist = resolve(process.cwd(), 'dist')
const htmlPath = resolve(dist, 'index.html')
if (!existsSync(htmlPath)) {
  console.error('[inline-css] dist/index.html 不存在，先执行 vite build')
  process.exit(1)
}

let html = readFileSync(htmlPath, 'utf8')
const match = html.match(/<link[^>]+rel="stylesheet"[^>]*>/)
if (!match) {
  console.log('[inline-css] 没有找到外链 CSS，跳过')
  process.exit(0)
}

const hrefMatch = match[0].match(/href="([^"]+)"/)
const cssName = hrefMatch[1].split('/').pop()
const cssPath = findFile(dist, cssName)
if (!existsSync(cssPath)) {
  console.error(`[inline-css] 找不到 CSS 文件：${cssPath}`)
  process.exit(1)
}

const css = readFileSync(cssPath, 'utf8')
if (css.includes('</style>')) {
  console.error('[inline-css] CSS 里含有 </style>，跳过内联以避免破坏 HTML')
  process.exit(1)
}

html = html.replace(match[0], `<style>${css}</style>`)
writeFileSync(htmlPath, html)
console.log(`[inline-css] 已内联 ${cssName}（${(css.length / 1024).toFixed(1)} kB）→ index.html`)
