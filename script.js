/**
 * ============================================================================
 * SPACE RUNNER — GAME ENGINE (Vanilla JS / ES6+)
 * 
 * Desenvolvido para apresentação e workshop.
 * Estrutura orientada a objetos (Classes JS) com renderização dinâmica no DOM,
 * colisão AABB, sintetizador de áudio via Web Audio API e controle de FPS.
 * ============================================================================
 */

/* ============================================================================
   1. GERENCIADOR DE ÁUDIO SINTETIZADO (Web Audio API)
   Sem necessidade de arquivos de áudio externos! Sintetiza sons via osciladores.
   ============================================================================ */
class SoundManager {
    constructor() {
        this.ctx = null;
    }

    /** Inicializa o Web Audio Context no primeiro clique do usuário */
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    /** Toca o som de coleta de cristal (tom agudo em ascensão) */
    playCrystalSound() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /** Toca o som de colisão com meteoro (ruído de impacto grave) */
    playHitSound() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /** Toca o som de subir de nível (fanfarra sintetizada curta) */
    playLevelUpSound() {
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        });
    }

    /** Toca o som de Game Over (tom caindo) */
    playGameOverSound() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
    }
}


/* ============================================================================
   2. CLASSE NAVE (SHIP)
   ============================================================================ */
class Ship {
    constructor(gameWidth, gameHeight) {
        this.width = 60;
        this.height = 70;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        // Posição inicial no centro inferior
        this.x = gameWidth / 2;
        this.y = gameHeight - 100;
        this.speed = 8;
        this.isMovingLeft = false;
        this.isMovingRight = false;

        // Criar elemento HTML no DOM com a imagem da nave
        this.element = document.createElement('div');
        this.element.className = 'game-object ship';
        this.element.innerHTML = `
            <img src="spaceship.png" class="ship-img" alt="Nave Espacial">
            <div class="ship-thrust"></div>
        `;
    }

    /** Atualiza a posição da nave no eixo X com limites da tela */
    update() {
        if (this.isMovingLeft) {
            this.x -= this.speed;
        }
        if (this.isMovingRight) {
            this.x += this.speed;
        }

        // Limita movimento dentro da largura do jogo
        const halfWidth = this.width / 2;
        if (this.x < halfWidth) this.x = halfWidth;
        if (this.x > this.gameWidth - halfWidth) this.x = this.gameWidth - halfWidth;
    }

    /** Atualiza a posição visual no DOM */
    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    /** Retorna a caixa de colisão (Bounding Box) da nave */
    getBounds() {
        return {
            left: this.x - this.width / 2 + 8, // Margem para colisão mais justa
            right: this.x + this.width / 2 - 8,
            top: this.y - this.height + 10,
            bottom: this.y - 10
        };
    }
}


/* ============================================================================
   3. CLASSE METEORO (METEOR)
   ============================================================================ */
class Meteor {
    constructor(gameWidth, speed) {
        this.width = 45;
        this.height = 45;
        this.x = Math.random() * (gameWidth - this.width) + this.width / 2;
        this.y = -this.height;
        this.speed = speed + (Math.random() * 2 - 1); // Variação leve na velocidade

        // Criar elemento HTML no DOM
        this.element = document.createElement('div');
        this.element.className = 'game-object meteor';
        this.element.innerHTML = `<div class="meteor-inner"></div>`;
    }

    /** Move o meteoro para baixo */
    update() {
        this.y += this.speed;
    }

    /** Atualiza a posição visual no DOM */
    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    /** Retorna caixa de colisão */
    getBounds() {
        const radius = this.width / 2 - 4;
        return {
            left: this.x - radius,
            right: this.x + radius,
            top: this.y - radius,
            bottom: this.y + radius
        };
    }
}


/* ============================================================================
   4. CLASSE CRISTAL (CRYSTAL)
   ============================================================================ */
class Crystal {
    constructor(gameWidth, speed) {
        this.width = 32;
        this.height = 32;
        this.x = Math.random() * (gameWidth - this.width) + this.width / 2;
        this.y = -this.height;
        this.speed = speed * 0.85; // Cristais caem ligeiramente mais devagar

        // Criar elemento HTML no DOM
        this.element = document.createElement('div');
        this.element.className = 'game-object crystal';
        this.element.innerHTML = `<div class="crystal-inner"></div>`;
    }

