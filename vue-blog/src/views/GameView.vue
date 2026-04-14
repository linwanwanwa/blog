<template>
  <div class="game-view">
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        <div id="ui" v-if="gameState === 'playing'">
            <div class="player-info p1" v-if="mode === 'single' || mode === 'double'">
                <div class="player-name">{{ mode === 'single' ? '玩家' : '玩家 1 - WASD' }}</div>
                <div class="player-stats">体型: <span id="size1">20</span></div>
                <div class="score">得分: <span id="score1">0</span></div>
                <div class="lives">生命: <span id="lives1">♥♥♥♥♥</span></div>
            </div>
            <div class="player-info p2" v-if="mode === 'double'">
                <div class="player-name">玩家 2 - 方向键</div>
                <div class="player-stats">体型: <span id="size2">20</span></div>
                <div class="score">得分: <span id="score2">0</span></div>
                <div class="lives">生命: <span id="lives2">♥♥♥♥♥</span></div>
            </div>
            <div class="player-info" v-if="mode === 'single'">
                <div class="player-name">关卡: <span id="levelDisplay">1</span></div>
                <div class="player-stats">速度: <span id="speedDisplay">1x</span></div>
            </div>
        </div>
        <div id="warning">⚠ 大鱼来袭!</div>
        <div id="pauseOverlay" v-if="isPaused">
            <h2>⏸ 已暂停</h2>
            <p>按空格键继续</p>
        </div>
        
        <div id="gameMenu" v-if="gameState === 'menu'">
            <h1 class="game-title">🐟 深海大作战</h1>
            <p class="game-subtitle">Big Fish Eat Small Fish</p>
            
            <div class="menu-section">
                <h3>选择模式</h3>
                <div class="mode-buttons">
                    <button class="mode-btn" :class="{ active: selectedMode === 'single' }" @click="selectedMode = 'single'">
                        <span class="mode-icon">🎮</span>
                        <span class="mode-name">单人模式</span>
                        <span class="mode-desc">独自挑战深海</span>
                    </button>
                    <button class="mode-btn" :class="{ active: selectedMode === 'double' }" @click="selectedMode = 'double'">
                        <span class="mode-icon">👥</span>
                        <span class="mode-name">双人模式</span>
                        <span class="mode-desc">与朋友对战</span>
                    </button>
                </div>
            </div>
            
            <div class="menu-section">
                <h3>选择难度</h3>
                <div class="difficulty-buttons">
                    <button v-for="diff in difficulties" :key="diff.id" class="diff-btn" :class="{ active: selectedDifficulty === diff.id }" @click="selectedDifficulty = diff.id">
                        <span class="diff-name">{{ diff.name }}</span>
                        <span class="diff-desc">{{ diff.desc }}</span>
                    </button>
                </div>
            </div>
            
            <button class="start-btn" @click="startGame">开始游戏</button>
            
            <div class="controls-hint">
                <p><strong>单人:</strong> 方向键 / WASD</p>
                <p v-if="selectedMode === 'double'"><strong>双人:</strong> P1用WASD / P2用方向键</p>
            </div>
        </div>
        
        <div id="gameOver">
            <h2 id="winnerText">游戏结束</h2>
            <p id="finalScore"></p>
            <div class="game-over-stats">
                <div class="stat-item"><span class="stat-label">最终关卡</span><span class="stat-value" id="finalLevel">1</span></div>
                <div class="stat-item" v-if="mode === 'single'"><span class="stat-label">最终得分</span><span class="stat-value" id="finalSingleScore">0</span></div>
                <div class="stat-item" v-if="mode === 'double'"><span class="stat-label">P1 得分</span><span class="stat-value" id="finalP1Score">0</span></div>
                <div class="stat-item" v-if="mode === 'double'"><span class="stat-label">P2 得分</span><span class="stat-value" id="finalP2Score">0</span></div>
            </div>
            <button class="restart-btn" @click="backToMenu">返回主页</button>
            <button class="restart-btn secondary" @click="restartGame">再来一局</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

