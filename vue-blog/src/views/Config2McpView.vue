<template>
  <div class="article-view">
    <article class="article-content">
      <h1>config2mcp：一份 YAML，把任意命令行变成 Agent 工具</h1>
      <div class="article-meta">
        <span>{{ date }}</span>
        <span class="post-views" id="busuanzi_container_page_pv">阅读 <b id="busuanzi_value_page_pv">–</b></span>
      <LikeButton slug="config2mcp" />
        <span>开源</span>
      </div>

      <div class="article-body">
        <section>
          <h2>它解决什么问题</h2>
          <p>Agent 能做的事，取决于你给了它哪些工具。现实是反过来的：<code>ffmpeg</code>、<code>kubectl</code>、<code>pdftk</code>、<code>imagemagick</code>、<code>git</code> 这些身经百战的命令行工具，Agent 一个都够不着——想让它们可用，每包一个就得写一个完整的 MCP server。</p>
          <p><strong>config2mcp 把「包装」从写代码变成写配置</strong>：一份 YAML 描述命令、参数和类型，它就是一个标准 MCP server。工具名、参数、校验、超时全部由配置声明，Agent 拿到的是一份带类型的白名单。</p>
          <div class="gh-box">
            <a class="gh-link" :href="repo" target="_blank" rel="noopener">github.com/linwanwanwa/config2mcp ↗</a>
            <span class="gh-tag">TypeScript · MIT · npm 包名 <code>config2mcp</code></span>
          </div>
        </section>

        <section>
          <h2>三十秒上手</h2>
          <pre><code>tools:
  - name: probe
    description: Probe a media file, return JSON metadata
    command: ffprobe
    args: ["-print_format", "json", "-show_format"]
    params:
      - name: input
        positional: true
        type: string
        required: true</code></pre>
          <pre><code>npx config2mcp serve ./ffmpeg.yaml</code></pre>
          <p>完事。Agent 现在就多了一个 <code>ffmpeg_probe</code> 工具，参数 <code>input</code> 是必填字符串。要求 Node 18+，不需要全局安装，推荐直接 <code>npx</code> 跑。</p>
        </section>

        <section>
          <h2>安全模型：故意保守</h2>
          <p>这部分是这个项目我最想说的。给 Agent 开命令行口子，最怕的是「一句话把服务器干没了」，config2mcp 的四条设计都是冲着这个来的：</p>
          <h3>永远不走 shell</h3>
          <p>命令用 <code>execve</code> 风格直接 spawn，每个值恰好变成一个 argv token。<code>;</code>、<code>|</code>、反引号这些 shell 元字符没有被解释的机会——<strong>注入不是被过滤掉的，是结构上不可能的</strong>。</p>
          <h3>配置文件就是白名单</h3>
          <p>没写进 YAML 的命令，Agent 根本够不着；写了命令但没声明的 flag，同样传不进去。你暴露什么，Agent 才能用什么。</p>
          <h3>一切有界</h3>
          <p>每条命令默认 30 秒超时；输出封顶 256 KiB，防止一次 <code>cat</code> 把 Agent 的上下文窗口撑爆。</p>
          <h3>失败是数据，不是异常</h3>
          <p>非零退出码、超时，都以可读的结果返回给 Agent，让它自己决定下一步——而不是把 server 打挂。</p>
          <p>README 里也说得直白：你仍然要为「暴露哪些命令」负责——给 Agent <code>rm</code> 它真能删文件。仓库里 <code>examples/git.yaml</code> 特意给了一个只读子命令集的示例，照它抄比较稳。</p>
        </section>

        <section>
          <h2>配套的三个小设计</h2>
          <p><strong>inspect</strong>：<code>npx config2mcp inspect ./echo.yaml</code>，先看看 Agent 视角里这份配置长什么样，再决定要不要 serve。</p>
          <p><strong>validate</strong>：配置语法校验，接 AI 帮你写配置时特别有用。</p>
          <p><strong>One-prompt install</strong>：README 里有一段可直接粘给 Claude / Cursor / 任意 MCP Agent 的安装提示词，它自己完成建配置、校验、注册 client 的全流程。</p>
        </section>

        <section>
          <h2>接入现有客户端</h2>
          <p>任何 MCP client 都一样，以 Claude Desktop 为例，写进 <code>claude_desktop_config.json</code>：</p>
          <pre><code>{
  "mcpServers": {
    "my-cli-tools": {
      "command": "npx",
      "args": ["-y", "config2mcp", "serve", "/absolute/path/to/echo.yaml"]
    }
  }
}</code></pre>
          <p>Claude Code、Cursor、Windsurf 等同理；也提供 Docker 镜像，不想在本机跑 Node 可以直接容器里 serve。</p>
        </section>

        <section>
          <h2>写在最后</h2>
          <p>项目还很新（刚发 <code>0.1.2</code>），但方向我觉得是对的：MCP 生态里最缺的从来不是再写一个 server，而是把「已有的几万个 CLI」低成本接进来。安全模型先于易用性设计，这点在同类工具里少见。</p>
          <p>想看实现或提 issue，仓库在这儿：<a :href="repo" target="_blank" rel="noopener">linwanwanwa/config2mcp</a>。</p>
        </section>
      </div>

      <router-link to="/" class="back-link">
        ← 返回首页
      </router-link>
    </article>
  </div>
</template>

<script setup>
import LikeButton from '../components/LikeButton.vue'
import { postDateCN } from '../content/posts'
const date = postDateCN('config2mcp')
const repo = 'https://github.com/linwanwanwa/config2mcp'
</script>

<style scoped>
.article-view {
  padding: 80px 15px 30px;
  background-color: #f8f9fa;
}

.article-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 60px 50px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

section {
  margin-bottom: 40px;
}

h2 {
  font-size: 22px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 24px 0 12px;
}

p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 12px;
}

pre {
  background: #263238;
  color: #eceff1;
  padding: 18px 20px;
  border-radius: 10px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 14px 0;
}

code {
  font-family: "SF Mono", Menlo, Consolas, monospace;
}

p code, li code {
  background: #eef1f4;
  color: #c0392b;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 13px;
}

.gh-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  padding: 14px 18px;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  background: #f6f8fa;
}

.gh-link {
  font-weight: 600;
  color: #0969da;
  text-decoration: none;
}

.gh-tag {
  color: #666;
  font-size: 13px;
}

.gh-tag code {
  background: #eaeef2;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}

a {
  color: #0969da;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #666;
  text-decoration: none;
}

.back-link:hover {
  color: #f0883e;
}

@media (max-width: 600px) {
  .article-content {
    padding: 40px 25px;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
