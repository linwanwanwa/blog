<template>
  <div class="guestbook">
    <header class="gb-header">
      <span class="gb-cat">Guestbook</span>
      <h1>留言簿</h1>
      <p class="gb-sub">随便说点什么 —— 不需要登录，写下即送达。</p>
    </header>

    <div v-if="!auth.user" class="gb-gate">
      <span>{{ auth.unavailable ? '当前域名不支持登录，留言暂不可用' : '登录后即可留言（邮箱验证码即可）' }}</span>
      <button type="button" class="gb-btn" @click="openAuth()" :disabled="auth.unavailable">邮箱登录</button>
    </div>
    <div v-else class="gb-me">
      以 <b>{{ auth.user.email }}</b> 的身份留言
      <button type="button" class="gb-link" @click="openAuth()">切换账号</button>
    </div>

    <form class="gb-form" @submit.prevent="submit">
      <div class="gb-field">
        <input
          v-model="form.nickname"
          type="text"
          maxlength="24"
          placeholder="你的名字"
          class="gb-input"
          :disabled="sending || !auth.user"
        />
      </div>
      <div class="gb-field">
        <textarea
          v-model="form.content"
          maxlength="500"
          rows="4"
          placeholder="留下一句话…"
          class="gb-input"
          :disabled="sending || !auth.user"
        ></textarea>
        <span class="gb-count">{{ form.content.length }}/500</span>
      </div>
      <div class="gb-actions">
        <span class="gb-tip" v-if="cooldown > 0">请 {{ cooldown }} 秒后再试</span>
        <button type="submit" class="gb-btn" :disabled="sending || cooldown > 0">
          {{ sending ? '发送中…' : '发送留言' }}
        </button>
      </div>
      <p class="gb-msg" :class="msgType" v-if="msg">{{ msg }}</p>
    </form>

    <div class="gb-list-wrap">
      <div class="gb-list-head">
        <h2>全部留言</h2>
        <span class="gb-total">{{ total ? `共 ${total} 条` : '' }}</span>
      </div>

      <div v-if="loading" class="gb-state">加载中…</div>
      <div v-else-if="loadError" class="gb-state error">
        留言暂时取不到：{{ loadError }}
        <button class="gb-retry" @click="load">重试</button>
      </div>
      <div v-else-if="messages.length === 0" class="gb-state">还没有人留言，来当第一个。</div>

      <ul v-else class="gb-list">
        <li v-for="m in messages" :key="m.id" class="gb-item">
          <div class="gb-item-head">
            <span class="gb-avatar">{{ m.nickname.slice(0, 1).toUpperCase() }}</span>
            <div class="gb-meta">
              <span class="gb-name">{{ m.nickname }}</span>
              <time class="gb-time">{{ formatTime(m.created_at) }}</time>
            </div>
          </div>
          <p class="gb-content">{{ m.content }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { getCloud } from '../lib/cloud'
import { useAuth, requireAuth, openAuth } from '../stores/auth'

const messages = ref([])
const total = ref(0)
const auth = useAuth()
const loading = ref(true)
const loadError = ref('')
const sending = ref(false)
const msg = ref('')
const msgType = ref('')
const cooldown = ref(0)

const form = reactive({ nickname: '', content: '' })
let timer = null

const COOLDOWN_KEY = 'guestbook_last_submit'
const COOLDOWN_SEC = 60

const tickCooldown = () => {
  const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
  const left = Math.ceil((COOLDOWN_SEC * 1000 - (Date.now() - last)) / 1000)
  cooldown.value = left > 0 ? left : 0
}

const formatTime = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const load = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const cloud = await getCloud()
    const { data, error, count } = await cloud.database
      .from('guestbook_messages')
      .select('id, nickname, content, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    messages.value = data || []
    total.value = count || 0
  } catch (e) {
    loadError.value = e?.message || '网络异常'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  msg.value = ''
  if (!requireAuth()) return say('请先登录再留言', 'error')
  const nickname = form.nickname.trim()
  const content = form.content.trim()
  if (!nickname) return say('请填写名字', 'error')
  if (!content) return say('留言内容不能为空', 'error')
  if (cooldown.value > 0) return say(`请 ${cooldown.value} 秒后再试`, 'error')

  sending.value = true
  try {
    const cloud = await getCloud()
    const { error } = await cloud.database
      .from('guestbook_messages')
      .insert({ nickname, content })
      .select()
    if (error) throw error

    localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
    tickCooldown()
    form.content = ''
    say('已送达，谢谢你的留言', 'ok')
    await load()
  } catch (e) {
    say(e?.message || '发送失败，请稍后再试', 'error')
  } finally {
    sending.value = false
  }
}

const say = (text, type) => {
  msg.value = text
  msgType.value = type
  clearTimeout(timer)
  timer = setTimeout(() => { msg.value = '' }, 4000)
}

onMounted(() => {
  tickCooldown()
  if (cooldown.value > 0) {
    const iv = setInterval(() => {
      tickCooldown()
      if (cooldown.value <= 0) clearInterval(iv)
    }, 1000)
  }
  load()
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.guestbook {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 0 20px;
}

.gb-header { margin-bottom: 48px; }
.gb-cat {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 16px;
}
.gb-header h1 { font-size: 36px; font-weight: 700; margin-bottom: 12px; }
.gb-sub { color: var(--text-secondary); font-size: 15px; }

.gb-gate,
.gb-me {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  border: 1px dashed var(--border-hover);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--text-secondary);
}
.gb-gate .gb-btn { padding: 8px 18px; font-size: 13px; }
.gb-me b { color: var(--text-primary); font-weight: 600; }
.gb-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 13px;
  cursor: pointer;
}

.gb-form {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  background: var(--bg-card);
  margin-bottom: 56px;
}
.gb-field { position: relative; margin-bottom: 14px; }
.gb-input {
  width: 100%;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-primary);
  resize: vertical;
  transition: border-color 0.25s ease;
}
.gb-input:focus { outline: none; border-color: var(--accent); }
.gb-input::placeholder { color: var(--text-muted); }
.gb-count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.gb-actions { display: flex; align-items: center; gap: 14px; }
.gb-tip { font-size: 12px; color: var(--text-muted); }
.gb-btn {
  padding: 11px 26px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.gb-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
.gb-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.gb-msg { margin-top: 12px; font-size: 13px; }
.gb-msg.ok { color: #2f9e6f; }
.gb-msg.error { color: #d1544a; }

.gb-list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}
.gb-list-head h2 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
}
.gb-total { font-size: 12px; color: var(--text-muted); }

.gb-state { padding: 32px 0; text-align: center; color: var(--text-muted); font-size: 14px; }
.gb-state.error { color: #d1544a; }
.gb-retry {
  margin-left: 10px;
  background: none;
  border: 1px solid var(--border-hover);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
}

.gb-list { list-style: none; }
.gb-item {
  padding: 22px 0;
  border-top: 1px solid var(--border-color);
  animation: gbIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes gbIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.gb-item-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.gb-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}
.gb-meta { display: flex; flex-direction: column; }
.gb-name { font-size: 14px; font-weight: 600; }
.gb-time { font-size: 11px; color: var(--text-muted); }
.gb-content {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

@media (prefers-reduced-motion: reduce) {
  .gb-item { animation: none; }
}
</style>