let canvas, ctx
let gameLoopId = null
let game, player1, player2, fishes, particles

const gameState = ref('menu')
const mode = ref('single')
const selectedMode = ref('single')
const selectedDifficulty = ref('normal')
const isPaused = ref(false)

const difficulties = [
    { id: 'easy', name: '简单', desc: '鱼少且慢' },
    { id: 'normal', name: '普通', desc: '平衡体验' },
    { id: 'hard', name: '困难', desc: '鱼多且快' },
    { id: 'nightmare', name: '噩梦', desc: '极限挑战' }
]

const diffSettings = {
    easy: { speedMult: 0.6, spawnRate: 0.7 },
    normal: { speedMult: 1, spawnRate: 1 },
    hard: { speedMult: 1.4, spawnRate: 1.3 },
    nightmare: { speedMult: 1.8, spawnRate: 1.6 }
}

class Particle {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.size = 3 + Math.random() * 5
        this.vx = (Math.random() - 0.5) * 10
        this.vy = (Math.random() - 0.5) * 10
        this.life = 1
        this.decay = 0.025 + Math.random() * 0.02
    }
    update() {
        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.95
        this.vy *= 0.95
        this.life -= this.decay
        this.size *= 0.96
        return this.life <= 0
    }
    draw() {
        ctx.globalAlpha = this.life
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
    }
}

class Fish {
    constructor(type) {
        this.type = type || 'normal'
        this.direction = Math.random() < 0.5 ? 1 : -1
        this.x = this.direction > 0 ? -50 : canvas.width + 50
        this.y = 60 + Math.random() * (canvas.height - 120)
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = 0.03 + Math.random() * 0.03
        
        const difficulty = game ? (game.level + game.time / 3000) : 1
        const speedMult = game ? game.speedMult : 1
        
        if (this.type === 'predator') {
            this.size = 40 + Math.random() * 35 + difficulty * 4
            this.speed = (1.5 + Math.random() * 1) * speedMult
            this.hue = 0
            this.saturation = 90
            this.lightness = 45
        } else if (this.type === 'fast') {
            this.size = 10 + Math.random() * 12
            this.speed = (2.5 + Math.random() * 1) * speedMult
            this.hue = 120 + Math.random() * 40
            this.saturation = 75
            this.lightness = 55
        } else {
            this.size = 8 + Math.random() * 20 + difficulty * 2
            this.speed = (0.6 + Math.random() * 0.8) * speedMult
            this.hue = 180 + Math.random() * 120
            this.saturation = 50 + Math.random() * 30
            this.lightness = 40 + Math.random() * 20
        }
    }
    
    update() {
        this.wobble += this.wobbleSpeed
        this.x += this.speed * this.direction
        this.y += Math.sin(this.wobble) * (this.type === 'fast' ? 2 : 1)
        
        if (this.x < -80 || this.x > canvas.width + 80 || this.y < -80 || this.y > canvas.height + 80) {
            return true
        }
        return false
    }
    
    draw() {

        ctx.save()
        ctx.translate(this.x, this.y)
        if (this.direction < 0) ctx.scale(-1, 1)
        
        const color = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
        const tailWag = Math.sin(this.wobble * (this.type === 'predator' ? 6 : 3)) * 0.25
        
        if (this.type === 'predator') {
            ctx.shadowColor = 'rgba(255,50,50,0.6)'
            ctx.shadowBlur = 25
        }
        
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        
        if (this.type === 'predator') {
            ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness - 10}%)`
            ctx.beginPath()
            ctx.moveTo(this.size * 0.2, 0)
            ctx.lineTo(this.size * 1.6, -this.size * 0.7)
            ctx.lineTo(this.size * 1.6, this.size * 0.7)
            ctx.closePath()
            ctx.fill()
            
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.arc(-this.size * 0.35, -this.size * 0.05, this.size * 0.12, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#cc0000'
            ctx.beginPath()
            ctx.arc(-this.size * 0.3, -this.size * 0.05, this.size * 0.06, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness + 15}%)`
            ctx.beginPath()
            ctx.ellipse(this.size * 0.35, 0, this.size * 0.35, this.size * 0.22, tailWag, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.arc(-this.size * 0.3, -this.size * 0.12, this.size * 0.1, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#111'
            ctx.beginPath()
            ctx.arc(-this.size * 0.25, -this.size * 0.12, this.size * 0.05, 0, Math.PI * 2)
            ctx.fill()
        }
        
        ctx.restore()
    }
}

