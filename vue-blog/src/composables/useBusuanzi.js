// 不蒜子（busuanzi）访问统计：免费、无需后端，PV/UV 由第三方服务统计
// SPA 里路由切换不会自动重新计数，所以每次路由变化后要重新挂载一次脚本
const SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
const SCRIPT_ID = 'busuanzi-script'

export const refreshBusuanzi = () => {
  if (typeof document === 'undefined') return

  document.querySelectorAll('[id^="busuanzi_value"]').forEach((el) => {
    el.textContent = ''
  })

  const old = document.getElementById(SCRIPT_ID)
  if (old) old.remove()

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.src = SRC
  script.onerror = () => {
    // 统计服务不可达时整块隐藏，避免出现「总访问 -」这种半成品
    document.querySelectorAll('[id^="busuanzi_container"]').forEach((el) => {
      el.style.display = 'none'
    })
  }
  document.body.appendChild(script)
}
