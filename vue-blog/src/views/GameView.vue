<template>
  <div class="game-view">
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        <div id="ui">
            <div class="player-info p1">
                <div class="player-name">玩家 1 - WASD</div>
                <div class="player-stats">体型: <span id="size1">20</span></div>
                <div class="score">得分: <span id="score1">0</span></div>
                <div class="lives">生命: <span id="lives1">♥♥♥♥♥</span></div>
            </div>
            <div class="player-info p2">
                <div class="player-name">方向键控制</div>
                <div class="player-stats">体型: <span id="size2">20</span></div>
                <div class="score">得分: <span id="score2">0</span></div>
                <div class="lives">生命: <span id="lives2">♥♥♥♥♥</span></div>
            </div>
        </div>
        <div id="warning">⚠ 大鱼来袭!</div>
        <div id="startScreen">
            <h1>深海大作战</h1>
            <p class="subtitle">挑战版</p>
            <div class="controls">
                <strong style="color:#4ecdc4">玩家 1</strong>: W A S D 控制移动<br>
                <strong style="color:#ff6b6b">玩家 2</strong>: ↑ ← ↓ → 控制移动<br><br>
                <strong>规则:</strong><br>
                • 吃小鱼得分，大鱼扣命<br>
                • 体型越大速度越慢<br>
                • 随时间推移危险增加<br>
                • 到达100分进入下一关
            </div>
            <button class="btn" id="startBtn">开始挑战</button>
        </div>
        <div id="gameOver">
            <h2 id="winnerText">游戏结束</h2>
            <p id="finalScore"></p>
            <button class="btn" id="restartBtn">再来一局</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let canvas, ctx, game, player1, player2, fishes, particles, bubbles
let gameLoopId = null

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
    
    game = {
        running: false,
        time: 0,
        level: 1,
        spawnTimer: 0,
        spawnInterval: 45,
        levelUpFlash: 0
    }
    
    player1 = {
        x: 200, y: canvas.height / 2,
        size: 20, color: '#00ffcc', glowColor: 'rgba(0,255,204,0.6)',
        lives: 5, score: 0, invulnerable: 0,
        speed: 4, vx: 0, vy: 0,
        keys: { w: false, a: false, s: false, d: false }
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
    bubbles = []
    
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y
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
    
    class Bubble {
        constructor() { this.reset() }
        reset() {
            this.x = Math.random() * canvas.width
            this.y = canvas.height + 20
            this.size = 2 + Math.random() * 6
            this.speed = 0.5 + Math.random() * 1.5
            this.wobble = Math.random() * Math.PI * 2
            this.wobbleSpeed = 0.02 + Math.random() * 0.02
        }
        update() {
            this.y -= this.speed
            this.wobble += this.wobbleSpeed
            this.x += Math.sin(this.wobble) * 0.5
            if (this.y < -20) this.reset()
        }
        draw() {
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.stroke()
        }
    }
    
    for (let i = 0; i < 30; i++) {
        const b = new Bubble()
        b.y = Math.random() * canvas.height
        bubbles.push(b)
    }
    
    window.Particle = Particle
    window.Bubble = Bubble
    
    drawBackground()
    
    document.getElementById('startBtn').addEventListener('click', startGame)
    document.getElementById('restartBtn').addEventListener('click', startGame)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
}

function handleKeyDown(e) {
    const k = e.key.toLowerCase()
    if (k === 'w') { player1.keys.w = true; e.preventDefault() }
    if (k === 'a') { player1.keys.a = true; e.preventDefault() }
    if (k === 's') { player1.keys.s = true; e.preventDefault() }
    if (k === 'd') { player1.keys.d = true; e.preventDefault() }
    if (e.key === 'ArrowUp') { player2.keys.up = true; e.preventDefault() }
    if (e.key === 'ArrowDown') { player2.keys.down = true; e.preventDefault() }
    if (e.key === 'ArrowLeft') { player2.keys.left = true; e.preventDefault() }
    if (e.key === 'ArrowRight') { player2.keys.right = true; e.preventDefault() }
}