onMounted(() => {
    initGame()
})

onUnmounted(() => {
    if (gameLoopId) cancelAnimationFrame(gameLoopId)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
})

function initGame() {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    canvas.width = 900
    canvas.height = 600
    
    drawMenuBackground()
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
}

function drawMenuBackground() {
    const gradient = ctx.createRadialGradient(450, 300, 0, 450, 300, 500)
    gradient.addColorStop(0, '#1a2a4a')
    gradient.addColorStop(0.5, '#0d1f3c')
    gradient.addColorStop(1, '#050a15')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < 60; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.02 + (i % 5) * 0.01})`
        ctx.beginPath()
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
    }
}

function handleKeyDown(e) {
    if (gameState.value !== 'playing') return
    
    if (e.key === ' ') {
        isPaused.value = !isPaused.value
        if (!isPaused.value) {
            gameLoopId = requestAnimationFrame(gameLoop)
        }
        e.preventDefault()
        return
    }
    
    const k = e.key.toLowerCase()
    
    if (k === 'w') { player1.keys.w = true; e.preventDefault() }
    if (k === 'a') { player1.keys.a = true; e.preventDefault() }
    if (k === 's') { player1.keys.s = true; e.preventDefault() }
    if (k === 'd') { player1.keys.d = true; e.preventDefault() }
    if (e.key === 'ArrowUp') { 
        if (mode.value === 'single') player1.keys.up = true
        else player2.keys.up = true
        e.preventDefault() 
    }
    if (e.key === 'ArrowDown') { 
        if (mode.value === 'single') player1.keys.down = true
        else player2.keys.down = true
        e.preventDefault() 
    }
    if (e.key === 'ArrowLeft') { 
        if (mode.value === 'single') player1.keys.left = true
        else player2.keys.left = true
        e.preventDefault() 
    }
    if (e.key === 'ArrowRight') { 
        if (mode.value === 'single') player1.keys.right = true
        else player2.keys.right = true
        e.preventDefault() 
    }
}

function handleKeyUp(e) {
    if (gameState.value !== 'playing') return
    const k = e.key.toLowerCase()
    
    if (k === 'w') player1.keys.w = false
    if (k === 'a') player1.keys.a = false
    if (k === 's') player1.keys.s = false
    if (k === 'd') player1.keys.d = false
    if (e.key === 'ArrowUp') { 
        if (mode.value === 'single') player1.keys.up = false
        else player2.keys.up = false
    }
    if (e.key === 'ArrowDown') { 
        if (mode.value === 'single') player1.keys.down = false
        else player2.keys.down = false
    }
    if (e.key === 'ArrowLeft') { 
        if (mode.value === 'single') player1.keys.left = false
        else player2.keys.left = false
    }
    if (e.key === 'ArrowRight') { 
        if (mode.value === 'single') player1.keys.right = false
        else player2.keys.right = false
    }
}

function startGame() {
    mode.value = selectedMode.value
    const diff = diffSettings[selectedDifficulty.value]
    
    game = {
        running: true,
        time: 0,
        level: 1,
        spawnTimer: 0,
        spawnInterval: 50 / diff.spawnRate,
        levelUpFlash: 0,
        speedMult: diff.speedMult,
        spawnRate: diff.spawnRate
    }
    
    player1 = {
        x: 450, y: canvas.height / 2,
        size: 20, color: '#00ffcc', glowColor: 'rgba(0,255,204,0.6)',
        lives: 5, score: 0, invulnerable: 0,
        speed: 4, vx: 0, vy: 0,
        keys: { w: false, a: false, s: false, d: false, up: false, down: false, left: false, right: false }
    }
    
    player2 = {
        x: canvas.width - 200, y: canvas.height / 2,
        size: 20, color: '#ff4466', glowColor: 'rgba(255,68,102,0.6)',
        lives: 5, score: 0, invulnerable: 0,
        speed: 4, vx: 0, vy: 0,
        keys: { up: false, down: false, left: false, right: false }
    }
    
    fishes = []
    particles = []
    
    for (let i = 0; i < 15; i++) {
        fishes.push(new Fish('normal'))
    }
    
    gameState.value = 'playing'
    document.getElementById('gameMenu').style.display = 'none'
    document.getElementById('gameOver').style.display = 'none'
    
    gameLoop()
}

function drawPlayer(p, isPlayer1) {
    ctx.save()
    ctx.translate(p.x, p.y)
    
    const angle = Math.atan2(p.vy, p.vx)
    if (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
        ctx.rotate(angle)
    }
    
    if (p.invulnerable > 0) {
        ctx.globalAlpha = 0.4 + Math.sin(p.invulnerable * 0.3) * 0.4
    }
    
    ctx.fillStyle = p.color
    ctx.shadowColor = p.glowColor
    ctx.shadowBlur = 25
    
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.moveTo(p.size * 0.3, 0)
    ctx.lineTo(p.size * 1.4, -p.size * 0.55)
    ctx.lineTo(p.size * 1.4, p.size * 0.55)
    ctx.closePath()
    ctx.fill()
    
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.beginPath()
    ctx.ellipse(-p.size * 0.15, -p.size * 0.15, p.size * 0.45, p.size * 0.22, -0.3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-p.size * 0.45, -p.size * 0.08, p.size * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(-p.size * 0.38, -p.size * 0.08, p.size * 0.08, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
    
    ctx.save()
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${p.size * 0.6}px Arial`
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.8)'
    ctx.shadowBlur = 4
    ctx.fillText(isPlayer1 ? '1' : '2', p.x, p.y - p.size - 8)
    ctx.restore()
    
    if (p.invulnerable > 0) p.invulnerable--
}

