<template>
  <div v-if="auth.modalOpen" class="auth-mask" @click.self="close">
    <div class="auth-card" role="dialog" aria-modal="true">
      <button class="auth-close" @click="close" aria-label="关闭">×</button>
      <h2 class="auth-title">{{ title }}</h2>

      <div class="auth-tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="auth-tab"
          :class="{ active: auth.modalTab === t.key }"
          @click="switchTab(t.key)"
        >{{ t.label }}</button>
      </div>

      <form @submit.prevent="onSubmit">
        <label class="auth-field">
          <span>邮箱</span>
          <input v-model.trim="email" type="email" required placeholder="you@example.com" autocomplete="email" />
        </label>

        <label v-if="needsPassword" class="auth-field">
          <span>密码</span>
          <input v-model="password" type="password" required placeholder="至少 6 位" autocomplete="current-password" />
        </label>

        <label v-if="auth.modalTab === 'signup'" class="auth-field">
          <span>确认密码</span>
          <input v-model="confirmPassword" type="password" required placeholder="再输入一次" autocomplete="new-password" />
        </label>

        <label v-if="needsCode" class="auth-field">
          <span>邮箱验证码</span>
          <div class="auth-inline">
            <input v-model="code" required placeholder="6 位验证码" inputmode="numeric" />
            <button type="button" class="auth-code-btn" :disabled="sending || countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}s` : sending ? '发送中' : '获取验证码' }}
            </button>
          </div>
        </label>

        <p v-if="notice" class="auth-notice">{{ notice }}</p>
        <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

        <button type="submit" class="auth-submit" :disabled="submitting">
          {{ submitting ? '处理中…' : title }}
        </button>
      </form>

      <p class="auth-foot">
        <template v-if="auth.unavailable">
          当前域名未发布到应用正式域名，登录不可用。
        </template>
        <template v-else-if="auth.user">
          已登录：{{ maskEmail(auth.user.email) }}
          <button class="auth-link" @click="doSignOut">退出</button>
        </template>
        <template v-else>邮箱即账号，首次使用会自动建号。</template>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useAuth, closeAuth, signOut, getClient } from '../stores/auth'

const auth = useAuth()

const tabs = [
  { key: 'password', label: '密码登录' },
  { key: 'otp', label: '验证码登录' },
  { key: 'signup', label: '注册' },
  { key: 'reset', label: '找回密码' }
]

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const code = ref('')
const sending = ref(false)
const submitting = ref(false)
const countdown = ref(0)
const errorMsg = ref('')
const notice = ref('')

// 发送验证码后必须保住 challenge，校验时复用；不能在下一次提交时重新发送
let pending = null
let timer = null

const title = computed(() => tabs.find((t) => t.key === auth.modalTab)?.label || '登录')
const needsPassword = computed(() => auth.modalTab === 'password' || auth.modalTab === 'signup')
const needsCode = computed(() => auth.modalTab === 'otp' || auth.modalTab === 'signup' || auth.modalTab === 'reset')

const reset = () => {
  errorMsg.value = ''
  notice.value = ''
  password.value = ''
  confirmPassword.value = ''
  code.value = ''
  pending = null
}

const switchTab = (key) => {
  auth.modalTab = key
  reset()
}

const close = () => {
  stopTimer()
  reset()
  closeAuth()
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
  timer = null
}

const startCountdown = () => {
  countdown.value = 60
  stopTimer()
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) stopTimer()
  }, 1000)
}

const maskEmail = (e) => {
  if (!e || !e.includes('@')) return e
  const [name, domain] = e.split('@')
  const head = name.slice(0, 2)
  return `${head}***@${domain}`
}

const fail = (error, fallback) => {
  const kind = error?.kind
  if (kind === 'invalid_grant' || kind === 'unauthenticated') errorMsg.value = '信息不对，或需要重新登录'
  else if (kind === 'network' || kind === 'backend-unavailable') errorMsg.value = '网络不太稳，稍后再试'
  else errorMsg.value = error?.message || fallback
}