    /** Move o cristal para baixo */
    update() {
        this.y += this.speed;
    }

    /** Atualiza a posição no DOM */
    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    /** Retorna caixa de colisão */
    getBounds() {
        const radius = this.width / 2;
        return {
            left: this.x - radius,
            right: this.x + radius,
            top: this.y - radius,
            bottom: this.y + radius
        };
    }
}


/* ============================================================================
   5. CLASSE PARTÍCULA (PARTICLE SYSTEM)
   ============================================================================ */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 6 + 3;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.opacity = 1;
        this.lifeTime = 0.4 + Math.random() * 0.3; // Segundos de vida
        this.age = 0;

        // Criar elemento HTML
        this.element = document.createElement('div');
        this.element.className = 'particle';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundColor = this.color;
        this.element.style.boxShadow = `0 0 10px ${this.color}`;
    }

    update(deltaTime) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.age += deltaTime;
        this.opacity = Math.max(0, 1 - (this.age / this.lifeTime));
    }

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = this.opacity;
    }
}


/* ============================================================================
   6. GERENCIADOR DE JOYSTICK (Web Serial API)
   ============================================================================ */
class JoystickManager {
    constructor() {
        this.port = null;
        this.reader = null;
        this.direction = 0; // -1 left, 0 idle, 1 right
        this.connected = false;
        this.btnA = false;
        this.btnB = false;
        this.onDirectionChange = null;
        this.decoder = new TextDecoder();
        this.buffer = '';
        this.disconnecting = false;
    }

    async connect() {
        try {
            if (!('serial' in navigator)) {
                alert('Web Serial API não suportada. Use Chrome ou Edge.');
                return false;
            }
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });
            this.connected = true;
            this.startReading();
            return true;
        } catch (e) {
            if (e.name !== 'NotFoundError') console.error('Joystick connection error:', e);
            this.disconnect();
            return false;
        }
    }

    async startReading() {
        if (!this.port || !this.port.readable) return;
        let localReader;
        try {
            localReader = this.port.readable.getReader();
            this.reader = localReader;
            while (true) {
                const { value, done } = await localReader.read();
                if (done) break;
                this.buffer += this.decoder.decode(value, { stream: true });
                const lines = this.buffer.split('\n');
                this.buffer = lines.pop();
                for (const line of lines) {
                    if (line.trim()) this.parse(line.trim());
                }
            }
        } catch (e) {
            if (e.name !== 'AbortError') console.error('Serial error:', e);
        } finally {
            if (localReader) {
                try { localReader.releaseLock(); } catch (_) {}
            }
            if (this.reader === localReader) {
                this.reader = null;
            }
            if (this.connected) {
                await this.disconnect();
            }
        }
    }

    parse(data) {
        const parts = data.split(',');
        if (parts.length < 8) return;

        this.direction = parseInt(parts[0], 10);
        this.btnA = parts[1] === '1';
        this.btnB = parts[2] === '1';

        if (this.onDirectionChange) {
            this.onDirectionChange(this.direction);
        }
    }

    async disconnect() {
        if (this.disconnecting) return;
        this.disconnecting = true;
        this.connected = false;
        this.direction = 0;
        if (this.reader) {
            try { await this.reader.cancel(); } catch (_) {}
            try { this.reader.releaseLock(); } catch (_) {}
            this.reader = null;
        }
        if (this.port) {
            try { await this.port.close(); } catch (_) {}
            this.port = null;
        }
        this.disconnecting = false;
        // Atualizar UI se o botão existir
        const btn = document.getElementById('btn-connect-joystick');
        const label = document.getElementById('joystick-label');
        const status = document.getElementById('joystick-status');
        if (btn) { btn.classList.remove('connected'); btn.disabled = false; }
        if (label) label.textContent = 'Conectar Joystick';
        if (status) status.classList.remove('active');
    }
}


/* ============================================================================
   7. MOTOR PRINCIPAL DO JOGO (GAME ENGINE)
   ============================================================================ */