function handleKeyUp(e) {
    const k = e.key.toLowerCase()
    if (k === 'w') player1.keys.w = false
    if (k === 'a') player1.keys.a = false
    if (k === 's') player1.keys.s = false
    if (k === 'd') player1.keys.d = false
    if (e.key === 'ArrowUp') player2.keys.up = false
    if (e.key === 'ArrowDown') player2.keys.down = false
    if (e.key === 'ArrowLeft') player2.keys.left = false
    if (e.key === 'ArrowRight') player2.keys.right = false
}

class Fish {
    constructor(type = 'normal') {
        this.type = type
        this.direction = Math.random() < 0.5 ? 1 : -1
        this.x = this.direction > 0 ? -50 : canvas.width + 50
        this.y = 60 + Math.random() * (canvas.height - 120)
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = 0.03 + Math.random() * 0.03
        
        const difficulty = game.level + game.time / 3000
        
        if (type === 'predator') {
            this.size = 40 + Math.random() * 35 + difficulty * 4
            this.speed = 1.5 + Math.random() * 1
            this.hue = 0
            this.saturation = 90
            this.lightness = 45
        } else if (type === 'fast') {
            this.size = 10 + Math.random() * 12
            this.speed = 2.5 + Math.random() * 1
            this.hue = 120 + Math.random() * 40
            this.saturation = 75
            this.lightness = 55
        } else {
            this.size = 8 + Math.random() * 20 + difficulty * 2
            this.speed = 0.6 + Math.random() * 0.8
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
    
    if (Math.random() < 0.12 + difficulty * 0.015) {
        fishes.push(new Fish('predator'))
        showWarning()
    } else if (Math.random() < 0.3) {
        fishes.push(new Fish('fast'))
    } else {
        fishes.push(new Fish('normal'))
    }
    
    if (Math.random() < 0.25 + game.level * 0.03) {
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
        particles.push(new window.Particle(x, y, color))
    }
}

function updateUI() {
    const heartStr = (n) => '♥'.repeat(n) + '♡'.repeat(5 - n)
    document.getElementById('size1').textContent = Math.round(player1.size)
    document.getElementById('size2').textContent = Math.round(player2.size)
    document.getElementById('lives1').textContent = heartStr(player1.lives)
    document.getElementById('lives2').textContent = heartStr(player2.lives)
    document.getElementById('score1').textContent = player1.score
    document.getElementById('score2').textContent = player2.score
}

function checkLevelUp() {
    if (player1.score >= 100 * game.level || player2.score >= 100 * game.level) {
        game.level++
        game.spawnInterval = Math.min(game.spawnInterval + 15, 80)
        game.levelUpFlash = 60
        return true
    }
    return false
}

function gameOver(winner) {
    game.running = false
    document.getElementById('winnerText').textContent = winner === 'draw' ? '平局!' : `玩家 ${winner} 获胜!`
    document.getElementById('finalScore').textContent = `最终关卡: ${game.level} | P1: ${player1.score}分 P2: ${player2.score}分`
    document.getElementById('gameOver').style.display = 'block'
}

function drawBackground() {
    const t = game ? game.time * 0.001 : 0
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
    
    if (bubbles) {
        bubbles.forEach(b => {
            b.update()
            b.draw()
        })
    }
    
    for (let i = 0; i < 60; i++) {
        const x = (i * 137 + (game ? game.time * 0.2 : 0)) % canvas.width
        const y = (i * 89 + (game ? game.time * 0.1 * ((i % 3) + 1) : 0)) % canvas.height
        ctx.fillStyle = `rgba(255,255,255,${0.02 + (i % 5) * 0.01})`
        ctx.beginPath()
        ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2)
        ctx.fill()
    }
}

function update() {
    game.time++
    game.spawnTimer++
    
    if (game.spawnTimer >= game.spawnInterval) {
        spawnFish()
        if (Math.random() < 0.3 + game.level * 0.03) spawnFish()
        game.spawnTimer = 0
    }
    
    const speed1 = Math.max(1.8, player1.speed - player1.size * 0.018)
    if (player1.keys.w) player1.vy = -speed1
    else if (player1.keys.s) player1.vy = speed1
    else player1.vy *= 0.88
    
    if (player1.keys.a) player1.vx = -speed1
    else if (player1.keys.d) player1.vx = speed1
    else player1.vx *= 0.88
    
    player1.x += player1.vx
    player1.y += player1.vy
    player1.x = Math.max(player1.size, Math.min(canvas.width - player1.size, player1.x))
    player1.y = Math.max(player1.size, Math.min(canvas.height - player1.size, player1.y))
    
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
                if (player1.lives <= 0) { gameOver(2); return }
                continue
            }
        }
        
        if (player2.invulnerable <= 0 && checkCollision(player2, fish)) {
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
    drawBackground()
    fishes.forEach(f => f.draw())
    particles.forEach(p => p.draw())
    drawPlayer(player1, true)
    drawPlayer(player2, false)
    
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
    gameLoopId = requestAnimationFrame(gameLoop)
}

