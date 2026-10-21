# Supabase 迁移方案

> 背景：计划把 WorkBuddy Cloud 换成 Supabase（保留邮箱登录 + 留言簿 + 点赞）。
> 本文所有 API 差异均已对照两个 SDK 的真实类型定义逐行核实过，不是凭印象。

## 一、先说结论：这不是「平移」，是「重写 auth 层」

上一轮我给的选项写的是「database 调用零改动、auth 六个方法名几乎一一对应」。**这个判断经核实是错的**，必须先纠正。

核实过程：`npm i @supabase/supabase-js`（2.118.0），读 `node_modules/@supabase/auth-js/dist/module/GoTrueClient.d.ts` 与 `lib/types.d.ts`，再读 WorkBuddy SDK 自带的 `lib/index.d.ts`（6835 行）。

### 1. Database 层——确实几乎零改动 ✓

| 现有写法 | Supabase 等价 | 核实依据 |
|---|---|---|
| `cloud.database` | `supabase.from` | 需把 `.database.from('t')` 收成 `.from('t')`，机械替换 |
| `.select(cols, { count: 'exact' })` | 完全相同 | postgrest-js `select()` 形参即 `{head?, count?}` |
| `.select('*', { count: 'exact', head: true })` | 完全相同 | 同上 |
| `.eq / .order / .limit / .insert / .delete` | 完全相同 | PostgrestFilter/TransformBuilder |
| 返回 `{data, error, count}` | 完全相同 | PostgrestBuilder `count: number \| null` |

改动量：[stores/auth.js](../vue-blog/src/stores/auth.js) 不涉及；只有 [LikeButton.vue](../vue-blog/src/components/LikeButton.vue) 和 [GuestbookView.vue](../vue-blog/src/views/GuestbookView.vue) 里 `cloud.database.from(` → `supabase.from(`，共 6 处。

### 2. Auth 层——四处不兼容，必须重写 ✗

WorkBuddy 的 OTP 是「**一次发码、同时覆盖登录与注册**」模型，Supabase 不是。逐条：

**① `sendOtp` 不存在**
- WorkBuddy：`auth.sendOtp({email}) → { verificationId, isExistingUser }`
- Supabase：`auth.signInWithOtp({email}) → { user, session, messageId }`
- 差异：**没有 `verificationId`**。Supabase 的 verify 不需要外部返回的 id。

**② `verifyOtp` 参数语义完全不同（最关键的一处）**
- WorkBuddy：`verifyOtp({ email, verificationId, isExistingUser, token, password? })`
  —— `isExistingUser` 决定这次验码是「登录」还是「注册」，**一个入口两用**
- Supabase：`verifyOtp({ email, token, type })`
  —— `type` 是 `EmailOtpType`：`'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'`
- 影响：AuthModal 的「验证码登录」和「注册」两个 tab，在 Supabase 下必须拆成两条独立链路：
  - 验证码登录 = `signInWithOtp({ email, options: { shouldCreateUser: false } })` → `verifyOtp({type:'email'})`
  - 注册 = `signUp({ email, password, options: { data? } })` → 确认邮件 → `verifyOtp({type:'signup'})`
  - 现有「首次使用自动建号」（[AuthModal.vue:59](../vue-blog/src/components/AuthModal.vue)）的文案与逻辑**在 Supabase 免费版无法原样实现**（OTP 邮件模板不支持动态改文案）。

**③ `resetPasswordForEmail(...).data.updateUser(...)` 不存在**
- WorkBuddy：返回 `PasswordResetChallenge`，其上有 `updateUser({ nonce, password })`
- Supabase：返回 `{ data: {}, error }`，**空对象，没有任何方法**
- 且 Supabase 的 `updateUser({nonce, password})` 里 `nonce` 注释明确写「Call `reauthenticate()` to obtain the nonce first」——是**已登录用户改密**用的，不是找回密码。
- 正确做法：必须走**带 redirect 的完整流程**：
  `resetPasswordForEmail(email, { redirectTo: 'https://…/#auth=recovery' })`
  → 用户点邮件链接 → 落地页解析 hash 里的 `token_hash` → `verifyOtp({ token_hash, type: 'recovery' })` 建立会话 → `updateUser({ password })`