class SpaceRunnerGame {
    constructor() {
        // Elementos DOM das Telas
        this.menuScreen = document.getElementById('menu-screen');
        this.howToPlayScreen = document.getElementById('how-to-play-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('gameover-screen');

        // Elementos DOM do Jogo e HUD
        this.gameArea = document.getElementById('game-area');
        this.hudScore = document.getElementById('hud-score');
        this.hudLives = document.getElementById('hud-lives');
        this.hudTime = document.getElementById('hud-time');
        this.hudLevel = document.getElementById('hud-level');
        this.hudBest = document.getElementById('hud-best');
        this.menuBestScore = document.getElementById('menu-best-score');
        this.pauseOverlay = document.getElementById('pause-overlay');
        this.levelUpToast = document.getElementById('level-up-toast');
        this.toastLevel = document.getElementById('toast-level');
        this.fpsCounter = document.getElementById('fps-counter');

        // Elementos de Game Over
        this.goScore = document.getElementById('go-score');
        this.goTime = document.getElementById('go-time');
        this.goLevel = document.getElementById('go-level');
        this.goBest = document.getElementById('go-best');

        // Instância do Gerenciador de Sons
        this.soundManager = new SoundManager();

        // Instância do Gerenciador de Joystick (compartilhada)
        if (!window.joystickManager) {
            window.joystickManager = new JoystickManager();
        }
        this.joystick = window.joystickManager;

        // Estado do Jogo
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.timeElapsed = 0;
        this.level = 1;
        this.bestScore = parseInt(localStorage.getItem('space_runner_best') || '0', 10);

        // Parâmetros de Dificuldade
        this.baseSpeed = 6;
        this.meteorSpawnInterval = 800; // ms
        this.crystalSpawnInterval = 1500; // ms
        this.lastMeteorSpawn = 0;
        this.lastCrystalSpawn = 0;

        // Entidades ativas
        this.ship = null;
        this.meteors = [];
        this.crystals = [];
        this.particles = [];

        // Controle de Tempo e FPS
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fpsTimer = 0;
        this.fps = 60;
        this.timerInterval = null;

        // Eventos e Inicialização
        this.initDOMEvents();
        this.updateBestScoreDisplays();
    }

    /** Atualiza o recorde na tela inicial e no HUD */
    updateBestScoreDisplays() {
        this.menuBestScore.textContent = this.bestScore;
        this.hudBest.textContent = this.bestScore;
    }

    /** Configura ouvintes de eventos da UI e Teclado */
    initDOMEvents() {
        // Botões do Menu
        document.getElementById('btn-play').addEventListener('click', () => {
            if ('serial' in navigator && !this.joystick.connected) {
                if (!confirm('Conecte o joystick antes de jogar!\n\nClique em "Conectar Joystick" no menu ou clique OK para jogar sem joystick.')) {
                    return;
                }
            }
            this.soundManager.init();
            this.iniciarJogo();
        });

        document.getElementById('btn-how-to-play').addEventListener('click', () => {
            this.soundManager.init();
            this.showScreen(this.howToPlayScreen);
        });

        document.getElementById('btn-back-menu').addEventListener('click', () => {
            this.showScreen(this.menuScreen);
        });

        document.getElementById('btn-retry').addEventListener('click', () => {
            this.soundManager.init();
            this.iniciarJogo();
        });

        document.getElementById('btn-go-menu').addEventListener('click', () => {
            this.showScreen(this.menuScreen);
        });

        // Controles de Teclado
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Controles Mobile (Botões Virtuais)
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');

        const startLeft = (e) => { e.preventDefault(); if (this.ship) this.ship.isMovingLeft = true; };
        const endLeft = (e) => { e.preventDefault(); if (this.ship) this.ship.isMovingLeft = false; };
        const startRight = (e) => { e.preventDefault(); if (this.ship) this.ship.isMovingRight = true; };
        const endRight = (e) => { e.preventDefault(); if (this.ship) this.ship.isMovingRight = false; };

        btnLeft.addEventListener('touchstart', startLeft, { passive: false });
        btnLeft.addEventListener('touchend', endLeft, { passive: false });
        btnLeft.addEventListener('mousedown', startLeft);
        btnLeft.addEventListener('mouseup', endLeft);

        btnRight.addEventListener('touchstart', startRight, { passive: false });
        btnRight.addEventListener('touchend', endRight, { passive: false });
        btnRight.addEventListener('mousedown', startRight);
        btnRight.addEventListener('mouseup', endRight);

        // Redimensionamento de Tela
        window.addEventListener('resize', () => {
            if (this.ship) {
                this.ship.gameWidth = this.gameArea.clientWidth;
                this.ship.gameHeight = this.gameArea.clientHeight;
            }
        });
    }

    /** Troca a tela exibida */
    showScreen(targetScreen) {
        [this.menuScreen, this.howToPlayScreen, this.gameScreen, this.gameOverScreen].forEach(s => {
            s.classList.remove('active');
        });
        targetScreen.classList.add('active');
    }

    /** Trata teclas pressionadas */
    handleKeyDown(e) {
        if (!this.isRunning) return;

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            if (this.ship) this.ship.isMovingLeft = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            if (this.ship) this.ship.isMovingRight = true;
        }

        // Tecla P - Pausar
        if (e.key === 'p' || e.key === 'P') {
            this.togglePause();
        }

        // Tecla R - Reiniciar
        if (e.key === 'r' || e.key === 'R') {
            this.reiniciar();
        }
    }

