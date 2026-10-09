import { reactive } from 'vue'
import { getCloud } from '../lib/cloud'

const state = reactive({
  user: null, // { id, email } 或 null
  ready: false, // 会话是否检查过（用于区分"还没查"和"确定没登录"）
  unavailable: false, // 当前域名不支持登录时为 true
  modalOpen: false,
  modalTab: 'password'
})

let bound = false

const cloud = async () => {
  if (!bound) {
    const c = await getCloud()
    c.auth.onAuthStateChange((_event, session) => {
      state.user = session?.user ?? null
    })
    bound = true
    return c
  }
  return getCloud()
}

export const initAuth = async () => {
  try {
    const c = await cloud()
    const { data: session, error } = await c.auth.getSession()
    if (error) {
      // 未注册的域名（如 localhost / 未发布的域名）不支持 auth，这里不做任何降级伪造
      state.unavailable = true
      state.user = null
    } else {
      state.unavailable = false
      state.user = session?.user ?? null
    }
  } catch (e) {
    state.unavailable = true
    state.user = null
  } finally {
    state.ready = true
  }
}

export const openAuth = (tab = 'password') => {
  state.modalTab = tab
  state.modalOpen = true
}

export const closeAuth = () => {
  state.modalOpen = false
}

export const signOut = async () => {
  const c = await cloud()
  await c.auth.signOut()
  state.user = null
}

// 写操作前的门禁：没登录就弹登录框并返回 false
export const requireAuth = () => {
  if (state.user) return true
  openAuth()
  return false
}

export const getClient = cloud
export const useAuth = () => state