function spawnFish() {
    const difficulty = Math.min(game.level + game.time / 2000, 8)
    const spawnRate = game.spawnRate
    
    if (Math.random() < (0.12 + difficulty * 0.015) * spawnRate) {
        fishes.push(new Fish('predator'))
        showWarning()
    } else if (Math.random() < 0.3 * spawnRate) {
        fishes.push(new Fish('fast'))
    } else {
        fishes.push(new Fish('normal'))
    }
    
    if (Math.random() < (0.25 + game.level * 0.03) * spawnRate) {
        fishes.push(new Fish('normal'))
    }
}

function showWarning() {
    const warning = document.getElementById('warning')
    warning.style.opacity = 1
    setTimeout(() => warning.style.opacity = 0, 1200)
}

function checkCollision(p, fish) {
    return Math.hypot(p.x - fish.x, p.y - fish.y) < (p.size + fish.size) * 0.6
}

function createEatEffect(x, y, color) {
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, color))
    }
}

function updateUI() {
    const heartStr = (n) => '♥'.repeat(n) + '♡'.repeat(5 - n)
    
    const size1El = document.getElementById('size1')
    const lives1El = document.getElementById('lives1')
    const score1El = document.getElementById('score1')
    
    if (size1El) size1El.textContent = Math.round(player1.size)
    if (lives1El) lives1El.textContent = heartStr(player1.lives)
    if (score1El) score1El.textContent = player1.score
    
    if (mode.value === 'double') {
        const size2El = document.getElementById('size2')
        const lives2El = document.getElementById('lives2')
        const score2El = document.getElementById('score2')
        if (size2El) size2El.textContent = Math.round(player2.size)
        if (lives2El) lives2El.textContent = heartStr(player2.lives)
        if (score2El) score2El.textContent = player2.score
    } else {
        const levelEl = document.getElementById('levelDisplay')
        const speedEl = document.getElementById('speedDisplay')
        if (levelEl) levelEl.textContent = game.level
        if (speedEl) speedEl.textContent = game.speedMult.toFixed(1) + 'x'
    }
}