    /** Trata soltura de teclas */
    handleKeyUp(e) {
        if (!this.ship) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.ship.isMovingLeft = false;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.ship.isMovingRight = false;
        }
    }

    /** Alterna o estado de pausa do jogo */
    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseOverlay.removeAttribute('hidden');
        } else {
            this.pauseOverlay.setAttribute('hidden', 'true');
            this.lastFrameTime = performance.now();
        }
    }

    /**
     * INICIAR JOGO
     * Reseta estados, cria a nave e inicia o loop de animação.
     */
    iniciarJogo() {
        // Limpar área de jogo anterior
        this.gameArea.innerHTML = '';

        // Reset de Variáveis de Estado
        this.score = 0;
        this.lives = 3;
        this.timeElapsed = 0;
        this.level = 1;
        this.baseSpeed = 6;
        this.meteorSpawnInterval = 800;
        this.crystalSpawnInterval = 1500;
        this.meteors = [];
        this.crystals = [];
        this.particles = [];
        this.isRunning = true;
        this.isPaused = false;

        // Reset de Temas / Cores
        document.documentElement.style.setProperty('--theme-hue-shift', '0deg');

        // Mostrar tela do jogo PRIMEIRO para que as dimensões estejam disponíveis
        this.showScreen(this.gameScreen);

        // Criar Nave
        const width = this.gameArea.clientWidth || window.innerWidth;
        const height = this.gameArea.clientHeight || window.innerHeight;
        this.ship = new Ship(width, height);
        this.gameArea.appendChild(this.ship.element);

        // Atualizar HUD
        this.atualizarHUD();
        this.pauseOverlay.setAttribute('hidden', 'true');

        // Cronômetro do tempo de sobrevivência (1s)
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.timeElapsed++;
                this.hudTime.textContent = `${this.timeElapsed}s`;
            }
        }, 1000);

        // Iniciar Gameloop
        this.lastFrameTime = performance.now();
        this.lastMeteorSpawn = performance.now();
        this.lastCrystalSpawn = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**
     * LOOP PRINCIPAL DE ANIMAÇÃO (Gameloop via requestAnimationFrame)
     */
    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calcular Delta Time (em segundos)
        const deltaTime = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;

        // Cálculo de FPS (opcional)
        this.frameCount++;
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 0.5) {
            this.fps = Math.round(this.frameCount / this.fpsTimer);
            this.fpsCounter.textContent = `FPS: ${this.fps}`;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        // Se não estiver pausado, executa atualização e renderização
        if (!this.isPaused) {
            this.atualizar(timestamp, deltaTime);
            this.desenhar();
        }

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    /**
     * ATUALIZAR (Lógica de física, posições, spawns e colisões)
     */
    atualizar(timestamp, deltaTime) {
        // 0. Dificuldade gradativa baseada no tempo decorrido
        const t = this.timeElapsed;
        const speedBonus = t * 0.15 + this.score * 0.02;
        const currentSpeed = this.baseSpeed + speedBonus;
        const currentMeteorInterval = Math.max(200, this.meteorSpawnInterval - t * 10);
        const currentCrystalInterval = Math.max(500, this.crystalSpawnInterval - t * 12);

        // 1. Input do Joystick (sobrescreve teclado se conectado)
        if (this.ship && this.joystick.connected) {
            this.ship.isMovingLeft = this.joystick.direction === -1;
            this.ship.isMovingRight = this.joystick.direction === 1;
        }

        // 2. Atualizar Nave
        if (this.ship) {
            this.ship.update();
        }

        // 2. Spawn de Meteoros
        if (timestamp - this.lastMeteorSpawn > currentMeteorInterval) {
            this.criarMeteoros(currentSpeed);
            this.lastMeteorSpawn = timestamp;
        }

        // 3. Spawn de Cristais
        if (timestamp - this.lastCrystalSpawn > currentCrystalInterval) {
            this.criarCristais(currentSpeed);
            this.lastCrystalSpawn = timestamp;
        }

        // 4. Atualizar Meteoros
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            meteor.update();

            // Remover meteoros fora da tela
            if (meteor.y > this.gameArea.clientHeight + 50) {
                meteor.element.remove();
                this.meteors.splice(i, 1);
            }
        }

        // 5. Atualizar Cristais
        for (let i = this.crystals.length - 1; i >= 0; i--) {
            const crystal = this.crystals[i];
            crystal.update();

            // Remover cristais fora da tela
            if (crystal.y > this.gameArea.clientHeight + 50) {
                crystal.element.remove();
                this.crystals.splice(i, 1);
            }
        }

        // 6. Atualizar Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(deltaTime);
            if (p.opacity <= 0) {
                p.element.remove();
                this.particles.splice(i, 1);
            }
        }

        // 7. Checar Colisões
        this.detectarColisoes();
    }

    /**
     * DESENHAR (Atualiza posições visuais no DOM)
     */
    desenhar() {
        if (this.ship) this.ship.render();
        this.meteors.forEach(m => m.render());
        this.crystals.forEach(c => c.render());
        this.particles.forEach(p => p.render());
    }

    /**
     * CRIAR METEOROS
     */
    criarMeteoros(speed) {
        const t = this.timeElapsed;
        let qtd = 2;
        if (t > 15) qtd = 3;
        if (t > 30) qtd = 4;
        if (t > 50) qtd = 5;
        for (let i = 0; i < qtd; i++) {
            const meteor = new Meteor(this.gameArea.clientWidth, speed);
            this.meteors.push(meteor);
            this.gameArea.appendChild(meteor.element);
        }
    }

    /**
     * CRIAR CRISTAIS
     */
    criarCristais(speed) {
        const qtd = this.timeElapsed > 30 ? 2 : 1;
        for (let i = 0; i < qtd; i++) {
            const crystal = new Crystal(this.gameArea.clientWidth, speed);
            this.crystals.push(crystal);
            this.gameArea.appendChild(crystal.element);
        }
    }

    /**
     * SISTEMA DE DETECÇÃO DE COLISÕES (AABB - Axis-Aligned Bounding Box)
     */
    detectarColisoes() {
        if (!this.ship) return;
        const shipBounds = this.ship.getBounds();

        // 1. Colisão Nave x Meteoro
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            const mBounds = meteor.getBounds();

            if (this.checarSobreposicao(shipBounds, mBounds)) {
                // Efeito visual e sonoro de impacto
                this.criarExplosao(meteor.x, meteor.y, '#ff0844', 15);
                this.soundManager.playHitSound();

                // Efeito flash de dano na tela
                this.gameScreen.classList.add('screen-damage');
                setTimeout(() => this.gameScreen.classList.remove('screen-damage'), 300);

                // Perder vida
                this.lives--;
                this.atualizarHUD();

                // Remover meteoro
                meteor.element.remove();
                this.meteors.splice(i, 1);

                // Checar Game Over
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }

        // 2. Colisão Nave x Cristal
        for (let i = this.crystals.length - 1; i >= 0; i--) {
            const crystal = this.crystals[i];
            const cBounds = crystal.getBounds();

            if (this.checarSobreposicao(shipBounds, cBounds)) {
                // Ganhar pontos
                const pontosGanhos = 50;
                this.score += pontosGanhos;

                // Efeitos visuais e sonoros
                this.soundManager.playCrystalSound();
                this.criarExplosao(crystal.x, crystal.y, '#00f2fe', 12);
                this.exibirFeedbackPontos(crystal.x, crystal.y, `+${pontosGanhos}`);

                // Checar progressão de nível
                this.checarProgressaoNivel();

                // Atualizar HUD
                this.atualizarHUD();

                // Remover cristal
                crystal.element.remove();
                this.crystals.splice(i, 1);
            }
        }
    }

    /** Função utilitária AABB para intersecção de retângulos */
    checarSobreposicao(a, b) {
        return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );
    }

    /** Cria uma explosão de partículas coloridas */
    criarExplosao(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const p = new Particle(x, y, color);
            this.particles.push(p);
            this.gameArea.appendChild(p.element);
        }
    }

    /** Exibe texto flutuante ao ganhar pontos (+50) */
    exibirFeedbackPontos(x, y, text) {
        const floatEl = document.createElement('div');
        floatEl.className = 'score-float';
        floatEl.textContent = text;
        floatEl.style.left = `${x}px`;
        floatEl.style.top = `${y}px`;

        this.gameArea.appendChild(floatEl);

        setTimeout(() => {
            floatEl.remove();
        }, 800);
    }

    /**
     * DESAFIO EXTRA — PROGRESSÃO DE NÍVEIS
     * Nível 2: 100 pts | Nível 3: 250 pts | Nível 4: 500 pts
     */
    checarProgressaoNivel() {
        let novoNivel = 1;
        if (this.score >= 500) {
            novoNivel = 4;
        } else if (this.score >= 250) {
            novoNivel = 3;
        } else if (this.score >= 100) {
            novoNivel = 2;
        }

        if (novoNivel > this.level) {
            this.level = novoNivel;
            this.soundManager.playLevelUpSound();

            // Ajustar dificuldade
            this.baseSpeed = 6 + (this.level - 1) * 2.5;
            this.meteorSpawnInterval = Math.max(350, 800 - (this.level - 1) * 150);

            // Alterar levemente a cor/tom do cenário
            const hueShifts = { 2: '45deg', 3: '140deg', 4: '280deg' };
            document.documentElement.style.setProperty('--theme-hue-shift', hueShifts[this.level] || '0deg');

            // Exibir Toast de Novo Nível
            this.toastLevel.textContent = this.level;
            this.levelUpToast.removeAttribute('hidden');
            setTimeout(() => {
                this.levelUpToast.setAttribute('hidden', 'true');
            }, 1500);
        }
    }

    /**
     * ATUALIZAR HUD
     */
    atualizarHUD() {
        this.hudScore.textContent = this.score;
        this.hudLives.textContent = '❤️'.repeat(Math.max(0, this.lives));
        this.hudLevel.textContent = this.level;

        // Atualizar recorde em tempo real se superado
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('space_runner_best', this.bestScore.toString());
            this.updateBestScoreDisplays();
        }
    }

    /**
     * GAME OVER
     */
    gameOver() {
        this.isRunning = false;
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.soundManager.playGameOverSound();

        // Atualizar estatísticas da tela de Game Over
        this.goScore.textContent = this.score;
        this.goTime.textContent = `${this.timeElapsed}s`;
        this.goLevel.textContent = this.level;
        this.goBest.textContent = this.bestScore;

        // Exibir tela de Game Over
        this.showScreen(this.gameOverScreen);
    }

    /** REINICIAR (via tecla R ou botão) */
    reiniciar() {
        this.iniciarJogo();
    }
}