- 这是当前 SPA 架构里**唯一需要新增路由/落地页**的部分。

**④ `onAuthStateChange` 与 `getSession` 兼容 ✓**
- `getSession()` 返回 `{ data: { session }, error }` —— 现有 `session?.user` 写法不用改
- `onAuthStateChange((event, session) => …)` 签名一致
- 注意：Supabase 默认会占用一个 `publishable key` 下的 session 存储键，与 WorkBuddy 的 `workbuddy-cloud.session.` 前缀不同，**用户切换后端后需重新登录一次**（旧会话自动失效，可接受）。

### 3. 错误处理
- WorkBuddy `error.kind`（`invalid_grant` / `network` / `backend-unavailable`，见 [AuthModal.vue:138-143](../vue-blog/src/components/AuthModal.vue)）
- Supabase 是 `AuthApiError { message, status, code }`，`code` 是字符串（如 `'invalid_credentials'`、`'email_not_confirmed'`）
- `fail()` 函数的映射表要按 `code` + `status` 重写。

## 二、数据迁移（必须做，否则线上留言和点赞清零）

WorkBuddy 底层是 Supabase 兼容协议（SDK 源码里出现 `rest/v1`、`@supabase/postgrest-js`），所以**可以在浏览器里用同一个 SDK 分别连旧新两端，边读边写**，无需数据库权限。

脚本 `vue-blog/scripts/migrate-to-supabase.mjs`：

```js
// 一次性迁移脚本：旧端读 → 新端写。跑前先在两端确认表结构一致。
// 用 VITE_ 之外的显式注入，避免误连生产：
//   WB_URL=... WB_KEY=... SB_URL=... SB_KEY=... node scripts/migrate-to-supabase.mjs
const OLD = (await import('@supabase/supabase-js')).createClient(
  process.env.WB_URL, process.env.WB_KEY, { global: { headers: {
    'apikey': process.env.WB_KEY, 'Authorization': `Bearer ${process.env.WB_KEY}` } } })
const NEW = (await import('@supabase/supabase-js')).createClient(process.env.SB_URL, process.env.SB_KEY)

const tables = ['guestbook_messages', 'post_likes']
for (const t of tables) {
  let from = 0, PAGE = 200, all = 0
  while (true) {
    const { data, error } = await OLD.from(t).select('*').range(from, from + PAGE - 1)
    if (error) throw new Error(`${t} 读失败: ${error.message}`)
    if (!data?.length) break
    // service_role key 下需带 id 保留主键；用 anon key 会因 RLS 拒绝显式 id
    const { error: e2 } = await NEW.from(t).insert(data)
    if (e2) throw new Error(`${t} 写失败: ${e2.message}`)
    all += data.length; from += PAGE
    if (data.length < PAGE) break
  }
  console.log(`${t}: ${all} 行`)
}
```

运行前提：
1. Supabase 端建两张表，列名/类型与旧端完全一致（`guestbook_messages(id, nickname, content, created_at)`、`post_likes(id, post_slug, owner_id, created_at)`，后者的 `post_slug` 值就是 [posts.js](../vue-blog/src/content/posts.js) 的 slug）
2. 旧端用只读 key 或 anon key + 临时放开 RLS；新端导入期用 `service_role` key，导完立刻改回严格 RLS
3. **迁移完再切前端代码**，中间用脚本幂等重跑补齐增量

## 三、Supabase 端 RLS 策略（照抄即可）

```sql
-- 留言：公开读；登录后可写，只能写自己的
alter table guestbook_messages enable row level security;
create policy "gb_read" on guestbook_messages for select using (true);
create policy "gb_insert" on guestbook_messages for insert to authenticated with check (auth.uid() = owner_id);

-- 点赞：公开读总数；登录后可增删自己那一行
alter table post_likes enable row level security;
create policy "like_read" on post_likes for select using (true);
create policy "like_insert" on post_likes for insert to authenticated with check (auth.uid() = owner_id);
create policy "like_delete" on post_likes for delete to authenticated using (auth.uid() = owner_id);
```