function checkLevelUp() {
    if (mode.value === 'single') {
        if (player1.score >= 100 * game.level) {
            game.level++
            game.spawnInterval = Math.min(game.spawnInterval + 15 / game.spawnRate, 80)
            game.speedMult = Math.min(game.speedMult + 0.1, 2.5)
            game.levelUpFlash = 60
            return true
        }
    } else {
        if (player1.score >= 100 * game.level || player2.score >= 100 * game.level) {
            game.level++
            game.spawnInterval = Math.min(game.spawnInterval + 15 / game.spawnRate, 80)
            game.levelUpFlash = 60
            return true
        }
    }
    return false
}

function gameOver(winner) {
    game.running = false
    gameState.value = 'over'
    
    document.getElementById('winnerText').textContent = winner === 'draw' ? '平局!' : `玩家 ${winner} 获胜!`
    document.getElementById('finalLevel').textContent = game.level
    
    if (mode.value === 'single') {
        document.getElementById('finalSingleScore').textContent = player1.score
    } else {
        document.getElementById('finalP1Score').textContent = player1.score
        document.getElementById('finalP2Score').textContent = player2.score
    }
    
    document.getElementById('gameOver').style.display = 'block'
}

function backToMenu() {
    gameState.value = 'menu'
    document.getElementById('gameOver').style.display = 'none'
    document.getElementById('gameMenu').style.display = 'flex'
    drawMenuBackground()
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none'
    startGame()
}

function drawBackground() {
    const t = game.time * 0.001
    const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(t) * 100,
        canvas.height / 2 + Math.cos(t * 0.7) * 50,
        0,
        canvas.width / 2, canvas.height / 2, 500
    )
    gradient.addColorStop(0, '#1a2a4a')
    gradient.addColorStop(0.5, '#0d1f3c')
    gradient.addColorStop(1, '#050a15')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < 60; i++) {
        const x = (i * 137 + game.time * 0.2) % canvas.width
        const y = (i * 89 + game.time * 0.1 * ((i % 3) + 1)) % canvas.height
        ctx.fillStyle = `rgba(255,255,255,${0.02 + (i % 5) * 0.01})`
        ctx.beginPath()
        ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
    }
}

