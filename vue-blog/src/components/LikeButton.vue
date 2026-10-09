<template>
  <button
    class="like-btn"
    :class="{ on: liked, pulse: justLiked }"
    :disabled="!ready"
    @click="toggle"
    :title="liked ? '取消点赞' : '点赞这篇'"
  >
    <svg class="heart" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.3-9.3 9-9.3 9z" />
    </svg>
    <span class="like-count">{{ count }}</span>
  </button>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getClient } from '../stores/auth'
import { useAuth, requireAuth } from '../stores/auth'

const props = defineProps({
  slug: { type: String, required: true }
})

const auth = useAuth()
const count = ref(0)
const liked = ref(false)
const ready = ref(false)
const justLiked = ref(false)

const uid = computed(() => auth.user?.id || null)

const loadCount = async () => {
  const cloud = await getClient()
  const { count: total } = await cloud.database
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_slug', props.slug)
  count.value = total || 0
}

// 只查自己那一行的 id，不拉取别人的 owner_id
const loadMine = async () => {
  const id = uid.value
  if (!id) {
    liked.value = false
    return
  }
  const cloud = await getClient()
  const { data } = await cloud.database
    .from('post_likes')
    .select('id')
    .eq('post_slug', props.slug)
    .eq('owner_id', id)
    .limit(1)
  liked.value = Array.isArray(data) && data.length > 0
}

const refresh = async () => {
  try {
    await Promise.all([loadCount(), loadMine()])
  } catch (e) {
    // 计数取不到就保持 0，不打断阅读
  } finally {
    ready.value = true
  }
}

const toggle = async () => {
  if (!requireAuth()) return
  if (!ready.value) return

  const prev = liked.value
  liked.value = !prev
  count.value = Math.max(0, count.value + (prev ? -1 : 1))
  justLiked.value = !prev
  setTimeout(() => { justLiked.value = false }, 500)

  try {
    const cloud = await getClient()
    if (prev) {
      await cloud.database
        .from('post_likes')
        .delete()
        .eq('post_slug', props.slug)
        .eq('owner_id', uid.value)
    } else {
      const { error } = await cloud.database
        .from('post_likes')
        .insert({ post_slug: props.slug })
      if (error) throw error
    }
    await loadCount()
  } catch (e) {
    liked.value = prev
    count.value = Math.max(0, count.value + (prev ? 1 : -1))
  }
}

watch(uid, () => loadMine())
onMounted(refresh)
</script>

<style scoped>
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-hover);
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.like-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.like-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.heart {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linejoin: round;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.like-btn.on {
  border-color: var(--accent);
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
.like-btn.on .heart { fill: currentColor; }
.like-btn.pulse .heart { animation: pop 0.45s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes pop {
  0% { transform: scale(1); }
  35% { transform: scale(1.45); }
  100% { transform: scale(1); }
}

.like-count { font-variant-numeric: tabular-nums; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .like-btn.pulse .heart { animation: none; }
}
</style>