function startGame() {
    player1.size = 20; player1.lives = 5; player1.score = 0
    player1.x = 200; player1.y = canvas.height / 2
    player1.vx = 0; player1.vy = 0; player1.invulnerable = 0
    
    player2.size = 20; player2.lives = 5; player2.score = 0
    player2.x = canvas.width - 200; player2.y = canvas.height / 2
    player2.vx = 0; player2.vy = 0; player2.invulnerable = 0
    
    fishes = []; particles = []
    game.time = 0; game.level = 1; game.spawnTimer = 0; game.levelUpFlash = 0
    game.spawnInterval = 45
    
    for (let i = 0; i < 15; i++) spawnFish()
    
    document.getElementById('startScreen').style.display = 'none'
    document.getElementById('gameOver').style.display = 'none'
    
    game.running = true
    gameLoop()
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

#gameContainer {
    position: relative;
}

canvas {
    display: block;
    border-radius: 8px;
    box-shadow: 0 0 60px rgba(78, 205, 196, 0.2);
}

#ui {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    pointer-events: none;
}

.player-info {
    background: rgba(0, 0, 0, 0.7);
    padding: 12px 20px;
    border-radius: 8px;
    color: #fff;
    min-width: 180px;
}

.player-info.p1 {
    border: 2px solid #4ecdc4;
}

.player-info.p2 {
    border: 2px solid #ff6b6b;
    text-align: right;
}

.player-name {
    font-size: 13px;
    opacity: 0.8;
    margin-bottom: 6px;
}

.player-stats {
    font-size: 16px;
    font-weight: 600;
}

.lives {
    color: #ffd93d;
    margin-top: 4px;
    font-size: 13px;
}

.score {
    color: #aaa;
    margin-top: 2px;
    font-size: 12px;
}

#warning {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #ff6b6b;
    font-weight: bold;
    opacity: 0;
    pointer-events: none;
    text-shadow: 0 0 20px #ff6b6b;
}

#gameOver, #startScreen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    padding: 40px 60px;
    border-radius: 16px;
    text-align: center;
    color: #fff;
}

#gameOver {
    display: none;
}

#startScreen h1 {
    font-size: 32px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

#startScreen .subtitle {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 24px;
}

.controls {
    text-align: left;
    margin-bottom: 24px;
    line-height: 1.8;
    font-size: 13px;
    opacity: 0.9;
    background: rgba(255,255,255,0.05);
    padding: 16px;
    border-radius: 8px;
}

.btn {
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
    border: none;
    padding: 12px 32px;
    font-size: 16px;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
}

@media (max-width: 920px) {
    canvas {
        width: 100%;
        height: auto;
    }
    
    #ui {
        flex-direction: column;
        align-items: center;
        gap: 10px;
        position: relative;
        margin-bottom: 10px;
    }
    
    .player-info.p2 {
        text-align: left;
    }
}
</style>