/* ============================================================================
   8. INICIALIZAÇÃO DA APLICAÇÃO QUANDO O DOM ESTIVER PRONTO
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    window.spaceRunnerApp = new SpaceRunnerGame();

    // --- Conexão do Joystick (menu) ---
    const joystick = window.spaceRunnerApp.joystick;
    const btnJoy = document.getElementById('btn-connect-joystick');
    const joyLabel = document.getElementById('joystick-label');
    const joyStatus = document.getElementById('joystick-status');
    const menuJoystick = document.getElementById('menu-joystick');

    // Esconder se Web Serial não for suportada
    if (!('serial' in navigator)) {
        if (menuJoystick) menuJoystick.style.display = 'none';
    }

    if (btnJoy) {
        btnJoy.addEventListener('click', async () => {
            if (joystick.connected) {
                await joystick.disconnect();
                btnJoy.classList.remove('connected');
                joyStatus.classList.remove('active');
                joyLabel.textContent = 'Conectar Joystick';
                return;
            }
            btnJoy.disabled = true;
            joyLabel.textContent = 'Conectando...';
            const ok = await joystick.connect();
            btnJoy.disabled = false;
            if (ok) {
                btnJoy.classList.add('connected');
                joyStatus.classList.add('active');
                joyLabel.textContent = '✓ Joystick Conectado';
            } else {
                joyLabel.textContent = 'Conectar Joystick';
            }
        });
    }

});