const sendCode = async () => {
  if (!email.value) {
    errorMsg.value = '先填邮箱'
    return
  }
  sending.value = true
  errorMsg.value = ''
  notice.value = ''
  try {
    const cloud = await getClient()
    const { data, error } = await cloud.auth.sendOtp({ email: email.value })
    if (error) return fail(error, '验证码发送失败')
    pending = {
      email: email.value,
      verificationId: data.verificationId,
      isExistingUser: data.isExistingUser
    }
    startCountdown()
    notice.value = '验证码已发送，查收邮箱（含垃圾邮件）'
  } catch (e) {
    fail(e, '验证码发送失败')
  } finally {
    sending.value = false
  }
}

const otpReady = () => {
  if (!pending || pending.email !== email.value) {
    errorMsg.value = '请先为当前邮箱获取验证码'
    return false
  }
  return true
}

const doOtpLogin = async (cloud) => {
  if (!otpReady()) return
  const { data, error } = await cloud.auth.verifyOtp({
    email: pending.email,
    verificationId: pending.verificationId,
    isExistingUser: pending.isExistingUser,
    token: code.value
  })
  if (error) return fail(error, '验证码不正确')
  return data
}

const doSignup = async (cloud) => {
  if (!otpReady()) return
  if (password.value.length < 6) {
    errorMsg.value = '密码至少 6 位'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次密码不一致'
    return
  }
  const { data, error } = await cloud.auth.verifyOtp({
    email: pending.email,
    verificationId: pending.verificationId,
    isExistingUser: pending.isExistingUser,
    token: code.value,
    password: pending.isExistingUser ? undefined : password.value
  })
  if (error) return fail(error, '注册失败')
  return data
}

const doPasswordLogin = async (cloud) => {
  const { data, error } = await cloud.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) return fail(error, '邮箱或密码不对')
  return data
}

const doReset = async (cloud) => {
  if (!otpReady()) return
  const started = await cloud.auth.resetPasswordForEmail(pending.email)
  if (started.error) return fail(started.error, '重置邮件发送失败')
  if (password.value.length < 6) {
    errorMsg.value = '新密码至少 6 位'
    return
  }
  const done = await started.data.updateUser({ nonce: code.value, password: password.value })
  if (done.error) return fail(done.error, '重置失败')
  return done.data
}

const onSubmit = async () => {
  errorMsg.value = ''
  submitting.value = true
  try {
    const cloud = await getClient()
    if (auth.modalTab === 'password') await doPasswordLogin(cloud)
    else if (auth.modalTab === 'otp') await doOtpLogin(cloud)
    else if (auth.modalTab === 'signup') await doSignup(cloud)
    else await doReset(cloud)

    if (errorMsg.value) return
    stopTimer()
    reset()
    closeAuth()
  } catch (e) {
    fail(e, '操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

const doSignOut = async () => {
  await signOut()
  errorMsg.value = ''
}

onBeforeUnmount(stopTimer)
</script>

<style scoped>
.auth-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: fadeIn 0.25s ease;
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px 26px 22px;
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }

.auth-close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
}
.auth-close:hover { color: var(--text-primary); }

.auth-title { font-size: 19px; font-weight: 600; margin-bottom: 18px; }

.auth-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 4px;
}
.auth-tab {
  flex: 1;
  padding: 7px 4px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
}
.auth-tab.active { background: var(--bg-card); color: var(--text-primary); font-weight: 600; }

.auth-field { display: block; margin-bottom: 14px; }
.auth-field span {
  display: block;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.auth-field input {
  width: 100%;
  padding: 11px 13px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
}
.auth-field input:focus { outline: none; border-color: var(--accent); }

.auth-inline { display: flex; gap: 8px; }
.auth-inline input { flex: 1; }
.auth-code-btn {
  flex-shrink: 0;
  padding: 0 12px;
  border: 1px solid var(--border-hover);
  border-radius: 9px;
  background: none;
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
  white-space: nowrap;
}
.auth-code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-notice { font-size: 12px; color: #2f9e6f; margin-bottom: 10px; }
.auth-error { font-size: 12px; color: #d1544a; margin-bottom: 10px; }

.auth-submit {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.auth-submit:hover:not(:disabled) { background: var(--accent-hover); }
.auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-foot {
  margin-top: 14px;
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
}
.auth-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 11px;
  cursor: pointer;
  margin-left: 6px;
}
</style>