function update() {
    game.time++
    game.spawnTimer++
    
    const spawnInterval = game.spawnInterval * game.spawnRate
    if (game.spawnTimer >= spawnInterval) {
        spawnFish()
        if (Math.random() < 0.3 + game.level * 0.03) spawnFish()
        game.spawnTimer = 0
    }
    
    const speed1 = Math.max(1.8, player1.speed - player1.size * 0.018)
    
    if (player1.keys.w || player1.keys.up) player1.vy = -speed1
    else if (player1.keys.s || player1.keys.down) player1.vy = speed1
    else player1.vy *= 0.88
    
    if (player1.keys.a || player1.keys.left) player1.vx = -speed1
    else if (player1.keys.d || player1.keys.right) player1.vx = speed1
    else player1.vx *= 0.88
    
    player1.x += player1.vx
    player1.y += player1.vy
    player1.x = Math.max(player1.size, Math.min(canvas.width - player1.size, player1.x))
    player1.y = Math.max(player1.size, Math.min(canvas.height - player1.size, player1.y))
    
    if (mode.value === 'double') {
        const speed2 = Math.max(1.8, player2.speed - player2.size * 0.018)
        if (player2.keys.up) player2.vy = -speed2
        else if (player2.keys.down) player2.vy = speed2
        else player2.vy *= 0.88
        
        if (player2.keys.left) player2.vx = -speed2
        else if (player2.keys.right) player2.vx = speed2
        else player2.vx *= 0.88
        
        player2.x += player2.vx
        player2.y += player2.vy
        player2.x = Math.max(player2.size, Math.min(canvas.width - player2.size, player2.x))
        player2.y = Math.max(player2.size, Math.min(canvas.height - player2.size, player2.y))
    }
    
    for (let i = fishes.length - 1; i >= 0; i--) {
        const fish = fishes[i]
        if (fish.update()) { fishes.splice(i, 1); continue }
        
        if (player1.invulnerable <= 0 && checkCollision(player1, fish)) {
            if (player1.size > fish.size * 1.1) {
                player1.size += Math.max(1, fish.size * 0.08)
                player1.score += Math.round(fish.size * 2 + (fish.type === 'predator' ? 50 : fish.type === 'fast' ? 20 : 5))
                createEatEffect(fish.x, fish.y, fish.type === 'predator' ? '#ff4444' : '#44ff88')
                fishes.splice(i, 1)
                if (checkLevelUp()) return
                continue
            } else if (fish.size > player1.size * 0.85 && fish.type !== 'fast') {
                player1.lives--
                player1.size = Math.max(15, player1.size - 8)
                player1.invulnerable = 90
                createEatEffect(player1.x, player1.y, '#ff0000')
                fishes.splice(i, 1)
                if (player1.lives <= 0) { 
                    if (mode.value === 'double') gameOver(2)
                    else gameOver(null)
                    return 
                }
                continue
            }
        }
        
        if (mode.value === 'double' && player2.invulnerable <= 0 && checkCollision(player2, fish)) {
            if (player2.size > fish.size * 1.1) {
                player2.size += Math.max(1, fish.size * 0.08)
                player2.score += Math.round(fish.size * 2 + (fish.type === 'predator' ? 50 : fish.type === 'fast' ? 20 : 5))
                createEatEffect(fish.x, fish.y, fish.type === 'predator' ? '#ff4444' : '#44ff88')
                fishes.splice(i, 1)
                if (checkLevelUp()) return
                continue
            } else if (fish.size > player2.size * 0.85 && fish.type !== 'fast') {
                player2.lives--
                player2.size = Math.max(15, player2.size - 8)
                player2.invulnerable = 90
                createEatEffect(player2.x, player2.y, '#ff0000')
                fishes.splice(i, 1)
                if (player2.lives <= 0) { gameOver(1); return }
                continue
            }
        }
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].update()) particles.splice(i, 1)
    }
    
    updateUI()
}