现有代码有隐私意识（LikeButton 只 `select('id')` 不拉别人 `owner_id`），配合上面策略即可保持。
注意 `guestbook_messages` 需要补一个 `owner_id uuid` 列（当前 WorkBuddy 侧是否已有该列需确认；若没有，留言簿写策略只能退化为 `to authenticated with check (true)`，届时任何人都能改自己 uid 的行）。

## 四、国内可达性（与项目一贯取向冲突，需实测）

项目里有三处注释为「慢网优化」而生（[vite.config.js](../vue-blog/vite.config.js) 的 `cssCodeSplit:false`、[inline-css.js](../vue-blog/scripts/inline-css.js)、[router/index.js](../vue-blog/src/router/index.js) 首页静态引入）。Supabase 默认域名 `*.supabase.co` 在国内**无专用节点，实测常 1–3 秒 RTT 甚至不稳**。

三个缓解手段（按性价比）：
1. **选新加坡区域**建项目（离大陆近），别选 `us-east`
2. **自定义域名 + Cloudflare**：Supabase 支持 custom domain，套一层 CF 后走 CF 边缘，国内可直连且能规避部分 SNI 干扰
3. 若实测仍不可接受 → 回到方案讨论，考虑原选项里另一个「去后端化」路线

**建议动手前先做这一步**：把候选 Supabase 项目建好，用一行 `fetch` 在目标网络下测 `/rest/v1/` 的延迟，再决定要不要继续。

## 五、前端改动清单（按文件）

| 文件 | 改动 | 量 |
|---|---|---|
| [src/lib/cloud.js](../vue-blog/src/lib/cloud.js) | 改为 `createClient(VITE_SB_URL, VITE_SB_KEY)`，导出名 `getSupabase`；配置进 `.env` | 27 行 → ~35 行 |
| [src/stores/auth.js](../vue-blog/src/stores/auth.js) | `c.auth.*` 保留；`cloud()` 返回 supabase client；`state.unavailable` 逻辑可删（Supabase 不锁域名） | 小改 |
| [src/components/AuthModal.vue](../vue-blog/src/components/AuthModal.vue) | **主要工作量**：`sendOtp/verifyOtp` 拆链路、删 `pending.verificationId/isExistingUser`、重写 `fail()` 映射、找回密码改走 redirect | ~120 行 |
| 新增 `src/views/AuthCallbackView.vue` + 路由 | 承接 recovery 的 `#auth=recovery` 落地 | ~40 行 |
| [src/components/LikeButton.vue](../vue-blog/src/components/LikeButton.vue) | `cloud.database.from` → `sb.from` | 2 行 |
| [src/views/GuestbookView.vue](../vue-blog/src/views/GuestbookView.vue) | 同上 | 2 行 |
| [package.json](../vue-blog/package.json) | 卸 `@tencent-ai/workbuddy-cloud-sdk`，装 `@supabase/supabase-js` | — |
| `.gitignore` | 已有 `.env`；补 `.env.production` | 1 行 |

**注意 public key 的处理**：现在 endpoint/publishableKey 是硬编码明文写在 `lib/cloud.js` 里的。前端 anon/publishable key 本就是公开的，写死没问题；但 **`service_role` key 绝对不能进仓库**。迁移脚本用环境变量注入即可。若希望配置也不进 git，改走 `VITE_SB_URL/VITE_SB_KEY` + `.env`，Vite 会打进产物（本质仍是公开），只是让仓库里看不到。

## 六、工作量与风险汇总

- Database 层：**~10 分钟**，机械替换
- Auth 层重写：**1–2 天**，含找回密码 redirect 流程与回归测试（4 个 tab × 成功/失败/过期）
- 数据迁移脚本 + 执行：**半天**
- 可达性实测：**先做这个**，0.5 小时，结论决定要不要继续
- 回滚：后端切换是纯前端配置变更 + 一次发布，`git revert` 即回

风险排序：
1. 🔴 **找回密码流程必须加 redirect 路由** —— 现有架构完全没有 hash 落地页，这是唯一需要新增页面结构的点
2. 🔴 国内到 Supabase 的实际延迟未测
3. 🟡 「首次使用自动建号」体验在 Supabase 下不同，需接受产品行为变化
4. 🟡 `guestbook_messages.owner_id` 列是否存在需确认，影响 RLS 严格程度