function draw() {
    if (!game || !fishes) {
        console.log('Game or fishes not ready')
        return
    }

    drawBackground()
    fishes.forEach(f => f.draw())
    particles.forEach(p => p.draw())
    drawPlayer(player1, true)
    if (mode.value === 'double') drawPlayer(player2, false)
    
    if (game.levelUpFlash > 0) {
        game.levelUpFlash--
        ctx.fillStyle = `rgba(255, 215, 0, ${game.levelUpFlash / 120})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.save()
        ctx.fillStyle = `rgba(255, 215, 0, ${game.levelUpFlash / 60})`
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
        ctx.shadowBlur = 20
        ctx.fillText(`第 ${game.level} 关`, canvas.width / 2, canvas.height / 2)
        ctx.restore()
    }
}

function gameLoop() {
    if (!game.running) return
    update()
    draw()
    if (!isPaused.value) {
        gameLoopId = requestAnimationFrame(gameLoop)
    }
}
</script>

<style scoped>
.game-view {
    min-height: calc(100vh - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}
#gameContainer { position: relative; }
canvas { display: block; border-radius: 8px; box-shadow: 0 0 60px rgba(78, 205, 196, 0.2); }
#ui { position: absolute; top: 10px; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 20px; pointer-events: none; }
.player-info { background: rgba(0, 0, 0, 0.7); padding: 12px 20px; border-radius: 8px; color: #fff; min-width: 160px; }
.player-info.p1 { border: 2px solid #4ecdc4; }
.player-info.p2 { border: 2px solid #ff6b6b; text-align: right; }
.player-name { font-size: 13px; opacity: 0.8; margin-bottom: 6px; }
.player-stats { font-size: 16px; font-weight: 600; }
.lives { color: #ffd93d; margin-top: 4px; font-size: 13px; }
.score { color: #aaa; margin-top: 2px; font-size: 12px; }
#warning { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: #ff6b6b; font-weight: bold; opacity: 0; pointer-events: none; text-shadow: 0 0 20px #ff6b6b; }
#pauseOverlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); border-radius: 8px; color: #fff; z-index: 100; }
#pauseOverlay h2 { font-size: 36px; margin-bottom: 12px; }
#pauseOverlay p { font-size: 16px; opacity: 0.7; }

#gameMenu, #gameOver {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.92); border-radius: 8px; color: #fff; padding: 40px;
}
.game-title { font-size: 42px; margin-bottom: 8px; background: linear-gradient(135deg, #4ecdc4, #44a08d, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.game-subtitle { font-size: 14px; opacity: 0.6; margin-bottom: 40px; letter-spacing: 2px; }
.menu-section { margin-bottom: 30px; text-align: center; }
.menu-section h3 { font-size: 16px; margin-bottom: 16px; opacity: 0.8; }
.mode-buttons, .difficulty-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.mode-btn, .diff-btn {
    background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px; padding: 20px 28px; color: #fff; cursor: pointer;
    transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 140px;
}
.mode-btn:hover, .diff-btn:hover { border-color: rgba(78, 205, 196, 0.5); background: rgba(78, 205, 196, 0.1); }
.mode-btn.active, .diff-btn.active { border-color: #4ecdc4; background: rgba(78, 205, 196, 0.15); box-shadow: 0 0 20px rgba(78, 205, 196, 0.3); }
.mode-icon { font-size: 32px; }
.mode-name, .diff-name { font-size: 16px; font-weight: 600; }
.mode-desc, .diff-desc { font-size: 12px; opacity: 0.6; }
.start-btn { background: linear-gradient(135deg, #4ecdc4, #44a08d); border: none; padding: 16px 48px; font-size: 18px; color: #fff; border-radius: 30px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; margin-top: 20px; }
.start-btn:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(78, 205, 196, 0.5); }
.controls-hint { margin-top: 30px; font-size: 13px; opacity: 0.6; text-align: center; line-height: 1.8; }

#gameOver h2 { font-size: 32px; margin-bottom: 12px; }
#gameOver p { font-size: 16px; opacity: 0.8; margin-bottom: 24px; }
.game-over-stats { display: flex; gap: 30px; margin-bottom: 30px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-label { font-size: 12px; opacity: 0.6; }
.stat-value { font-size: 28px; font-weight: bold; color: #4ecdc4; }
.restart-btn { background: linear-gradient(135deg, #4ecdc4, #44a08d); border: none; padding: 12px 32px; font-size: 16px; color: #fff; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; margin: 6px; }
.restart-btn:hover { transform: scale(1.05); }
.restart-btn.secondary { background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); }
.restart-btn.secondary:hover { border-color: #4ecdc4; }

@media (max-width: 920px) {
    canvas { width: 100%; height: auto; }
    #ui { flex-wrap: wrap; gap: 10px; position: relative; margin-bottom: 10px; }
    .player-info { min-width: 140px; }
    .mode-buttons, .difficulty-buttons { flex-direction: column; }
    .game-title { font-size: 28px; }
}
</style>
